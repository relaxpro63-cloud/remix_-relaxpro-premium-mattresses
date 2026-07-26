/**
 * Generate proper favicon.ico + PNG fallbacks from favicon.svg
 *
 * Usage: node scripts/generate-favicon.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.resolve(__dirname, '..', 'public');

// The SVG content — must be self-contained (no external refs)
const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1220"/>
      <stop offset="100%" stop-color="#1A2740"/>
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="6" fill="url(#bg)"/>
  <text x="16" y="23" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-weight="900" font-size="20" fill="#FFFFFF">R</text>
  <rect x="9" y="24.5" width="14" height="2" rx="1" fill="#3A8FD2" opacity="0.7"/>
</svg>`;

const SIZES = [16, 32, 48, 64];

/**
 * Create a valid ICO file from an array of PNG buffers (each at a different size).
 * ICO format with embedded PNGs (modern ICO).
 */
function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);      // reserved
  header.writeUInt16LE(1, 2);      // type: 1 = ICO
  header.writeUInt16LE(count, 4);  // number of images

  let offset = 6 + count * 16; // header + directory entries
  const dirEntries = [];
  const imageData = [];

  pngBuffers.forEach((png, i) => {
    const size = SIZES[i] || 32;
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);   // width
    entry.writeUInt8(size >= 256 ? 0 : size, 1);   // height
    entry.writeUInt8(0, 2);                         // color palette
    entry.writeUInt8(0, 3);                         // reserved
    entry.writeUInt16LE(1, 4);                      // color planes
    entry.writeUInt16LE(32, 6);                     // bits per pixel
    entry.writeUInt32LE(png.length, 8);             // size of image data
    entry.writeUInt32LE(offset, 12);                // offset in file
    dirEntries.push(entry);
    imageData.push(png);
    offset += png.length;
  });

  return Buffer.concat([header, ...dirEntries, ...imageData]);
}

async function main() {
  console.log('Generating favicon files...\n');

  // Render PNG at each size
  const pngs = [];
  for (const size of SIZES) {
    const buf = await sharp(Buffer.from(SVG_CONTENT))
      .resize(size, size)
      .png()
      .toBuffer();
    pngs.push(buf);
    const pngPath = path.join(PUBLIC, `favicon-${size}x${size}.png`);
    fs.writeFileSync(pngPath, buf);
    console.log(`  ✓ favicon-${size}x${size}.png  (${buf.length} bytes)`);
  }

  // Create multi-size ICO
  const ico = createIco(pngs);
  const icoPath = path.join(PUBLIC, 'favicon.ico');
  fs.writeFileSync(icoPath, ico);
  console.log(`\n  ✓ favicon.ico  (${ico.length} bytes, ${SIZES.length} sizes embedded)`);

  // Also generate apple-touch-icon (180×180)
  const appleBuf = await sharp(Buffer.from(SVG_CONTENT))
    .resize(180, 180)
    .png()
    .toBuffer();
  const applePath = path.join(PUBLIC, 'apple-touch-icon.png');
  fs.writeFileSync(applePath, appleBuf);
  console.log(`  ✓ apple-touch-icon.png  (${appleBuf.length} bytes)`);

  console.log('\nDone! Favicon files written to public/.');
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
