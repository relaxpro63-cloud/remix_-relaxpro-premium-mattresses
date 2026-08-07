/**
 * Build-time sitemap generator.
 *
 * Product URLs are sourced from Sanity (`_type == "product" && inStock == true`)
 * so the sitemap stays in sync with the CMS. If the Sanity API is unreachable
 * (e.g. offline local build), it falls back to slugs parsed from src/data/products.ts.
 *
 * The base URL is enforced to be the production domain — vercel.app / localhost
 * values are rejected.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const root = resolve(fileURLToPath(import.meta.url), '../../');

function readEnv(key) {
  try {
    const env = readFileSync(resolve(root, '.env.local'), 'utf8');
    const match = env.match(new RegExp(`^${key}\\s*=\\s*(.+)$`, 'm'));
    if (match) return match[1].trim();
  } catch {
    /* .env.local may be absent in CI */
  }
  return process.env[key]?.trim();
}

const PRODUCTION_SITE_URL = 'https://www.relaxpromattress.com';

function resolveBaseUrl() {
  const fromEnv = readEnv('VITE_SITE_URL');
  if (fromEnv) {
    try {
      const host = new URL(fromEnv).hostname;
      const isInvalid =
        host.endsWith('vercel.app') ||
        host === 'localhost' ||
        host.startsWith('127.') ||
        host.endsWith('.local');
      if (isInvalid) {
        console.warn(`[generate-sitemap] Ignoring invalid VITE_SITE_URL "${fromEnv}" (not a production domain).`);
      } else {
        return fromEnv.replace(/\/+$/, '');
      }
    } catch {
      console.warn(`[generate-sitemap] Ignoring malformed VITE_SITE_URL "${fromEnv}".`);
    }
  }
  return PRODUCTION_SITE_URL;
}

const baseUrl = resolveBaseUrl();
const today = new Date().toISOString().slice(0, 10);

const pages = [
  { path: '/', priority: 1.0, changefreq: 'weekly', lastmod: today },
  { path: '/catalog', priority: 0.8, changefreq: 'weekly', lastmod: today },
  { path: '/builder', priority: 0.7, changefreq: 'monthly', lastmod: today },
  { path: '/science', priority: 0.6, changefreq: 'monthly', lastmod: today },
  { path: '/locations', priority: 0.6, changefreq: 'monthly', lastmod: today },
  { path: '/contact', priority: 0.6, changefreq: 'monthly', lastmod: today },
  { path: '/about', priority: 0.5, changefreq: 'monthly', lastmod: today },
  { path: '/accessories', priority: 0.5, changefreq: 'monthly', lastmod: today },
  { path: '/certificates', priority: 0.5, changefreq: 'monthly', lastmod: today },
  { path: '/compare', priority: 0.5, changefreq: 'monthly', lastmod: today },
  { path: '/about-relaxpro-mattress', priority: 0.6, changefreq: 'monthly', lastmod: today },
  { path: '/latex-mattress', priority: 0.7, changefreq: 'weekly', lastmod: today },
  { path: '/natural-latex-mattress', priority: 0.7, changefreq: 'weekly', lastmod: today },
  { path: '/hr-foam-mattress', priority: 0.6, changefreq: 'weekly', lastmod: today },
  { path: '/rebonded-mattress', priority: 0.6, changefreq: 'weekly', lastmod: today },
  { path: '/orthopedic-mattress', priority: 0.6, changefreq: 'weekly', lastmod: today },
  { path: '/custom-size-mattress', priority: 0.6, changefreq: 'weekly', lastmod: today },
];

async function getProductSlugsFromSanity() {
  const client = createClient({
    projectId: 'de6mndac',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  });
  const products = await client.fetch(
    `*[_type == "product" && inStock == true] | order(sortOrder asc){ "slug": slug.current, "updatedAt": _updatedAt }`,
  );
  if (!Array.isArray(products)) throw new Error('Unexpected Sanity response');
  return products;
}

async function getProductSlugs() {
  try {
    const products = await getProductSlugsFromSanity();
    const slugs = products
      .filter((p) => typeof p.slug === 'string' && p.slug.length > 0)
      .map((p) => ({ slug: p.slug, lastmod: p.updatedAt?.slice(0, 10) || today }));
    console.log(`[generate-sitemap] Fetched ${slugs.length} product slugs from Sanity.`);
    return slugs;
  } catch (err) {
    console.warn(
      `[generate-sitemap] Sanity fetch failed (${err?.message || err}); falling back to src/data/products.ts slugs.`,
    );
    const productsSrc = readFileSync(resolve(root, 'src/data/products.ts'), 'utf8');
    const slugs = [...productsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => ({ slug: m[1], lastmod: today }));
    console.log(`[generate-sitemap] Fallback: parsed ${slugs.length} product slugs from src/data/products.ts.`);
    return slugs;
  }
}

const productSlugs = await getProductSlugs();
for (const { slug, lastmod } of productSlugs) {
  pages.push({ path: `/mattresses/${slug}`, priority: 0.9, changefreq: 'weekly', lastmod });
}

const urls = pages
  .map(
    ({ path, priority, changefreq, lastmod }) => `  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`Sitemap written: ${baseUrl} (${pages.length} URLs, lastmod ${today})`);
