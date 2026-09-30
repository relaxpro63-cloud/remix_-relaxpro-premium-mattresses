/** Fails the build if any prerendered route is missing critical SEO output. */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const SITE = 'https://www.relaxpromattress.com';
const paths = [...readFileSync(resolve(dist, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => new URL(m[1]).pathname.replace(/\/$/, '') || '/');

const one = (html, re) => html.match(re)?.[1]?.trim();
const errors = [];
let homeTitle;

for (const path of paths) {
  const file = path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${path}`, 'index.html');
  const fail = (msg) => errors.push(`${path}: ${msg}`);
  if (!existsSync(file)) { fail('no prerendered file'); continue; }
  const html = readFileSync(file, 'utf8');
  const title = one(html, /<title[^>]*>([^<]+)<\/title>/);
  const canonicals = html.match(/<link\s+rel="canonical"/g) || [];
  const canonical = one(html, /<link\s+rel="canonical"\s+href="([^"]+)"/);
  const at = html.indexOf('<div id="root">');
  const root = at < 0 ? '' : html.slice(at, html.indexOf('</nav>', at) + 6);
  const want = path === '/' ? `${SITE}/` : `${SITE}${path}`;
  if (path === '/') homeTitle = title;

  if (!title) fail('missing <title>');
  if (!/<meta name="description" content="[^"]{20,}"/.test(html)) fail('missing meta description');
  if (canonicals.length !== 1) fail(`expected 1 canonical, found ${canonicals.length}`);
  else if (canonical !== want) fail(`canonical ${canonical} != ${want}`);
  if (one(html, /property="og:url" content="([^"]+)"/) !== want) fail('og:url mismatch');
  for (const k of ['og:title', 'og:description', 'og:image', 'twitter:title', 'twitter:description', 'twitter:image'])
    if (!html.includes(`"${k}"`)) fail(`missing ${k}`);
  if (!root || !/<h1>[^<]+<\/h1>/.test(root) || root.replace(/<[^>]+>/g, '').trim().length < 40) fail('empty/meaningless #root');
  if (path !== '/' && title && title === homeTitle) fail('title identical to homepage');
  if (/^\/mattresses\//.test(path)) {
    const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const graph = blocks.flatMap((b) => b['@graph'] || [b]);
    const product = graph.find((g) => g['@type'] === 'Product');
    if (!product) fail('missing Product JSON-LD');
    else {
      if (product.url !== want) fail('Product url != canonical');
      if (!root.includes(`<h1>${product.name.replace(/&/g, '&amp;')}</h1>`)) fail('H1 != Product name');
    }
    if (!graph.some((g) => g['@type'] === 'BreadcrumbList')) fail('missing BreadcrumbList');
  }
}
if (errors.length) { console.error(`[validate-seo] ${errors.length} problem(s):\n  ${errors.join('\n  ')}`); process.exit(1); }
console.log(`[validate-seo] OK — ${paths.length} routes validated`);
