const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

export const SITE_URL =
  env.VITE_SITE_URL?.replace(/\/+$/, '') ??
  'https://remix-relaxpro-matress.vercel.app';

export const WHATSAPP_NUMBER =
  env.VITE_WHATSAPP_NUMBER ?? '918686624494';

export const CONTACT_PHONE = '8686624494';
export const CONTACT_PHONE_SECONDARY = '9642024494';

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
