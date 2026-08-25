import { LeadFormData } from '../types';
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '../lib/site';

interface LeadSubmissionData {
  name: string;
  phone: string;
  city?: string;
  email?: string;
  source: string;
  product?: string;
  size?: string;
  price?: string;
  notes?: string;
  address?: string;
  orderId?: string;
  contactTime?: string;
  pincode?: string;
  /** Anti-spam: value of a hidden honeypot field (must stay empty). */
  honeypot?: string;
  /** Anti-spam: ms between form mount and submit. */
  elapsedMs?: number;
}

export interface LeadSubmissionResult {
  success: boolean;
  error?: string;
}

/**
 * All public forms submit through the /api/lead serverless function so that
 * rate limiting, validation, and spam checks actually apply. The function
 * returns a real ok/fail — no more fire-and-forget success.
 */
export async function submitLead(data: LeadSubmissionData): Promise<LeadSubmissionResult> {
  try {
    const response = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        phone: data.phone.replace(/\D/g, ''),
      }),
    });

    if (!response.ok) {
      let error = 'Failed to submit. Please try again.';
      try {
        const body = await response.json();
        if (body?.error) error = body.error;
      } catch {
        // non-JSON error body — keep default message
      }
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error submitting lead:', error);
    return { success: false, error: 'Network error. Please check your connection and try again.' };
  }
}

export async function submitLeadAndRedirect(data: LeadSubmissionData): Promise<LeadSubmissionResult> {
  const result = await submitLead(data);

  if (result.success) {
    const whatsappNumber = WHATSAPP_NUMBER;
    const message = buildWhatsAppMessage({
      name: data.name,
      phone: data.phone,
      city: data.city,
      source: data.source,
      product: data.product,
      customMessage: data.notes,
    });

    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  }

  return result;
}

function buildWhatsAppMessage(data: {
  name: string;
  phone: string;
  city?: string;
  source: string;
  product?: string;
  customMessage?: string;
}): string {
  const lines = [
    `🔔 New Lead: ${data.source}`,
    '',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
  ];

  if (data.city) lines.push(`City: ${data.city}`);
  if (data.product) lines.push(`Product Interest: ${data.product}`);
  if (data.customMessage) lines.push(`Message: ${data.customMessage}`);

  lines.push('', 'Please contact the customer shortly.');

  return lines.join('\n');
}
