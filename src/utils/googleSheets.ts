import { LeadFormData } from '../types';

/**
 * Best-effort lead dispatch to Google Apps Script.
 *
 * Under `mode: "no-cors"` the response is opaque: a successful resolve only means
 * the request left the browser network stack — not that Apps Script wrote a row.
 * Callers should treat this as fire-and-forget and offer WhatsApp as recovery.
 */
export async function submitLead(data: LeadFormData): Promise<void> {
  const SCRIPT_URL = import.meta.env.VITE_PUBLIC_GOOGLE_SCRIPT_URL as string | undefined;

  if (!SCRIPT_URL || !SCRIPT_URL.trim()) {
    throw new Error('VITE_PUBLIC_GOOGLE_SCRIPT_URL is not configured');
  }

  const formParams = new URLSearchParams();

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const val = data[key as keyof LeadFormData];
      formParams.append(key, val !== undefined && val !== null ? String(val) : '');
    }
  }

  // Dual payload shape for parameter-based and JSON-body-based Apps Scripts
  formParams.append('payload', JSON.stringify(data));
  formParams.append('json', JSON.stringify(data));

  // Query string: non-PII debug fields only (no name/phone)
  const urlWithParams = new URL(SCRIPT_URL);
  if (data.orderId) urlWithParams.searchParams.append('orderId', String(data.orderId));
  if (data.product) urlWithParams.searchParams.append('product', String(data.product));
  if (data.source) urlWithParams.searchParams.append('source', String(data.source));

  await fetch(urlWithParams.toString(), {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formParams.toString(),
  });
}
