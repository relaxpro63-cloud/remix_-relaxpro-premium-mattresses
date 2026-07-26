/**
 * Seed 4 sample accessory products into Sanity CMS.
 *
 * Usage:
 *   SANITY_TOKEN=your_write_token node scripts/seed-accessories.mjs
 */
import { createClient } from '@sanity/client';

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error('[ERROR] SANITY_TOKEN environment variable is required.');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'de6mndac',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const ACCESSORIES = [
  {
    _id: 'acc-ergonomic-latex-pillow',
    _type: 'accessory',
    name: 'Ergonomic Latex Pillow',
    slug: { current: 'ergonomic-latex-pillow' },
    tagline: 'Contoured cervical support for natural spine alignment',
    description:
      'Crafted from 100% GOLS-certified natural Dunlop latex, this ergonomic pillow contours to your head and neck, providing optimal cervical spine alignment. The open-cell latex structure promotes airflow, keeping you cool throughout the night. Ideal for back and side sleepers seeking pressure relief.',
    type: 'latex_pillow',
    pricing: { price: 2499, mrp: 3999, currency: '₹' },
    sizes: ['Standard', 'King'],
    features: [
      '100% GOLS-certified natural Dunlop latex',
      'Ergonomic contour for cervical spine alignment',
      'Open-cell structure for breathability and cooling',
      'Dust mite resistant and hypoallergenic',
      'Comes with removable organic cotton cover',
    ],
    inStock: true,
    isNew: true,
    isBestseller: false,
    sortOrder: 1,
  },
  {
    _id: 'acc-shredded-latex-pillow',
    _type: 'accessory',
    name: 'Shredded Latex Pillow',
    slug: { current: 'shredded-latex-pillow' },
    tagline: 'Adjustable loft for customized comfort',
    description:
      'Filled with shredded GOLS-certified natural latex, this adjustable pillow lets you customize the loft by adding or removing fill. The shredded latex provides gentle, responsive support that adapts to any sleeping position. The breathable cotton casing ensures a cool, comfortable sleep surface.',
    type: 'shredded_pillow',
    pricing: { price: 1999, mrp: 3499, currency: '₹' },
    sizes: ['Standard', 'Queen', 'King'],
    features: [
      'Adjustable loft — add or remove fill to suit your preference',
      'GOLS-certified natural shredded latex fill',
      'Breathable organic cotton casing',
      'Ideal for all sleep positions (back, side, stomach)',
      'Hypoallergenic and dust mite resistant',
    ],
    inStock: true,
    isNew: true,
    isBestseller: false,
    sortOrder: 2,
  },
  {
    _id: 'acc-premium-fiber-pillow',
    _type: 'accessory',
    name: 'Premium Microfiber Pillow',
    slug: { current: 'premium-microfiber-pillow' },
    tagline: 'Soft, plush comfort at an accessible price',
    description:
      'Our Premium Microfiber Pillow offers a soft, cloud-like feel with medium support suitable for all sleepers. The siliconized hollow fiber fill provides excellent loft retention and bounce-back, while the double-layered fabric prevents fiber migration. An excellent value option for guest rooms or everyday use.',
    type: 'fiber_pillow',
    pricing: { price: 999, mrp: 1999, currency: '₹' },
    sizes: ['Standard', 'Queen', 'King'],
    features: [
      'Siliconized hollow fiber fill for lasting loft',
      'Medium support suitable for all sleep positions',
      'Hypoallergenic and machine washable',
      'Double-layered fabric prevents fiber migration',
      'Great value for everyday and guest use',
    ],
    inStock: true,
    isNew: false,
    isBestseller: false,
    sortOrder: 3,
  },
  {
    _id: 'acc-waterproof-mattress-protector',
    _type: 'accessory',
    name: 'Elasticated Waterproof Mattress Protector',
    slug: { current: 'waterproof-mattress-protector' },
    tagline: 'Full protection with zero-compromise comfort',
    description:
      'Protect your RelaxPro mattress with this premium elasticated mattress protector. Featuring a breathable waterproof membrane that blocks liquids, dust mites, and allergens while maintaining airflow. The deep-pocket elasticated design fits mattresses up to 14 inches thick and stays securely in place. Quiet, no-crinkle fabric ensures undisturbed sleep.',
    type: 'mattress_protector',
    pricing: { price: 1799, mrp: 2999, currency: '₹' },
    sizes: ['Single', 'Double', 'Queen', 'King'],
    features: [
      'Breathable waterproof membrane protects against spills and stains',
      'Blocks dust mites and common allergens',
      'Deep-pocket design fits mattresses up to 14" thick',
      'No-crinkle fabric for silent, comfortable sleep',
      'Machine washable for easy care',
    ],
    inStock: true,
    isNew: true,
    isBestseller: true,
    sortOrder: 4,
  },
];

async function retry(fn, label, max = 3) {
  for (let i = 0; i < max; i++) {
    try {
      await fn();
      return;
    } catch (err) {
      if (i < max - 1) {
        console.log(`  retry ${i + 1}/${max} "${label}" — ${err.message}`);
        await new Promise((r) => setTimeout(r, 2000));
      } else throw new Error(`Failed "${label}": ${err.message}`);
    }
  }
}

async function main() {
  console.log('═'.repeat(50));
  console.log('  Seeding Accessory Products into Sanity');
  console.log('═'.repeat(50));

  for (const acc of ACCESSORIES) {
    await retry(
      () => client.createOrReplace(acc),
      acc.name
    );
    console.log(`  ✓ ${acc.name.padEnd(30)} ₹${acc.pricing.price}`);
  }

  console.log('\n' + '═'.repeat(50));
  console.log('  Done! 4 accessories seeded.');
  console.log('═'.repeat(50));
  console.log('\n  Check Sanity Studio → Accessories section.\n');
}

main().catch((err) => {
  console.error('\n✗ Seed failed:', err.message);
  process.exit(1);
});
