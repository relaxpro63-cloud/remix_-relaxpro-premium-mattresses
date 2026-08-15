import type { VercelRequest, VercelResponse } from '@vercel/node';

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Partial<LeadPayload>;
  if (!body?.name || !body?.phone) {
    return res.status(400).json({ ok: false, error: 'name and phone are required' });
  }

  const result = await submitLead({
    ...body,
    name: body.name,
    phone: body.phone,
    source: body.source || 'RelaxPro AI Assistant',
  });

  return res.status(result.ok ? 200 : 502).json(result);
}