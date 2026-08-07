import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const baseUrl = (readEnv('VITE_SITE_URL') || 'https://www.relaxpromattress.com').replace(/\/+$/, '');
const lastmod = new Date().toISOString().slice(0, 10);

const pages = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/catalog', priority: 0.8, changefreq: 'weekly' },
  { path: '/builder', priority: 0.7, changefreq: 'monthly' },
  { path: '/science', priority: 0.6, changefreq: 'monthly' },
  { path: '/locations', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.6, changefreq: 'monthly' },
  { path: '/about', priority: 0.5, changefreq: 'monthly' },
];

const productsSrc = readFileSync(resolve(root, 'src/data/products.ts'), 'utf8');
const slugs = [...productsSrc.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
for (const slug of slugs) {
  pages.push({ path: `/mattresses/${slug}`, priority: 0.9, changefreq: 'weekly' });
}

const urls = pages
  .map(
    ({ path, priority, changefreq }) => `  <url>
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
console.log(`Sitemap written: ${baseUrl} (${pages.length} URLs, lastmod ${lastmod})`);
