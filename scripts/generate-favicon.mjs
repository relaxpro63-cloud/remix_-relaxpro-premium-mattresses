/**
 * Generate all favicon assets (PNG, ICO, apple-touch-icon) from the current
 * favicon-128x128.png. This runs on every `npm run build` (Vercel included),
 * so it MUST source from the actual favicon artwork.
 *
 * IMPORTANT: do NOT fall back to images/relaxpro-logo.png. That file is the
 * wide horizontal brand lockup used for the header/popup/SEO logo, not
 * square — a previous version of this script fell back to it, which meant
 * every deploy silently regenerated the favicon from the wrong, letterboxed
 * logo, overwriting whatever favicon-128x128.png actually had. To change
 * the favicon going forward, replace favicon-128x128.png itself, then run
 * this script.
 *
 * Usage: node scripts/generate-favicon.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');

const SOURCE = path.join(PUBLIC, 'favicon-128x128.png');

const SIZES = [16, 32, 48, 64, 128];

/**
 * Create a valid ICO file from an array of { size, buffer } PNG entries.
 * Modern ICO embeds PNG data directly.
 */
function createIco(entries) {
  const count = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(count, 4); // number of images

  let offset = 6 + count * 16; // header + directory entries
  const dirEntries = [];
  const imageData = [];

  for (const { size, buffer } of entries) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset in file
    dirEntries.push(entry);
    imageData.push(buffer);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...imageData]);
}

async function main() {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Source favicon not found: ${SOURCE}`);
    process.exit(1);
  }
  console.log(`Source: ${SOURCE}\nGenerating favicon files...\n`);

  const pngBuffers = [];
  for (const size of SIZES) {
    const buf = await sharp(SOURCE)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    pngBuffers.push({ size, buffer: buf });
    fs.writeFileSync(path.join(PUBLIC, `favicon-${size}x${size}.png`), buf);
    console.log(`  ✓ favicon-${size}x${size}.png  (${buf.length} bytes)`);
  }

  // Multi-size ICO (16/32/48) — covers the default /favicon.ico request
  const ico = createIco(pngBuffers.filter((e) => e.size <= 48));
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), ico);
  console.log(`  ✓ favicon.ico  (${ico.length} bytes)`);

  // Google-documented default /favicon.png (48px)
  const faviconPng = pngBuffers.find((e) => e.size === 48);
  if (faviconPng) {
    fs.writeFileSync(path.join(PUBLIC, 'favicon.png'), faviconPng.buffer);
    console.log(`  ✓ favicon.png  (${faviconPng.buffer.length} bytes)`);
  }

  // apple-touch-icon (180×180) for iOS home-screen shortcuts
  const apple = await sharp(SOURCE)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), apple);
  console.log(`  ✓ apple-touch-icon.png  (${apple.length} bytes)`);

  console.log('\nDone! All favicon assets rebuilt from the new logo.');
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
