import { getSiteSettings } from './queries';

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

export async function getSiteUrl() {
  const settings = await getSiteSettings().catch(() => null);
  return settings?.siteUrl || env.VITE_SITE_URL?.replace(/\/+$/, '') || 'https://remix-relaxpro-matress.vercel.app';
}

export async function getWhatsAppNumber() {
  const settings = await getSiteSettings().catch(() => null);
  return settings?.contactInfo?.whatsappNumber || env.VITE_WHATSAPP_NUMBER || '918686624494';
}

export async function getContactPhone() {
  const settings = await getSiteSettings().catch(() => null);
  return settings?.contactInfo?.mainPhone || '8686624494';
}

export const SITE_URL = env.VITE_SITE_URL?.replace(/\/+$/, '') || 'https://remix-relaxpro-matress.vercel.app';
export const WHATSAPP_NUMBER = env.VITE_WHATSAPP_NUMBER || '918686624494';
export const CONTACT_PHONE = '8686624494';
export const CONTACT_PHONE_SECONDARY = '9642024494';

export const buildWhatsAppUrl = async (message: string) => {
  const number = await getWhatsAppNumber();
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};
