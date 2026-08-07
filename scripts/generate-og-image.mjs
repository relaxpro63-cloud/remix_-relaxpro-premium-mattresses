/**
 * Generate a branded 1200x630 social (Open Graph) image for the homepage
 * default, compositing the RelaxPro logo onto the brand navy gradient.
 *
 * Usage: node scripts/generate-og-image.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const LOGO = path.join(PUBLIC, 'images', 'relaxpro-logo.png');

const W = 1200;
const H = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1220"/>
      <stop offset="100%" stop-color="#1A2740"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="40" y="40" width="${W - 80}" height="${H - 80}" fill="none" stroke="#3A8FD2" stroke-opacity="0.28" stroke-width="2" rx="24"/>
  <text x="600" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-size="50" fill="#FFFFFF">RelaxPro Premium Mattresses</text>
  <text x="600" y="528" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="4" fill="#8FB8DC">100% NATURAL LATEX &#8226; FACTORY-DIRECT &#8226; HYDERABAD</text>
</svg>`;

async function main() {
  if (!fs.existsSync(LOGO)) {
    console.error(`Logo not found: ${LOGO}`);
    process.exit(1);
  }
  const logo = await sharp(LOGO).resize({ width: 420 }).png().toBuffer();
  const base = await sharp(Buffer.from(svg)).png().toBuffer();
  const img = await sharp(base)
    .composite([{ input: logo, top: 120, left: (W - 420) / 2 }])
    .flatten({ background: '#0B1220' })
    .jpeg({ quality: 85 })
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC, 'og-image.jpg'), img);
  console.log(`  ✓ public/og-image.jpg  (${img.length} bytes)`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
