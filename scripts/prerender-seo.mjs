/**
 * Post-build SEO shell generator (no SSR, no hydration).
 *
 * For every URL in dist/sitemap.xml it writes dist/<route>/index.html: a copy of
 * dist/index.html with route-specific <title>, description, canonical, OG/Twitter
 * tags, JSON-LD and a small static summary inside #root. React's createRoot
 * replaces that summary on load, so the client app is untouched.
 *
 * Run with tsx (imports the app's .ts data files). Sitemap is the single route list.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';
import { PRODUCTS } from '../src/data/products.ts';
import { MATTRESS_CATEGORIES } from '../src/data/mattressCategories.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const SITE = 'https://www.relaxpromattress.com';
const DEFAULT_OG = `${SITE}/og-image.jpg`;

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s, n) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
};
const abs = (u) => (!u ? '' : /^https?:/i.test(u) ? u : `${SITE}${u.startsWith('/') ? '' : '/'}${u}`);
// JSON inside <script>: neutralise "<" so "</script>" can never terminate the tag.
const ld = (obj) =>
  `<script type="application/ld+json" data-rh="true">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

// Static pages: mirrors the titles/descriptions the React pages already set.
const PAGES = {
  '/': {
    title: 'RelaxPro Mattress | Premium Latex Mattresses in Hyderabad',
    description:
      'RelaxPro Mattress is a Hyderabad-based mattress manufacturer producing premium natural latex, HR foam, rebonded and custom-size mattresses. GOLS-certified, factory-direct.',
    h1: 'Premium Latex Mattresses in Hyderabad',
    links: [['/catalog', 'View all mattresses'], ['/builder', 'Build your mattress'], ['/locations', 'Showrooms'], ['/contact', 'Contact RelaxPro']],
  },
  '/catalog': {
    title: 'Natural Latex Mattresses | RelaxPro Premium Mattresses',
    description: "Browse India's finest chemical-free mattresses. Premium 7-zone latex, heavy rebonded ortho systems, and ventilated sleep tech.",
    h1: 'Natural Latex Mattresses',
  },
  '/builder': {
    title: 'Build Your Mattress | RelaxPro',
    description: 'Personalize your GOLS natural latex mattress layer-by-layer. Choose GOTS bamboo cover, composite layers, custom size.',
    h1: 'Build Your Mattress',
  },
  '/compare': {
    title: 'Compare Natural Latex Mattresses | RelaxPro',
    description: 'Compare dimensions, layers, comfort levels, and prices of RelaxPro natural latex mattresses.',
    h1: 'Compare Natural Latex Mattresses',
  },
  '/science': {
    title: 'Sleep Science & Orthopedic Spine Support | RelaxPro Education',
    description: 'Understand standard back alignment, the benefits of pincore ventilated natural latex, and how sleep ergonomics can cure chronic spine pain.',
    h1: 'Sleep Science & Orthopedic Spine Support',
  },
  '/about': {
    title: 'About RelaxPro | Pure Natural Latex Mattress Manufacturer',
    description: "Telangana and AP's leading manufacturer of pure natural latex mattresses. Handcrafted, GOLS certified Dunlop rubber latex direct from Kerala unit to your bedroom.",
    h1: 'About RelaxPro',
  },
  '/about-relaxpro-mattress': {
    title: 'About RelaxPro Mattress | Premium Latex Mattress Manufacturer in Hyderabad',
    description: 'RelaxPro Mattress is a Hyderabad-based mattress manufacturer founded in 2015. We make premium natural latex, HR foam, rebonded and custom-size mattresses — GOLS certified and factory-direct.',
    h1: 'About RelaxPro Mattress',
  },
  '/contact': {
    title: 'Contact Suresh & Get Orthopedic Sleep Advice | RelaxPro',
    description: 'Talk to RelaxPro for orthopedic sleep advice, pricing and showroom visits in Hyderabad.',
    h1: 'Contact RelaxPro',
  },
  '/locations': {
    title: 'RelaxPro Factory Showrooms - Hyderabad, Rajahmundry, Bangalore',
    description: 'Visit our experience showrooms to test 7-zone organic latex & firm ortho mattresses. Get direct factory pricing, maps & directions.',
    h1: 'RelaxPro Factory Showrooms',
  },
  '/accessories': {
    title: 'Mattress Accessories — Pillows & Protectors | RelaxPro',
    description: 'Complete your sleep setup with GOLS-certified latex pillows, shredded latex pillows, fiber pillows, and elasticated mattress protectors. Direct factory pricing.',
    h1: 'Mattress Accessories',
  },
  '/certificates': {
    title: 'Our Certifications | RelaxPro Premium Mattresses',
    description: 'Explore the GOLS, OEKO-TEX and ISO certifications that validate the quality, safety and sustainability of every RelaxPro natural latex mattress.',
    h1: 'Our Certifications',
  },
};
const COMMON_LINKS = [['/', 'RelaxPro Home'], ['/catalog', 'View Mattresses'], ['/contact', 'Contact RelaxPro']];

// ── Product data: Sanity (best effort) merged over the local fallback, like the client does ──
async function loadSanityProducts() {
  try {
    const client = createClient({ projectId: 'de6mndac', dataset: 'production', apiVersion: '2024-01-01', useCdn: true });
    const rows = await Promise.race([
      client.fetch(`*[_type == "product"]{
        "slug": slug.current, name, tagline, keyBenefit, description, longDescription, pricingModel, pricing,
        "image": image.asset->url, "metaTitle": seo.metaTitle, "metaDescription": seo.metaDescription, layers, certifications, features
      }`),
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 15000)),
    ]);
    console.log(`[prerender-seo] Sanity: ${rows.length} products`);
    return Object.fromEntries(rows.filter((r) => r.slug).map((r) => [r.slug, r]));
  } catch (e) {
    console.warn(`[prerender-seo] Sanity unavailable (${e.message}); using src/data/products.ts`);
    return {};
  }
}

const SIZE_LABEL = { king: 'King', queen: 'Queen', double: 'Double', single: 'Single', diwan: 'Diwan' };
function sizes(p) {
  const table = p.pricingModel === 'with_without_accessories' ? p.pricing?.withAccessories : p.pricing?.fabric300Gsm;
  return Object.entries(table || {}).filter(([k, v]) => SIZE_LABEL[k] && v > 0);
}

function productSeo(slug, sanity) {
  const hc = PRODUCTS.find((p) => p.slug === slug);
  if (!hc && !sanity) return null;
  const s = sanity || {};
  const p = { ...(hc || {}), ...Object.fromEntries(Object.entries(s).filter(([, v]) => v != null && v !== '')) };
  const url = `${SITE}/mattresses/${slug}`;
  const desc = p.metaDescription || clip(p.longDescription || p.description || p.keyBenefit, 155);
  const image = abs(p.image);
  const king = sizes(p).find(([k]) => k === 'king')?.[1];
  const price = king || sizes(p)[0]?.[1];
  const product = {
    '@type': 'Product', '@id': `${url}#product`, name: p.name, url,
    ...(image ? { image } : {}),
    description: clip(p.longDescription || p.description || p.keyBenefit, 500),
    brand: { '@type': 'Brand', name: 'RelaxPro' },
    ...(price ? { offers: { '@type': 'Offer', url, priceCurrency: 'INR', price: String(price), itemCondition: 'https://schema.org/NewCondition', availability: 'https://schema.org/InStock' } } : {}),
  };
  const crumbs = { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
    { '@type': 'ListItem', position: 2, name: 'Catalog', item: `${SITE}/catalog` },
    { '@type': 'ListItem', position: 3, name: p.name, item: url },
  ] };
  const specs = [
    ...(p.layers || []).map((l) => `${l.thickness}" ${String(l.material || '').replace(/_/g, ' ')}${l.brand ? ` (${l.brand})` : ''}`),
    ...(p.certifications?.length ? [`Certifications: ${p.certifications.join(', ')}`] : []),
    ...sizes(p).map(([k, v]) => `${SIZE_LABEL[k]} size from ₹${Number(v).toLocaleString('en-IN')}`),
  ];
  return {
    title: p.metaTitle || `${p.name} Natural Latex Mattress | RelaxPro`,
    description: desc, image, ogType: 'product',
    h1: p.name, summary: clip(p.longDescription || p.description || p.keyBenefit, 600), list: specs,
    links: [...COMMON_LINKS, ['/compare', 'Compare mattresses']],
    jsonLd: [{ '@context': 'https://schema.org', '@graph': [product, crumbs] }],
  };
}

function categorySeo(slug) {
  const c = MATTRESS_CATEGORIES.find((x) => x.slug === slug);
  if (!c) return null;
  return {
    title: c.title, description: c.metaDescription, h1: c.h1, summary: clip(c.intro, 600),
    list: c.products.map((p) => `${p.name} — ${p.note}`),
    links: [...c.products.map((p) => [`/mattresses/${p.slug}`, p.name]), ...c.related.map((r) => [r.path, r.label]), ...COMMON_LINKS],
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: c.h1, item: `${SITE}/${slug}` },
    ] }],
  };
}

function seoFor(path, sanity) {
  let m = path.match(/^\/mattresses\/([^/]+)$/);
  const seo = m ? productSeo(m[1], sanity[m[1]]) : categorySeo(path.slice(1)) || (PAGES[path] && { ...PAGES[path] });
  if (!seo) return null;
  if (path === '/') seo.jsonLd = [{ '@context': 'https://schema.org', '@type': 'Organization', name: 'RelaxPro Mattress', url: `${SITE}/`, logo: `${SITE}/favicon.png` }];
  return { image: DEFAULT_OG, ogType: 'website', summary: seo.description, links: COMMON_LINKS, ...seo, image: seo.image || DEFAULT_OG, canonical: path === '/' ? `${SITE}/` : `${SITE}${path}` };
}

function render(template, s) {
  const head = [
    `<meta name="description" content="${esc(s.description)}" data-rh="true" />`,
    `<link rel="canonical" href="${s.canonical}" data-rh="true" />`,
    `<meta property="og:title" content="${esc(s.title)}" data-rh="true" />`,
    `<meta property="og:description" content="${esc(s.description)}" data-rh="true" />`,
    `<meta property="og:type" content="${s.ogType}" data-rh="true" />`,
    `<meta property="og:url" content="${s.canonical}" data-rh="true" />`,
    `<meta property="og:image" content="${esc(s.image)}" data-rh="true" />`,
    `<meta property="og:site_name" content="RelaxPro Mattress" data-rh="true" />`,
    `<meta name="twitter:card" content="summary_large_image" data-rh="true" />`,
    `<meta name="twitter:title" content="${esc(s.title)}" data-rh="true" />`,
    `<meta name="twitter:description" content="${esc(s.description)}" data-rh="true" />`,
    `<meta name="twitter:image" content="${esc(s.image)}" data-rh="true" />`,
    ...(s.jsonLd || []).map(ld),
  ].join('\n    ');
  const body = `<div id="seo-prerender" style="max-width:48rem;margin:0 auto;padding:6rem 1rem;font-family:sans-serif">
      <h1>${esc(s.h1)}</h1>
      <p>${esc(s.summary)}</p>
      ${s.list?.length ? `<ul>${s.list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : ''}
      <nav>${s.links.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join(' · ')}</nav>
    </div>`;
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title data-rh="true">${esc(s.title)}</title>`)
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/i, '')
    .replace('</head>', `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

const template = readFileSync(resolve(dist, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('dist/index.html has no empty #root; refusing to guess');
const paths = [...readFileSync(resolve(dist, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/');
const sanity = await loadSanityProducts();

let n = 0;
for (const path of paths) {
  const s = seoFor(path, sanity);
  if (!s) { console.warn(`[prerender-seo] no SEO data for ${path}; skipped`); continue; }
  const out = path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${path}`, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(template, s), 'utf8');
  n++;
}
console.log(`[prerender-seo] wrote ${n}/${paths.length} route files`);
