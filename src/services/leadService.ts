import { LeadFormData } from '../types';
import { buildWhatsAppUrl } from '../lib/site';

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_PUBLIC_GOOGLE_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbyXT4mWL-fsD2LWxEwTcT7_v9mDprfZYrloDW3bn9jWPd_L1nPj4hZ20RuZdbsd1DcV/exec';

interface LeadSubmissionData {
  name: string;
  phone: string;
  city?: string;
  source: string;
  product?: string;
  size?: string;
  price?: string;
  notes?: string;
  email?: string;
  address?: string;
  orderId?: string;
  contactTime?: string;
  pincode?: string;
}

export async function submitLead(data: LeadSubmissionData): Promise<{ success: boolean; error?: string }> {
  try {
    const formParams = new URLSearchParams();
    
    const submissionData: Record<string, string> = {
      orderId: data.orderId || '',
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      city: data.city || '',
      address: data.address || '',
      pincode: data.pincode || '',
      contactTime: data.contactTime || '',
      product: data.product || '',
      size: data.size || '',
      price: data.price || '',
      notes: data.notes || '',
      source: data.source,
    };

    for (const key in submissionData) {
      if (Object.prototype.hasOwnProperty.call(submissionData, key)) {
        const val = submissionData[key];
        formParams.append(key, val !== undefined && val !== null ? String(val) : '');
      }
    }

    formParams.append('payload', JSON.stringify(submissionData));
    formParams.append('json', JSON.stringify(submissionData));

    const urlWithParams = new URL(GOOGLE_SCRIPT_URL);
    if (data.name) urlWithParams.searchParams.append('name', String(data.name));
    if (data.phone) urlWithParams.searchParams.append('phone', String(data.phone));
    if (data.orderId) urlWithParams.searchParams.append('orderId', String(data.orderId));
    if (data.product) urlWithParams.searchParams.append('product', String(data.product));

    const response = await fetch(urlWithParams.toString(), {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formParams.toString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting lead to Google Sheets:', error);
    return { success: false, error: 'Failed to submit lead. Please try again.' };
  }
}

export async function submitLeadAndRedirect(data: LeadSubmissionData): Promise<{ success: boolean; error?: string }> {
  const result = await submitLead(data);
  
  if (result.success) {
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '918686624494';
    const message = buildWhatsAppMessage({
      name: data.name,
      phone: data.phone,
      city: data.city,
      source: data.source,
      product: data.product,
      customMessage: data.notes,
    });
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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