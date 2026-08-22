import { readFileSync, writeFileSync } from 'fs';

const file = 'src/data/products.ts';
const content = readFileSync(file, 'utf8');

// Desired order
const order = ['sthira','sunidra','arogya','amrita','somya','prakriti','shuddha','nirvana','bhumi','ananda','ojas','ayushrest','vishram'];

// Find all product blocks by matching from slug to the next slug (or end)
const slugPattern = /slug:\s*'(\w+)'/g;
const slugPositions = [];
let m;
while ((m = slugPattern.exec(content)) !== null) {
  slugPositions.push({ slug: m[1], pos: m.index });
}

// Extract blocks: from the { before each slug to the { before the next slug (or end of array)
const blocks = {};
for (let i = 0; i < slugPositions.length; i++) {
  const start = content.lastIndexOf('{', slugPositions[i].pos);
  let end;
  if (i + 1 < slugPositions.length) {
    end = content.lastIndexOf('{', slugPositions[i + 1].pos);
  } else {
    // Last product: find closing of PRODUCTS array
    end = content.indexOf('\n];', slugPositions[i].pos);
  }
  blocks[slugPositions[i].slug] = content.substring(start, end).trim();
}

// Verify
const missing = order.filter(s => !blocks[s]);
if (missing.length) {
  console.error('Missing:', missing);
  console.error('Found:', Object.keys(blocks));
  process.exit(1);
}

// Get header and footer
const firstProductStart = content.lastIndexOf('{', slugPositions[0].pos);
const header = content.substring(0, firstProductStart);
const lastSlug = slugPositions[slugPositions.length - 1];
const lastProductEnd = content.indexOf('\n];', lastSlug.pos) + 3;
const footer = content.substring(lastProductEnd);

// Reassemble
const reordered = order.map(slug => blocks[slug]).join(',\n\n');
const newContent = header + reordered + '\n' + footer;

writeFileSync(file, newContent, 'utf8');
console.log('Done! Order:', order.join(' → '));
