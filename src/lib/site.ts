import { getSiteSettings } from './queries';

const env = (import.meta as { env?: Record<string, string | undefined> }).env ?? {};

const PRODUCTION_SITE_URL = 'https://www.relaxpromattress.com';

function cleanSiteUrl(url?: string): string {
  if (!url) return '';
  const cleaned = url.trim().replace(/\/+$/, '');
  try {
    const host = new URL(cleaned).hostname;
    if (
      host.endsWith('vercel.app') ||
      host === 'localhost' ||
      host.startsWith('127.') ||
      host.endsWith('.local')
    ) {
      return '';
    }
    return cleaned;
  } catch {
    return '';
  }
}

export async function getSiteUrl() {
  const settings = await getSiteSettings().catch(() => null);
  return cleanSiteUrl(settings?.siteUrl) || cleanSiteUrl(env.VITE_SITE_URL) || PRODUCTION_SITE_URL;
}

export async function getWhatsAppNumber() {
  const settings = await getSiteSettings().catch(() => null);
  return settings?.contactInfo?.whatsappNumber || env.VITE_WHATSAPP_NUMBER || '918686624494';
}

export async function getContactPhone() {
  const settings = await getSiteSettings().catch(() => null);
  return settings?.contactInfo?.mainPhone || '8686624494';
}

export const SITE_URL = cleanSiteUrl(env.VITE_SITE_URL) || PRODUCTION_SITE_URL;
export const WHATSAPP_NUMBER = env.VITE_WHATSAPP_NUMBER || '918686624494';
export const CONTACT_PHONE = '8686624494';
export const CONTACT_PHONE_SECONDARY = '9642024494';

/** Canonical brand name for structured data and entity consistency. */
export const BUSINESS_NAME = 'RelaxPro Mattress';

/** Official social profiles (also used for Organization/LocalBusiness sameAs). */
export const SOCIAL_LINKS = {
  facebook: 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/',
  instagram: 'https://www.instagram.com/relaxpro__mattresses/?hl=en',
  youtube: 'https://www.youtube.com/@sureshmattressmanufacturer3784',
};
export const SAME_AS = Object.values(SOCIAL_LINKS);

/**
 * Ensure a URL is absolute for SEO metadata (JSON-LD, og:image, twitter:image).
 * - Already-absolute http(s) URLs are preserved.
 * - Relative paths are resolved against SITE_URL.
 * - Missing/empty values return ''.
 * - No double slashes.
 */
export function toAbsoluteUrl(value: string | undefined | null): string {
  if (!value) return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return trimmed.startsWith('/') ? `${SITE_URL}${trimmed}` : `${SITE_URL}/${trimmed}`;
}

/**
 * Build a WhatsApp deep-link URL.
 * Synchronous — uses the compile-time constant WHATSAPP_NUMBER directly.
 * The async version getWhatsAppNumber() is only for cases where the
 * number needs to be fetched from Sanity at runtime (e.g. SSR).
 */
export const buildWhatsAppUrl = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
