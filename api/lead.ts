import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';
import { checkRateLimit } from './_lib/ratelimit.js';

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  pincode?: string;
  contactTime?: string;
  product?: string;
  size?: string;
  price?: string;
  notes?: string;
  source: string;
  aiSummary?: string;
  orderId?: string;
}

const SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL || process.env.VITE_PUBLIC_GOOGLE_SCRIPT_URL || '';

// Accepts bare 10-digit Indian mobiles and +91/91-prefixed ones; normalizes
// to 10 digits before writing so the Sheet stays dedupe-friendly.
const phoneSchema = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => /^91?[6-9]\d{9}$/.test(v) || /^[6-9]\d{9}$/.test(v), {
    message: 'phone must be a 10-digit Indian mobile number',
  })
  .transform((v) => (v.length === 12 && v.startsWith('91') ? v.slice(2) : v));

const short = (max: number) => z.string().max(max);

const bodySchema = z.object({
  name: short(80).pipe(z.string().trim().min(2)),
  phone: phoneSchema,
  email: z.union([z.literal(''), z.string().trim().email().max(120)]).optional(),
  city: short(80).optional(),
  address: short(400).optional(),
  pincode: short(10).optional(),
  contactTime: short(120).optional(),
  product: short(300).optional(),
  size: short(120).optional(),
  price: short(40).optional(),
  notes: short(1500).optional(),
  source: short(80).optional(),
  orderId: short(40).optional(),
  // Anti-spam fields (never written to the Sheet):
  honeypot: z.string().optional(),
  elapsedMs: z.number().optional(),
});

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  if (!SCRIPT_URL) return { ok: false, error: 'Lead endpoint is not configured' };

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    params.append(key, value == null ? '' : String(value));
  }
  // The Apps Script doPost parses several shapes defensively; mirror the
  // existing client contract so no script change is needed beyond the column.
  params.append('payload', JSON.stringify(payload));

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      redirect: 'follow',
    });
    if (!response.ok) return { ok: false, error: `Apps Script returned ${response.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(',')[0]?.trim() || 'unknown';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Shares the per-IP/daily budget with /api/chat — one abusive client can't
  // split attention between endpoints. Raise AI_DAILY_REQUEST_CAP if needed.
  const limit = checkRateLimit(clientIp(req));
  if (!limit.allowed) {
    return res.status(429).json({ ok: false, error: 'Too many requests. Please try again shortly.' });
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => i.path.join('.') || 'body').join(', ');
    return res.status(400).json({ ok: false, error: `Invalid submission: ${detail}` });
  }

  const body = parsed.data;

  // Honeypot + timing check. Bots get a fake success so they don't adapt;
  // nothing is written to the Sheet.
  const tooFast = typeof body.elapsedMs === 'number' && body.elapsedMs < 2000;
  if ((body.honeypot && body.honeypot.trim() !== '') || tooFast) {
    return res.status(200).json({ ok: true });
  }

  // Explicit whitelist — unknown client fields never reach the Sheet.
  const result = await submitLead({
    name: body.name,
    phone: body.phone,
    email: body.email || '',
    city: body.city || '',
    address: body.address || '',
    pincode: body.pincode || '',
    contactTime: body.contactTime || '',
    product: body.product || '',
    size: body.size || '',
    price: body.price || '',
    notes: body.notes || '',
    orderId: body.orderId || '',
    source: body.source || 'Website',
  });

  if (!result.ok) {
    console.error('[api/lead] Apps Script failure:', result.error);
    return res.status(502).json({ ok: false, error: 'Could not save your details. Please try again or reach us on WhatsApp.' });
  }

  return res.status(200).json({ ok: true });
}
