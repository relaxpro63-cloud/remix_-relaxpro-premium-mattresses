/**
 * Convert large PNG assets to lossy WebP (quality ~82) for faster page loads.
 *
 * WebP variants are written next to the originals; the originals are kept for
 * safety (e.g. the Sanity seed pipeline). The app code references the .webp
 * variants. Re-run any time a PNG above the size threshold is added.
 *
 * Usage: node scripts/optimize-images.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGES = path.resolve(__dirname, '../public/images');

const THRESHOLD_BYTES = 300 * 1024;

const ALWAYS = [
  'hero-banner.png',
  'box-customize.png',
  'box-models.png',
  'section-bg.png',
  'shuddha-banner.png',
  'hero-section.png',
  'technical-specifications.png',
  'natural-latex.png',
  'about-process.png',
  'mattress-hand.png',
  'hero-bedroom.png',
  'foam-compare.png',
  'about-story.png',
  'latex-compare.png',
  'gots-cotton.png',
];

async function main() {
  let done = 0;
  let skipped = 0;
  const entries = fs.readdirSync(IMAGES).filter((f) => f.endsWith('.png'));
  for (const file of entries) {
    const src = path.join(IMAGES, file);
    const stat = fs.statSync(src);
    const target = path.join(IMAGES, file.replace(/\.png$/, '.webp'));
    if (fs.existsSync(target)) {
      const current = fs.statSync(target);
      if (current.mtimeMs >= stat.mtimeMs) {
        skipped++;
        continue;
      }
    }
    if (stat.size < THRESHOLD_BYTES && !ALWAYS.includes(file)) {
      skipped++;
      continue;
    }
    const webp = await sharp(src).webp({ quality: 82 }).toBuffer();
    fs.writeFileSync(target, webp);
    const saved = Math.round((1 - webp.length / stat.size) * 100);
    console.log(
      `  ✓ ${file} -> ${path.basename(target)}  ${(stat.size / 1024).toFixed(0)}KB -> ${(webp.length / 1024).toFixed(0)}KB (-${saved}%)`,
    );
    done++;
  }
  console.log(`Done. ${done} converted, ${skipped} skipped.`);
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
