export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateName(name: string): string | null {
  if (!name.trim()) return 'Full name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'Phone number is required.';
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10) return 'Please enter a valid 10-digit Indian mobile number.';
  if (!/^[6-9]\d{9}$/.test(digits)) return 'Please enter a valid Indian mobile number starting with 6-9.';
  return null;
}

export function validateCity(city: string): string | null {
  if (city.trim().length > 0 && city.trim().length < 2) return 'City name must be at least 2 characters.';
  return null;
}

export function validateLeadForm(data: {
  name: string;
  phone: string;
  city?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};
  
  const nameError = validateName(data.name);
  if (nameError) errors.name = nameError;
  
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  
  if (data.city) {
    const cityError = validateCity(data.city);
    if (cityError) errors.city = cityError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  if (digits.length === 12 && digits.startsWith('91')) return digits;
  return digits;
}

export function buildWhatsAppMessage(data: {
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