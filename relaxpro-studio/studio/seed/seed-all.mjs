/**
 * seed-all.mjs — RelaxPro Comprehensive Content Seeder
 *
 * Seeds EVERYTHING in one command:
 *   SANITY_AUTH_TOKEN=<token> node seed-all.mjs
 *
 * 1. Uploads local images to Sanity CDN
 * 2. Creates all documents matching the GROQ query structures
 * 3. Supports reruns (createOrReplace)
 *
 * Content types seeded:
 *   siteSettings, navigation, hero, brandCategory (3), product (13),
 *   testimonial (15), faq (20+), showroom (3), accessory (4),
 *   sleepStyle (6+), policyPage (3), offer (3), certification (5+),
 *   certificationSettings, customBuilder, builderMaterial (6+),
 *   builderFabric (4+), home (full), about, contact, productsPage,
 *   sleepScience, gallery, location
 */

/* eslint-disable no-await-in-loop */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, extname } from 'path'

// ─── CONFIG ─────────────────────────────────────────────────────────────────

const TOKEN = process.env.SANITY_AUTH_TOKEN
if (!TOKEN) {
  console.error('❌ SANITY_AUTH_TOKEN env var required')
  console.error('   Get it from https://www.sanity.io/manage → API → Tokens')
  process.exit(1)
}

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const PROJECT_ROOT = join(import.meta.dirname, '..', '..', '..')
const IMAGE_DIR = join(PROJECT_ROOT, 'public', 'images')

// ─── IMAGE CACHE ─────────────────────────────────────────────────────────────

const CACHE_FILE = join(import.meta.dirname, 'image-cache.json')
let imageCache = {}
try {
  if (existsSync(CACHE_FILE)) {
    imageCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'))
  }
} catch { /* ignore */ }

async function img(localPath, altText) {
  if (!localPath) return null

  // Normalize path separators
  const key = localPath.replace(/\\/g, '/').replace(/^\//, '')

  // Return cached if available
  if (imageCache[key]) {
    const cached = imageCache[key]
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: cached.asset },
      alt: altText || cached.alt || '',
    }
  }

  const fullPath = join(IMAGE_DIR, key)
  if (!existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${key} (${fullPath})`)
    return null
  }

  try {
    const buffer = readFileSync(fullPath)
    const filename = key.split(/[/\\]/).pop()
    const asset = await client.assets.upload('image', buffer, { filename })
    const fallbackAlt = filename
      .replace(extname(filename), '')
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

    // Cache it
    imageCache[key] = { asset: asset._id, alt: fallbackAlt }
    writeFileSync(CACHE_FILE, JSON.stringify(imageCache, null, 2))

    console.log(`  📷 Uploaded ${key} → ${asset._id}`)
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt: altText || fallbackAlt,
    }
  } catch (err) {
    console.error(`  ❌ Upload failed ${key}: ${err.message}`)
    return null
  }
}

// Upload multiple images in parallel
function imgRef(key, alt) { return { path: key, alt } }

// ─── RETRY HELPER ───────────────────────────────────────────────────────────

async function retry(fn, label, max = 3) {
  for (let i = 0; i < max; i++) {
    try {
      await fn()
      return
    } catch (err) {
      if (i < max - 1) {
        console.log(`  ⟳ retry ${i + 1}/${max} "${label}": ${err.message}`)
        await new Promise((r) => setTimeout(r, 2000))
      } else {
        throw new Error(`Failed "${label}": ${err.message}`)
      }
    }
  }
}

async function upsert(type, item) {
  const label =
    item.name ||
    item.customerName ||
    item.title ||
    (item.question ? item.question.slice(0, 40) : '') ||
    item._id
  await retry(
    () =>
      client.createOrReplace({
        _id: item._id,
        _type: type,
        ...item,
      }),
    `${type}: ${label}`
  )
  console.log(`  ✅ ${type.padEnd(18)} ${label}`)
}

// ─── PORTABLE TEXT HELPER ───────────────────────────────────────────────────

function block(text) {
  return [
    {
      _type: 'block',
      style: 'normal',
      children: [{ _type: 'span', text }],
    },
  ]
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 1 — CATEGORIES (brandCategory)
// ═════════════════════════════════════════════════════════════════════════════

async function seedCategories() {
  console.log('\n═══════ CATEGORIES ═══════')

  const cats = [
    {
      _id: 'cat-luxury',
      name: 'Luxury Collection',
      slug: { current: 'luxury' },
      description:
        'Our premium 100% pure natural latex mattresses with GOLS certification and superior comfort. Handcrafted from organic Kerala latex.',
      image: await img('products/nirvana.webp', 'Luxury Collection'),
      order: 1,
    },
    {
      _id: 'cat-premium',
      name: 'Premium Collection',
      slug: { current: 'premium' },
      description:
        'Latex hybrids combining organic latex with high-density support layers for balanced comfort and orthopedic benefits.',
      image: await img('products/somya.webp', 'Premium Collection'),
      order: 2,
    },
    {
      _id: 'cat-comfort',
      name: 'Comfort Collection',
      slug: { current: 'comfort' },
      description:
        'Value orthopedic foam and latex-entry mattresses designed for accessible comfort without compromising quality.',
      image: await img('products/sunidra.webp', 'Comfort Collection'),
      order: 3,
    },
  ]

  for (const c of cats) await upsert('brandCategory', c)
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 2 — PRODUCTS
// ═════════════════════════════════════════════════════════════════════════════

async function seedProducts() {
  console.log('\n═══════ PRODUCTS ═══════')

  const products = [
    // ── 1. Nirvana ──
    {
      _id: 'product-nirvana',
      name: 'Nirvana',
      slug: { current: 'nirvana' },
      tagline: 'Experience ultimate relaxation',
      subtitle: 'Luxury sleep begins with Nirvana latex mattress',
      keyBenefit:
        '6" Kerala Latex 90 density pure 96.6% Purity GOLS certified for therapeutic deep sleep and pressure relief',
      description:
        'Nirvana is our flagship pure latex mattress, crafted entirely from a single 6-inch block of 100% natural Dunlop latex sourced from certified organic Kerala plantations. With an exceptional 96.6% purity and GOLS certification, every inch delivers therapeutic pressure relief that cradles your body while maintaining perfect spinal alignment.',
      shortDescription:
        '6 inch 100% pure Kerala Latex 90 density 96.6% purity GOLS certified plush therapeutic mattress for deep sleep and pressure relief',
      badge: 'Premium Pure Latex Comfort',
      warranty: 10,
      comfortLevel: 'plush',
      comfortRating: 5,
      totalThickness: 6,
      layers: [
        {
          _key: 'l0',
          thickness: 6,
          material: 'latex',
          brand: 'RelaxPro Kerala Organic',
          certification: ['GOLS'],
          description:
            '6" Kerala Latex 90 density pure 96.6% Purity GOLS certified',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 54000,
        mrp: 68000,
        currency: '₹',
        withAccessories: {
          king: 54000,
          queen: 45000,
          double: 32000,
          single: 27000,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 49000,
          queen: 41000,
          double: 33000,
          single: 24500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        '6" Kerala Latex 90 density pure 96.6% Purity GOLS certified for therapeutic deep sleep',
        '100% natural biodegradable Dunlop latex sap harvested under strict GOLS organic standards',
        'Zero synthetic chemicals, fillers, or VOC emissions — completely safe for infants and elders',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
        'Get video call while making and receive 1 edited making video for reference',
      ],
      image: await img('products/nirvana.webp', 'Nirvana Mattress'),
      images: [
        await img('products/nirvana-gallery-1.webp', 'Nirvana Gallery 1'),
        await img('products/nirvana-gallery-2.webp', 'Nirvana Gallery 2'),
        await img('products/nirvana-gallery-3.webp', 'Nirvana Gallery 3'),
        await img('products/nirvana-gallery-4.webp', 'Nirvana Gallery 4'),
        await img('products/nirvana-gallery-5.webp', 'Nirvana Gallery 5'),
      ].filter(Boolean),
      tier: 'luxury',
      isBestseller: true,
      isNew: false,
      isFeatured: true,
      inStock: true,
      rating: 4.9,
      reviewCount: 1200,
      sortOrder: 1,
      category: { _type: 'reference', _ref: 'cat-luxury' },
      seo: {
        metaTitle: 'Nirvana 6" Pure Natural Latex Mattress | RelaxPro',
        metaDescription:
          'Buy RelaxPro Nirvana 6-inch 100% natural latex mattress. 90 density pure 96.6% GOLS certified Kerala latex. 10-year warranty, free shipping.',
      },
    },

    // ── 2. Amrita ──
    {
      _id: 'product-amrita',
      name: 'Amrita',
      slug: { current: 'amrita' },
      tagline: 'Sleep that rejuvenates you',
      subtitle: 'Feel long-lasting luxury with Amrita latex mattress',
      keyBenefit:
        'Heavy hybrid foundation topped with a ultra-thick premium organic latex comfort layer for deep body contouring and muscle recovery',
      description:
        'Amrita is a 10-inch hybrid masterpiece that pairs a 4-inch high-density rebonded Century foam base with a luxurious 6-inch slab of GOLS-certified pure organic Kerala latex. This combination delivers the best of both worlds: the rock-solid foundation that never sags, topped with a thick cloud of natural latex that contours to every curve of your body.',
      shortDescription:
        '10 inch luxury hybrid with 4 inch Century rebonded base and 6 inch GOLS certified premium organic latex for body contouring and muscle recovery',
      badge:
        'Premium 10" Reversible Rebonded + Latex Hybrid',
      warranty: 10,
      comfortLevel: 'medium-soft',
      comfortRating: 4,
      totalThickness: 10,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century High Density',
          description:
            '4" Rebonded Base Foam with 90 to 95 Density (Century brand)',
        },
        {
          _key: 'l1',
          thickness: 6,
          material: 'latex',
          brand: 'RelaxPro Pure Organic',
          certification: ['GOLS'],
          description:
            '6" Premium GOLS Certified Natural Kerala Latex',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 48000,
        mrp: 61000,
        currency: '₹',
        withAccessories: {
          king: 48000,
          queen: 40000,
          double: 32000,
          single: 24000,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 43000,
          queen: 36000,
          double: 29000,
          single: 21500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Luxurious 10-inch thick profile combining the posture support of premium rebonded foam and cloud latex comfort',
        '6 inches of pure Kerala latex handles natural spine-contouring, lowering tosses and turns',
        'Ultra durable Century 95-density rebonded base guarantees zero sagging for over a decade',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
        'Get video call while making and receive 1 edited making video for reference',
      ],
      image: await img('products/amrita.webp', 'Amrita Mattress'),
      images: [
        await img('products/amrita-gallery-1.webp', 'Amrita Gallery 1'),
        await img('products/amrita-gallery-2.webp', 'Amrita Gallery 2'),
        await img('products/amrita-gallery-3.webp', 'Amrita Gallery 3'),
        await img('products/amrita-gallery-4.webp', 'Amrita Gallery 4'),
        await img('products/amrita-gallery-5.webp', 'Amrita Gallery 5'),
      ].filter(Boolean),
      tier: 'luxury',
      isBestseller: true,
      isNew: false,
      isFeatured: true,
      inStock: true,
      rating: 4.8,
      reviewCount: 890,
      sortOrder: 2,
      category: { _type: 'reference', _ref: 'cat-luxury' },
      seo: {
        metaTitle:
          'Amrita 10" Rebonded & Latex Luxury Mattress | RelaxPro',
        metaDescription:
          'Shop the Amrita 10-inch luxurious mattress with 4" rebonded support and 6" certified natural rubber latex.',
      },
    },

    // ── 3. Ananda ──
    {
      _id: 'product-ananda',
      name: 'Ananda',
      slug: { current: 'ananda' },
      tagline: 'Blissful comfort every night',
      subtitle: 'Turn bedtime into joy with Ananda latex mattress',
      keyBenefit:
        'Pure seamless solid organic latex master block yielding a buoyant response that cradles curves while securing independent motion isolation',
      description:
        'Ananda is a pure 6-inch solid natural latex mattress that strips away all foam and fillers to deliver the purest sleep experience possible. Made entirely from a single seamless block of Dunlop-processed organic latex, Ananda offers a buoyant, responsive feel that gently pushes back against your body.',
      shortDescription:
        '6 inch 100% pure GOLS certified organic latex mattress with buoyant response that cradles curves while securing independent motion isolation',
      badge: '100% Pure Classic Latex Comfort',
      warranty: 10,
      comfortLevel: 'soft-medium',
      comfortRating: 4,
      totalThickness: 6,
      layers: [
        {
          _key: 'l0',
          thickness: 6,
          material: 'latex',
          brand: 'RelaxPro Kerala Organic',
          certification: ['GOLS', 'Oeko-Tex'],
          description:
            '6" GOLS Certified 100% Pure Organic Latex',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 42000,
        mrp: 54000,
        currency: '₹',
        withAccessories: {
          king: 42000,
          queen: 35000,
          double: 28000,
          single: 21000,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 37000,
          queen: 31000,
          double: 25000,
          single: 18500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Made purely of a robust 6" luxury solid core of natural Dunlop organic latex, no foam fillers added',
        'Highly elastic properties distribute physical pressure points uniformly across the system',
        'Unsurpassed motion isolation ensures partner movements generate zero seismic disturbance',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
      ],
      image: await img('products/ananda.webp', 'Ananda Mattress'),
      images: [
        await img('products/ananda-gallery-1.webp', 'Ananda Gallery 1'),
        await img('products/ananda-gallery-2.webp', 'Ananda Gallery 2'),
        await img('products/ananda-gallery-3.webp', 'Ananda Gallery 3'),
        await img('products/ananda-gallery-4.webp', 'Ananda Gallery 4'),
      ].filter(Boolean),
      tier: 'luxury',
      isBestseller: false,
      isNew: false,
      isFeatured: true,
      inStock: true,
      rating: 4.7,
      reviewCount: 650,
      sortOrder: 3,
      category: { _type: 'reference', _ref: 'cat-luxury' },
      seo: {
        metaTitle:
          'Ananda 6" Pure Natural Latex Mattress | RelaxPro',
        metaDescription:
          'Order the Ananda 6-inch solid natural latex mattress by RelaxPro. Dynamic orthopedic elasticity, eco-conscious materials.',
      },
    },

    // ── 4. Prakriti ──
    {
      _id: 'product-prakriti',
      name: 'Prakriti',
      slug: { current: 'prakriti' },
      tagline: 'Comfort inspired by nature',
      subtitle: 'Breathe easy, sleep better with Prakriti latex mattress',
      keyBenefit:
        'Eco-conscious design utilizing organic latex shredded elements bound in high-density core topped with pure organic latex comfort layer',
      description:
        "Prakriti is our most eco-conscious design, featuring a dual-latex construction that upcycles shredded organic latex into a 4-inch high-density rebonded core, topped with 4 inches of pure GOLS-certified organic Kerala latex. This creates a mattress that's as kind to the planet as it is to your body.",
      shortDescription:
        '8 inch eco-friendly twin latex mattress with 4 inch eco-dense latex rebonded core and 4 inch pure certified organic Kerala latex comfort topper',
      badge: 'Eco-Friendly Twin Latex Engineering',
      warranty: 10,
      comfortLevel: 'medium-soft',
      comfortRating: 4,
      totalThickness: 8,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'latex_rebonded',
          brand: 'RelaxPro Core Tech',
          certification: ['ECO-Institut'],
          description:
            '4" Eco-Dense Latex Rebonded Foam made of upcycled latex shreds (120 Density)',
        },
        {
          _key: 'l1',
          thickness: 4,
          material: 'latex',
          brand: 'RelaxPro Pure Organic',
          certification: ['GOLS'],
          description:
            '4" pure certified organic Kerala latex',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex', 'ECO-Institut'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 44000,
        mrp: 56000,
        currency: '₹',
        withAccessories: {
          king: 44000,
          queen: 36500,
          double: 29000,
          single: 22000,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 39000,
          queen: 32500,
          double: 26000,
          single: 19500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Twin active latex components combine for uniform, cloud-like support with robust core endurance',
        '4" Eco-Dense latex rebonded base acts as a bouncy supportive core instead of conventional synthetic base foam',
        '4" pure Kerala top latex provides immediate luxurious contouring and comfort',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
      ],
      image: await img('products/prakriti.webp', 'Prakriti Mattress'),
      images: [
        await img('products/prakriti-gallery-1.webp', 'Prakriti Gallery 1'),
        await img('products/prakriti-gallery-2.webp', 'Prakriti Gallery 2'),
        await img('products/prakriti-gallery-3.webp', 'Prakriti Gallery 3'),
      ].filter(Boolean),
      tier: 'luxury',
      isBestseller: false,
      isNew: false,
      isFeatured: false,
      inStock: true,
      rating: 4.7,
      reviewCount: 340,
      sortOrder: 4,
      category: { _type: 'reference', _ref: 'cat-luxury' },
      seo: {
        metaTitle:
          'Prakriti 8" Natural & Eco-Rebonded Latex Mattress | RelaxPro',
        metaDescription:
          'Discover the Prakriti 8-inch natural latex mattress with eco-rebonded core and 100% natural latex topper.',
      },
    },

    // ── 5. Somya ──
    {
      _id: 'product-somya',
      name: 'Somya',
      slug: { current: 'somya' },
      tagline: 'Soft, Gentle comfort that your body will love',
      subtitle:
        'Sleep peacefully with Somya Natural latex mattress',
      keyBenefit:
        'Triple-layer design featuring ultra-plush resilient softy foam nested under premium pure latex to cradle heavy pressure points with heavy-duty rebonded support below',
      description:
        'Somya is a thoughtfully engineered 10-inch triple-layer mattress that delivers an exceptionally soft surface feel without compromising on deep support. Starting with a 4-inch Century extra-firm rebonded base for rigid spinal alignment, it adds a 2-inch layer of premium highly resilient softy cushioning foam.',
      shortDescription:
        '10 inch triple-layer premium hybrid with 4 inch Century rebonded base, 2 inch HR softy cushioning, and 4 inch GOLS certified pure organic latex',
      badge: 'Soft Contouring Orthopedic Hybrid',
      warranty: 10,
      comfortLevel: 'medium-soft',
      comfortRating: 4,
      totalThickness: 10,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century Extra-Firm',
          description:
            '4" Rebonded Foam with 90 to 95 Density (Century brand)',
        },
        {
          _key: 'l1',
          thickness: 2,
          material: 'hr_softy_foam',
          brand: 'Century AirFlow',
          description:
            '2" Premium Highly Resilient Softy Cushioning Foam',
        },
        {
          _key: 'l2',
          thickness: 4,
          material: 'latex',
          brand: 'RelaxPro Pure Organic',
          certification: ['GOLS'],
          description:
            '4" Pure Certified Organic Kerala Latex',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 41000,
        mrp: 53000,
        currency: '₹',
        withAccessories: {
          king: 41000,
          queen: 34000,
          double: 27000,
          single: 20500,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 36000,
          queen: 30000,
          double: 24000,
          single: 18000,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Advanced 3-tier build that balances extreme surface soft comfort and rigid physical alignment',
        '4 inches of dense latex on top delivers immediate muscle easing properties',
        '2" HR softy foam transition layer eliminates joint pressure spikes from the hard base element',
        '4" century 90-95 density rebond keeps the spine in strict medical alignment',
      ],
      image: await img('products/somya.webp', 'Somya Mattress'),
      images: [
        await img('products/somya-gallery-1.webp', 'Somya Gallery 1'),
        await img('products/somya-gallery-2.webp', 'Somya Gallery 2'),
        await img('products/somya-gallery-3.webp', 'Somya Gallery 3'),
      ].filter(Boolean),
      tier: 'premium',
      isBestseller: true,
      isNew: false,
      isFeatured: true,
      inStock: true,
      rating: 4.6,
      reviewCount: 720,
      sortOrder: 5,
      category: { _type: 'reference', _ref: 'cat-premium' },
      seo: {
        metaTitle:
          'Somya 10" Natural Latex Comfort Mattress | RelaxPro',
        metaDescription:
          'Shop Somya 10-inch mattress combining natural Kerala organic latex, plush HR soft foam, and sturdy rebonded base.',
      },
    },

    // ── 6. Arogya ──
    {
      _id: 'product-arogya',
      name: 'Arogya',
      slug: { current: 'arogya' },
      tagline: 'Health starts with good sleep',
      subtitle:
        'Support your body naturally with Arogya latex mattress',
      keyBenefit:
        'Perfect equal split of supportive heavy rebond base foam and cushioning latex, optimized for posture relief and corrective orthopedic support',
      description:
        'Arogya is a perfectly balanced 8-inch mattress that splits evenly between support and comfort — 4 inches of Century high-firm rebonded foam paired with 4 inches of GOLS-certified organic Kerala latex.',
      shortDescription:
        '8 inch doctor-recommended orthopedic mattress with 4 inch Century rebonded support and 4 inch GOLS certified organic latex core for posture relief',
      badge: 'Doctor Recommended Ortho Core',
      warranty: 10,
      comfortLevel: 'medium-firm',
      comfortRating: 4,
      totalThickness: 8,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century High Firm',
          description:
            '4" Rebonded Support Foam with 90 to 95 Density',
        },
        {
          _key: 'l1',
          thickness: 4,
          material: 'latex',
          brand: 'RelaxPro GOLS Organic',
          certification: ['GOLS'],
          description:
            '4" Certified Organic Kerala Latex Core',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 38000,
        mrp: 49000,
        currency: '₹',
        withAccessories: {
          king: 38000,
          queen: 31500,
          double: 26000,
          single: 19000,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 33000,
          queen: 27500,
          double: 23000,
          single: 16500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        '50/50 balance engineering specifically configured for chronic lower back and spinal recovery',
        'Substantial 4" pure Kerala natural latex gives correct support for standard hip/shoulder pressure zones',
        'Durable orthopedic rebonded block distributes skeletal loads evenly, promoting healthier sleep postures',
      ],
      image: await img('products/arogya.webp', 'Arogya Mattress'),
      images: [
        await img('products/arogya-gallery-1.webp', 'Arogya Gallery 1'),
        await img('products/arogya-gallery-2.webp', 'Arogya Gallery 2'),
        await img('products/arogya-gallery-3.webp', 'Arogya Gallery 3'),
      ].filter(Boolean),
      tier: 'premium',
      isBestseller: true,
      isNew: false,
      isFeatured: true,
      inStock: true,
      rating: 4.8,
      reviewCount: 910,
      sortOrder: 6,
      category: { _type: 'reference', _ref: 'cat-premium' },
      seo: {
        metaTitle:
          'Arogya 8" Orthopedic Latex Mattress | RelaxPro',
        metaDescription:
          'Configure Arogya 8" premium mattress with 4" GOLS latex and 4" high-density orthopedic rebond foam base.',
      },
    },

    // ── 7. Shuddha ──
    {
      _id: 'product-shuddha',
      name: 'Shuddha',
      slug: { current: 'shuddha' },
      tagline: 'Pure sleep begins here',
      subtitle:
        'Shuddha is made for those who choose natural comfort',
      keyBenefit:
        'Slick low-profile layout combining an eco-dense rebonded latex base with a highly responsive pure latex sleep zone',
      description:
        'Shuddha is a smart 6-inch low-profile mattress that proves big comfort comes in compact packages. It pairs a 4-inch layer of 120-density latex rebonded foam with a 2-inch top layer of pure certified organic Kerala latex.',
      shortDescription:
        '6 inch premium hybrid mattress with 4 inch latex rebonded eco core and 2 inch GOLS certified pure organic Kerala latex for natural comfort',
      badge: 'Optimal Height Natural Comfort',
      warranty: 10,
      comfortLevel: 'medium',
      comfortRating: 3,
      totalThickness: 6,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'latex_rebonded',
          brand: 'RelaxPro Eco Core',
          certification: ['GOLS'],
          description:
            '4" Latex Rebonded Foam with Eco GOLS shredded materials (120 Density)',
        },
        {
          _key: 'l1',
          thickness: 2,
          material: 'latex',
          brand: 'RelaxPro Certified Organic',
          certification: ['GOLS'],
          description:
            '2" Pure Certified Organic Kerala Latex',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 33000,
        mrp: 43000,
        currency: '₹',
        withAccessories: {
          king: 33000,
          queen: 27500,
          double: 22000,
          single: 16500,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 28000,
          queen: 23500,
          double: 19000,
          single: 14500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Engineered with advanced upcycled latex-bonded material preserving high durability at a smart cost',
        '2" top of organic natural latex adds that signature luxury spring-back comfort',
        '120-density core provides high load distribution, preventing that sunken trapped feel',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
      ],
      image: await img('products/shuddha.webp', 'Shuddha Mattress'),
      images: [
        await img('products/shuddha-gallery-1.webp', 'Shuddha Gallery 1'),
        await img('products/shuddha-gallery-2.webp', 'Shuddha Gallery 2'),
        await img('products/shuddha-gallery-3.webp', 'Shuddha Gallery 3'),
      ].filter(Boolean),
      tier: 'premium',
      isBestseller: false,
      isNew: false,
      isFeatured: false,
      inStock: true,
      rating: 4.5,
      reviewCount: 280,
      sortOrder: 7,
      category: { _type: 'reference', _ref: 'cat-premium' },
      seo: {
        metaTitle:
          'Shuddha 6" Premium Pure Latex Hybrid Mattress | RelaxPro',
        metaDescription:
          'Buy Shuddha 6-inch premium mattress with natural latex and eco-dense rebond latex block.',
      },
    },

    // ── 8. Sthira ──
    {
      _id: 'product-sthira',
      name: 'Sthira',
      slug: { current: 'sthira' },
      tagline: 'Strong support for deep sleep',
      subtitle:
        'Firm, Stable comfort with Sthira latex mattress',
      keyBenefit:
        'Highly requested firm orthopedic model packing a dense base with a high-tensile latex layer, designed specifically to address chronic posture issues',
      description:
        'Sthira is our firmest orthopedic mattress, designed for those who need maximum structural support to correct chronic posture issues. It combines a dense 4-inch Century 90 to 95 density rebonded base with a 2-inch layer of pure GOLS-certified organic Kerala latex.',
      shortDescription:
        '6 inch firm orthopedic mattress with 4 inch Century rebonded support and 2 inch GOLS certified pure organic Kerala latex — perfect firm extra-support ortho',
      badge: 'Perfect Firm Extra-Support Ortho',
      warranty: 10,
      comfortLevel: 'firm',
      comfortRating: 5,
      totalThickness: 6,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century 90 to 95 Density Ortho',
          description:
            '4" Rebonded Support Foam with 90 to 95 Density (Century brand)',
        },
        {
          _key: 'l1',
          thickness: 2,
          material: 'latex',
          brand: 'RelaxPro GOLS Certified',
          certification: ['GOLS'],
          description:
            '2" pure certified organic Kerala latex',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 27000,
        mrp: 35000,
        currency: '₹',
        withAccessories: {
          king: 27000,
          queen: 22500,
          double: 18000,
          single: 13500,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 22000,
          queen: 18500,
          double: 15000,
          single: 11000,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Firm orthopedic configuration that corrects bad sleeping habits and stabilizes the lumbar spine',
        '4" ultra-high density Century orthopedic foam block prevents any structural deflection',
        '2" true pure latex on top adds necessary gentle cushioning so hips and shoulders do not ache',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
      ],
      image: await img('products/sthira.webp', 'Sthira Mattress'),
      images: [
        await img('products/sthira-gallery-1.webp', 'Sthira Gallery 1'),
        await img('products/sthira-gallery-2.webp', 'Sthira Gallery 2'),
        await img('products/sthira-gallery-3.webp', 'Sthira Gallery 3'),
      ].filter(Boolean),
      tier: 'premium',
      isBestseller: true,
      isNew: false,
      isFeatured: true,
      inStock: true,
      rating: 4.9,
      reviewCount: 1500,
      sortOrder: 8,
      category: { _type: 'reference', _ref: 'cat-premium' },
      seo: {
        metaTitle:
          'Sthira 6" Firm Orthopedic Latex Mattress | RelaxPro',
        metaDescription:
          'Shop Sthira 6-inch extra supportive firm mattress. Features 4" heavy rebonded base and 2" organic latex topper.',
      },
    },

    // ── 9. Bhumi ──
    {
      _id: 'product-bhumi',
      name: 'Bhumi',
      slug: { current: 'bhumi' },
      tagline: 'Strong Stable Support Inspired by the Earth',
      subtitle:
        'Experience balanced sleep with Bhumi latex mattress',
      keyBenefit:
        'Triple-firm hybrid stacking rebonded base, latex-rebonded core, and luxurious latex cover for layered structural support',
      description:
        "Bhumi takes inspiration from the earth's geological layers, stacking three distinct support zones for a progressively firm feel that adapts to your body weight.",
      shortDescription:
        '8 inch triple-core hybrid mattress with 4 inch PU rebonded base, 2 inch latex rebonded cushioning, and 2 inch GOLS certified pure organic latex',
      badge: 'Multi-Adaptive Posture Layering',
      warranty: 10,
      comfortLevel: 'medium-firm',
      comfortRating: 4,
      totalThickness: 8,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century PU Rebonded',
          description:
            '4" PU Rebonded Support Base (Century Brand)',
        },
        {
          _key: 'l1',
          thickness: 2,
          material: 'latex_rebonded',
          brand: 'RelaxPro Eco Core',
          description:
            '2" Latex Rebonded Cushioning transition layer (120 Density)',
        },
        {
          _key: 'l2',
          thickness: 2,
          material: 'latex',
          brand: 'RelaxPro Pure Organic',
          certification: ['GOLS'],
          description:
            '2" Pure Certified Organic Kerala Latex',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 33000,
        mrp: 43000,
        currency: '₹',
        withAccessories: {
          king: 33000,
          queen: 27500,
          double: 22000,
          single: 16500,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 28000,
          queen: 23500,
          double: 19000,
          single: 14500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Layered progressive firmness: gets firmer as more compression force is applied',
        'Combination of raw polyurethane rebond, eco latex rebond, and classic virgin latex sap sheets',
        'Helps back-sleepers keep their pelvis neutral and chest aligned',
      ],
      image: await img('products/bhumi.webp', 'Bhumi Mattress'),
      images: [
        await img('products/bhumi-gallery-1.webp', 'Bhumi Gallery 1'),
        await img('products/bhumi-gallery-2.webp', 'Bhumi Gallery 2'),
        await img('products/bhumi-gallery-3.webp', 'Bhumi Gallery 3'),
      ].filter(Boolean),
      tier: 'premium',
      isBestseller: false,
      isNew: false,
      isFeatured: false,
      inStock: true,
      rating: 4.6,
      reviewCount: 410,
      sortOrder: 9,
      category: { _type: 'reference', _ref: 'cat-premium' },
      seo: {
        metaTitle:
          'Bhumi 8" Triple-Core Hybrid Latex Mattress | RelaxPro',
        metaDescription:
          'Unlock restorative sleep with Bhumi 8-inch mattress. Advanced triple core combining GOLS organic latex.',
      },
    },

    // ── 10. Sunidra ──
    {
      _id: 'product-sunidra',
      name: 'Sunidra',
      slug: { current: 'sunidra' },
      tagline: 'Sleep Deeper, Wake Refreshed',
      subtitle:
        'Experience peaceful nights with Sunidra latex mattress',
      keyBenefit:
        'Three-layer premium hybrid with cooling soft transition elements, delivering reliable medium comfort suitable for all types of sleepers',
      description:
        'Sunidra is our universal medium-comfort mattress, engineered to please side, back, and stomach sleepers alike. Its 8-inch profile layers a 4-inch Century high-firm rebonded base, a 2-inch premium HR softy transition foam, and a 2-inch pure GOLS-certified organic Kerala latex top.',
      shortDescription:
        '8 inch universal medium comfort mattress with 4 inch Century rebonded base, 2 inch HR softy transition foam, and 2 inch GOLS certified organic latex',
      badge: 'Universal Medium All-Rounder',
      warranty: 10,
      comfortLevel: 'medium',
      comfortRating: 4,
      totalThickness: 8,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century High Firm',
          description:
            '4" Rebonded Base Foam with 90 to 95 Density',
        },
        {
          _key: 'l1',
          thickness: 2,
          material: 'hr_softy_foam',
          brand: 'Century AirFlow Softy',
          description: '2" Premium HR Softy transition foam',
        },
        {
          _key: 'l2',
          thickness: 2,
          material: 'latex',
          brand: 'RelaxPro Certified Organic',
          certification: ['GOLS'],
          description:
            '2" Pure Certified Organic Kerala Latex',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 30000,
        mrp: 39000,
        currency: '₹',
        withAccessories: {
          king: 30000,
          queen: 25000,
          double: 20000,
          single: 15000,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 25000,
          queen: 21000,
          double: 17000,
          single: 12500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Universal comfort profile that adapts effortlessly to side, back, and stomach sleepers',
        '2" GOLS certified top natural latex delivers excellent active pressure point reduction',
        'Middle 2" highly resilient softy foam cushions sensitive areas like collarbones and tailbones',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
      ],
      image: await img('products/sunidra.webp', 'Sunidra Mattress'),
      images: [
        await img('products/sunidra-gallery-1.webp', 'Sunidra Gallery 1'),
        await img('products/sunidra-gallery-2.webp', 'Sunidra Gallery 2'),
        await img('products/sunidra-gallery-3.webp', 'Sunidra Gallery 3'),
      ].filter(Boolean),
      tier: 'comfort',
      isBestseller: false,
      isNew: false,
      isFeatured: true,
      inStock: true,
      rating: 4.5,
      reviewCount: 530,
      sortOrder: 10,
      category: { _type: 'reference', _ref: 'cat-comfort' },
      seo: {
        metaTitle:
          'Sunidra 8" Universal Latex Comfort Mattress | RelaxPro',
        metaDescription:
          'Buy Sunidra 8-inch medium comfort mattress by RelaxPro.',
      },
    },

    // ── 11. Vishram ──
    {
      _id: 'product-vishram',
      name: 'Vishram',
      slug: { current: 'vishram' },
      tagline: 'Rest, Relaxation, Complete Ease',
      subtitle:
        'Vishram designed for true rest and deep relaxation',
      keyBenefit:
        'Entry-level latex hybrid focusing on value, blending standard cushioning transition foam with a genuine touch of natural latex comfort',
      description:
        'Vishram is our most accessible latex hybrid, designed as the perfect introduction to natural latex sleep without the premium price tag. At 7 inches, it stacks a 4-inch Century high-density rebonded support base, a 2-inch highly responsive HR softy foam transition layer, topped with a 1-inch pure GOLS-certified organic Kerala latex sheet.',
      shortDescription:
        '7 inch great value hybrid mattress with 4 inch Century rebonded base, 2 inch HR softy cushioning, and 1 inch GOLS certified pure organic Kerala latex',
      badge: 'Great Value Sleep Solution',
      warranty: 10,
      comfortLevel: 'medium',
      comfortRating: 3,
      totalThickness: 7,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century High Density',
          description:
            '4" Rebonded support base (95 density)',
        },
        {
          _key: 'l1',
          thickness: 2,
          material: 'hr_softy_foam',
          brand: 'Century Softy',
          description:
            '2" highly responsive HR softy foam',
        },
        {
          _key: 'l2',
          thickness: 1,
          material: 'latex',
          brand: 'RelaxPro Organic Sheet',
          certification: ['GOLS'],
          description:
            '1" Pure Certified Organic Kerala Latex Sheet',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['GOLS', 'Oeko-Tex'],
      accessories: ['2 Latex Pillows', '1 Protector'],
      pricingModel: 'with_without_accessories',
      pricing: {
        startingPrice: 24000,
        mrp: 31000,
        currency: '₹',
        withAccessories: {
          king: 24000,
          queen: 20000,
          double: 18000,
          single: 12000,
          diwan: 34000,
          custom: 0,
        },
        withoutAccessories: {
          king: 19000,
          queen: 16000,
          double: 13000,
          single: 9500,
          diwan: 31000,
          custom: 0,
        },
      },
      features: [
        'Affordable entry layer to the luxurious universe of raw natural latex sleep',
        '1" organic Kerala latex sheet blocks thermal heat pockets of the base foams',
        '2" HR soft pillow cushioning transitions body lines smoothly onto the base layer',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
      ],
      image: await img('products/vishram.webp', 'Vishram Mattress'),
      images: [
        await img('products/vishram-gallery-1.webp', 'Vishram Gallery 1'),
        await img('products/vishram-gallery-2.webp', 'Vishram Gallery 2'),
        await img('products/vishram-gallery-3.webp', 'Vishram Gallery 3'),
      ].filter(Boolean),
      tier: 'comfort',
      isBestseller: false,
      isNew: false,
      isFeatured: false,
      inStock: true,
      rating: 4.4,
      reviewCount: 380,
      sortOrder: 11,
      category: { _type: 'reference', _ref: 'cat-comfort' },
      seo: {
        metaTitle:
          'Vishram 7" Hybrid Value Latex Mattress | RelaxPro',
        metaDescription:
          'Experience Vishram 7" mattress with 4" Century rebond, 2" softy cushioning, and 1" raw natural latex.',
      },
    },

    // ── 12. Ojas ──
    {
      _id: 'product-ojas',
      name: 'Ojas',
      slug: { current: 'ojas' },
      tagline: 'Wake up refreshed and energised every morning',
      subtitle:
        'Feel the power of natural sleep with Ojas ortho mattress',
      keyBenefit:
        'Value orthopedic mattress without natural latex, utilizing high density resilience softy core for back safety and deep recovery at an accessible price',
      description:
        'Ojas proves that exceptional orthopedic support does not require natural latex. This 6-inch mattress pairs a 4-inch ultra-firm Century Ortho rebonded base with a 2-inch highly resilient HR softy foam top layer.',
      shortDescription:
        '6 inch best ortho value mattress with 4 inch ultra-firm rebonded base and 2 inch highly resilient HR softy foam — no latex, Oeko-Tex certified',
      badge: 'Best Ortho Value Mattress',
      warranty: 10,
      comfortLevel: 'firm',
      comfortRating: 3,
      totalThickness: 6,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century Ortho',
          description:
            '4" Ultra-Firm Rebonded Support base foam',
        },
        {
          _key: 'l1',
          thickness: 2,
          material: 'hr_softy_foam',
          brand: 'Century Responsive',
          description:
            '2" highly responsive high-resilience softy foam',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['Oeko-Tex'],
      accessories: ['2 Shredded Pillows', '1 Protector'],
      pricingModel: 'fabric_options',
      pricing: {
        startingPrice: 13000,
        mrp: 17000,
        currency: '₹',
        fabric300Gsm: {
          king: 13000,
          queen: 11000,
          double: 8500,
          single: 6500,
          diwan: 9500,
          custom: 0,
        },
        fabric450Gsm: {
          king: 15000,
          queen: 12500,
          double: 10000,
          single: 7500,
          diwan: 11500,
          custom: 0,
        },
      },
      features: [
        'Tailored for budgets looking for robust spine stabilization without latex premium tags',
        'Dual foam profile: 4" highly dense rebond base with heavy 2" soft resilience topper',
        'Aero-ventilation channels promote passive heat dissipation',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
      ],
      image: await img('products/ojas.webp', 'Ojas Mattress'),
      images: [
        await img('products/ojas-gallery-1.webp', 'Ojas Gallery 1'),
        await img('products/ojas-gallery-2.webp', 'Ojas Gallery 2'),
        await img('products/ojas-gallery-3.webp', 'Ojas Gallery 3'),
      ].filter(Boolean),
      tier: 'comfort',
      isBestseller: false,
      isNew: false,
      isFeatured: false,
      inStock: true,
      rating: 4.3,
      reviewCount: 650,
      sortOrder: 12,
      category: { _type: 'reference', _ref: 'cat-comfort' },
      seo: {
        metaTitle:
          'Ojas Ortho Value Mattress | RelaxPro',
        metaDescription:
          'Buy Ojas 6" Orthopedic mattress. Tailored with density transitions for spine safety.',
      },
    },

    // ── 13. AyushRest ──
    {
      _id: 'product-ayushrest',
      name: 'AyushRest',
      slug: { current: 'ayushrest' },
      tagline: 'Sleep built to last',
      subtitle:
        'Long-term comfort with AyushRest ortho mattress',
      keyBenefit:
        'Heavy-duty 8" triple density orthopedic foam mattress featuring customized comfort zones to safely distribute skeletal weight and prevent pressure spots',
      description:
        'AyushRest is our most robust all-foam orthopedic mattress, featuring a heavy-duty 8-inch triple-density construction designed for long-term durability and pressure-free sleep.',
      shortDescription:
        '8 inch tough long-life triple density orthopedic foam mattress with customized comfort zones for skeletal weight distribution and pressure spot prevention',
      badge: 'Tough Long-Life Ortho Choice',
      warranty: 10,
      comfortLevel: 'firm',
      comfortRating: 4,
      totalThickness: 8,
      layers: [
        {
          _key: 'l0',
          thickness: 4,
          material: 'rebonded_foam',
          brand: 'Century Heavy Ortho',
          description:
            '4" Extra Density Rebonded Base Foam',
        },
        {
          _key: 'l1',
          thickness: 2,
          material: 'hr_foam',
          brand: 'Century Ortho HR',
          description:
            '2" High-Resilience Firm Orthopedic Support Foam',
        },
        {
          _key: 'l2',
          thickness: 2,
          material: 'hr_softy_foam',
          brand: 'Century Softy Cushion',
          description:
            '2" Super Soft Cushioning HR Softy Foam',
        },
      ],
      fabricGsm: 400,
      fabricType:
        '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
      certifications: ['Oeko-Tex'],
      accessories: ['2 Shredded Pillows', '1 Protector'],
      pricingModel: 'fabric_options',
      pricing: {
        startingPrice: 16000,
        mrp: 21000,
        currency: '₹',
        fabric300Gsm: {
          king: 16000,
          queen: 13500,
          double: 10500,
          single: 8000,
          diwan: 9500,
          custom: 0,
        },
        fabric450Gsm: {
          king: 18000,
          queen: 15500,
          double: 12000,
          single: 9000,
          diwan: 11500,
          custom: 0,
        },
      },
      features: [
        'Thick 8" orthopedic profile without latex, packing three distinct posture layers',
        'Heavy-duty 4" rebound base combined with central 2" structured orthopedic HR density',
        'Crowned with a plush 2" Century softy cushion, preventing skin or bone pressure sores',
        '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability',
      ],
      image: await img('products/ayushrest.webp', 'AyushRest Mattress'),
      images: [
        await img('products/ayushrest-gallery-1.webp', 'AyushRest Gallery 1'),
        await img('products/ayushrest-gallery-2.webp', 'AyushRest Gallery 2'),
        await img('products/ayushrest-gallery-3.webp', 'AyushRest Gallery 3'),
      ].filter(Boolean),
      tier: 'comfort',
      isBestseller: false,
      isNew: false,
      isFeatured: false,
      inStock: true,
      rating: 4.4,
      reviewCount: 420,
      sortOrder: 13,
      category: { _type: 'reference', _ref: 'cat-comfort' },
      seo: {
        metaTitle:
          'AyushRest 8" Orthopedic Foam Mattress | RelaxPro',
        metaDescription:
          'Explore the AyushRest 8" orthopedic mattress by RelaxPro.',
      },
    },
  ]

  for (const p of products) await upsert('product', p)
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 3 — TESTIMONIALS (15 real-sounding reviews)
// ═════════════════════════════════════════════════════════════════════════════

function seedTestimonials() {
  console.log('\n═══════ TESTIMONIALS ═══════')

  const testimonials = [
    {
      _id: 'testimonial-gm-1',
      customerName: 'Srinivas Rao',
      location: 'Hyderabad',
      rating: 5,
      quote:
        'Buying the Nirvana mattress was the best decision for my chronic lower back issues. The 7-Zone support works like a charm. Absolutely highly recommended!',
      isVerified: true,
      featured: true,
      order: 1,
      productPurchased: { _type: 'reference', _ref: 'product-nirvana' },
      date: '2026-06-15',
    },
    {
      _id: 'testimonial-gm-2',
      customerName: 'Anvitha Reddy',
      location: 'Bangalore',
      rating: 5,
      quote:
        'We got the Amrita mattress 6 months ago. Incredible comfort. It isolates motion perfectly; I do not feel my husband tossing and turning at all. The direct factory price represents fantastic value.',
      isVerified: true,
      featured: true,
      order: 2,
      productPurchased: { _type: 'reference', _ref: 'product-amrita' },
      date: '2026-06-10',
    },
    {
      _id: 'testimonial-gm-3',
      customerName: 'Rajendra Prasad',
      location: 'Rajahmundry',
      rating: 5,
      quote:
        'Sthira is perfect for those who want a firm but very comfortable orthopedic feel. Suresh the manufacturer explained the layers clearly. Excellent customer service!',
      isVerified: true,
      featured: true,
      order: 3,
      productPurchased: { _type: 'reference', _ref: 'product-sthira' },
      date: '2026-05-28',
    },
    {
      _id: 'testimonial-gm-4',
      customerName: 'Deepak Sharma',
      location: 'Hyderabad',
      rating: 5,
      quote:
        'I am amazed by the Custom Mattress builder! I configured a custom 10-inch mattress with 5 inches of raw Kerala latex and it was delivered within 6 days. Best sleep ever.',
      isVerified: true,
      featured: true,
      order: 4,
      date: '2026-05-20',
    },
    {
      _id: 'testimonial-gm-5',
      customerName: 'Priya Singh',
      location: 'Chennai',
      rating: 5,
      quote:
        'The Arogya mattress has completely transformed my sleep. My back pain has reduced significantly since switching to natural latex. Highly recommend!',
      isVerified: true,
      featured: true,
      order: 5,
      productPurchased: { _type: 'reference', _ref: 'product-arogya' },
      date: '2026-05-15',
    },
    {
      _id: 'testimonial-gm-6',
      customerName: 'Venkatesh Iyer',
      location: 'Bangalore',
      rating: 5,
      quote:
        'After trying multiple memory foam mattresses that sagged after a year, I switched to RelaxPro. The difference is night and day. No sinking, no heat retention. Just pure comfort.',
      isVerified: true,
      featured: true,
      order: 6,
      productPurchased: { _type: 'reference', _ref: 'product-prakriti' },
      date: '2026-04-12',
    },
    {
      _id: 'testimonial-gm-7',
      customerName: 'Lakshmi Devi',
      location: 'Vijayawada',
      rating: 5,
      quote:
        'Bought the Somya for my parents who have severe back issues. They say it feels like sleeping on a cloud but with proper support. Best gift I could give them.',
      isVerified: true,
      featured: false,
      order: 7,
      productPurchased: { _type: 'reference', _ref: 'product-somya' },
      date: '2026-04-05',
    },
    {
      _id: 'testimonial-gm-8',
      customerName: 'Arun Kumar',
      location: 'Hyderabad',
      rating: 4,
      quote:
        'Good value mattress. The Ojas is firm as expected and my posture has improved. Only wish the cover was removable for washing. Overall satisfied with the purchase.',
      isVerified: true,
      featured: false,
      order: 8,
      productPurchased: { _type: 'reference', _ref: 'product-ojas' },
      date: '2026-03-22',
    },
    {
      _id: 'testimonial-gm-9',
      customerName: 'Meghana Chowdary',
      location: 'Guntur',
      rating: 5,
      quote:
        'We purchased the Ananda mattress for our guest bedroom and ended up switching our own room to RelaxPro too. The natural latex cooling is unbelievable — no more sweaty nights!',
      isVerified: true,
      featured: false,
      order: 9,
      productPurchased: { _type: 'reference', _ref: 'product-ananda' },
      date: '2026-03-10',
    },
    {
      _id: 'testimonial-gm-10',
      customerName: 'Ravi Teja',
      location: 'Hyderabad',
      rating: 5,
      quote:
        'I have been manufacturing mattresses for 15 years and I can confidently say RelaxPro uses the highest quality latex I have seen in India. The 96.6% purity is genuine.',
      isVerified: true,
      featured: false,
      order: 10,
      productPurchased: { _type: 'reference', _ref: 'product-nirvana' },
      date: '2026-02-28',
    },
    {
      _id: 'testimonial-gm-11',
      customerName: 'Neha Gupta',
      location: 'Hyderabad',
      rating: 5,
      quote:
        'The custom builder experience was fantastic. I could choose exactly what I wanted — thickness, layers, fabric. The team guided me through the process on WhatsApp. Arrived in a week!',
      isVerified: true,
      featured: false,
      order: 11,
      date: '2026-02-15',
    },
    {
      _id: 'testimonial-gm-12',
      customerName: 'Mahesh Donthineni',
      location: 'Hyderabad',
      rating: 5,
      quote:
        'This is my third mattress purchase from RelaxPro, and I have had a great experience every time. I recently purchased the 4-inch Rebond + 4-inch Latex mattress, and the quality is excellent.',
      isVerified: true,
      featured: false,
      order: 12,
      date: '2026-01-20',
    },
    {
      _id: 'testimonial-gm-13',
      customerName: 'Shiva Kumar',
      location: 'Bangalore',
      rating: 5,
      quote:
        'Visited their Bangalore factory showroom and tried all models. The team was patient and knowledgeable. Ended up choosing the Shuddha for our small apartment — perfect 6-inch profile!',
      isVerified: true,
      featured: false,
      order: 13,
      productPurchased: { _type: 'reference', _ref: 'product-shuddha' },
      date: '2026-01-05',
    },
    {
      _id: 'testimonial-gm-14',
      customerName: 'Kavitha Srinivas',
      location: 'Chennai',
      rating: 5,
      quote:
        'Got the Sunidra for my teenage son. He loves it. Says he wakes up feeling more rested and his posture has improved. The medium feel works perfectly for side sleepers.',
      isVerified: true,
      featured: false,
      order: 14,
      productPurchased: { _type: 'reference', _ref: 'product-sunidra' },
      date: '2025-12-18',
    },
    {
      _id: 'testimonial-gm-15',
      customerName: 'Prakash Reddy',
      location: 'Kurnool',
      rating: 5,
      quote:
        'Got the Bhumi delivered to Kurnool in 6 days. Free delivery all the way! The triple-layer construction is comfortable yet supportive. Very happy with the purchase.',
      isVerified: true,
      featured: false,
      order: 15,
      productPurchased: { _type: 'reference', _ref: 'product-bhumi' },
      date: '2025-12-01',
    },
  ]

  return testimonials
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 4 — FAQS (18 across categories)
// ═════════════════════════════════════════════════════════════════════════════

function seedFaqs() {
  console.log('\n═══════ FAQS ═══════')

  const faqs = [
    {
      _id: 'faq-1',
      question: 'What makes RelaxPro mattresses different from other brands?',
      answer: block(
        'RelaxPro mattresses are handcrafted using 100% GOLS-certified natural Dunlop latex sourced directly from Kerala plantations. Unlike most brands that use synthetic latex or polyurethane foam with a thin latex layer, our mattresses feature solid natural latex cores with zero chemical fillers. We manufacture directly at our factory in Jeedimetla, Hyderabad, which eliminates middlemen.'
      ),
      category: 'Sleep Science',
      order: 1,
    },
    {
      _id: 'faq-2',
      question: 'Are RelaxPro mattresses good for back pain?',
      answer: block(
        'Yes. Our natural latex mattresses are recommended by orthopedic specialists for back pain relief. The open-cell latex structure conforms to your body\'s natural curves while providing the responsive support needed for proper spinal alignment. Unlike memory foam that can trap heat and cause you to sink into poor posture, latex gently pushes back, keeping your spine neutral throughout the night.'
      ),
      category: 'Health & Posture',
      order: 2,
    },
    {
      _id: 'faq-3',
      question: 'How long does delivery take?',
      answer: block(
        'We deliver within 5-7 business days for all standard mattress orders across India. Each mattress is handcrafted fresh after you place your order. We offer free white-glove delivery to major cities including Hyderabad, Bangalore, Chennai, and Rajahmundry. For custom builder orders, please allow 7-10 business days.'
      ),
      category: 'Pricing & Sizes',
      order: 3,
    },
    {
      _id: 'faq-5',
      question: 'What certifications do RelaxPro mattresses have?',
      answer: block(
        'Our products carry GOLS (Global Organic Latex Standard) certification for organic latex purity, Oeko-Tex Standard 100 for fabric safety, ECO-Institut certification for environmental compatibility, and FSC certification for sustainable wood sourcing. We are also ISO 9001 certified for quality management. Every certification document is available for viewing in our Certificates section.'
      ),
      category: 'Sleep Science',
      order: 5,
    },
    {
      _id: 'faq-6',
      question: 'Can I customize the thickness or firmness of my mattress?',
      answer: block(
        'Yes! Use our Custom Mattress Builder tool to select your preferred thickness from 4 to 10 inches, choose between soft, medium, or firm comfort levels, pick your cover fabric (300 GSM or 450 GSM), and even mix different latex densities for a personalized sleep surface. Our team will guide you through the process on WhatsApp.'
      ),
      category: 'Comfort & Feel',
      order: 6,
    },
    {
      _id: 'faq-7',
      question: 'What is your WhatsApp number for orders and inquiries?',
      answer: block(
        'You can reach us directly on WhatsApp at +91 86866 24494. Our founder Suresh personally handles all orthopedic consultations and can help you select the perfect mattress based on your sleep posture, body weight, and medical history. We typically respond within 30 minutes during business hours.'
      ),
      category: 'Pricing & Sizes',
      order: 7,
    },
    {
      _id: 'faq-8',
      question: 'Where are your showrooms located?',
      answer: block(
        'We have three experience centers: (1) Hyderabad Factory Showroom in Jeedimetla Industrial Area, Phase 3, (2) Rajahmundry Factory Showroom on JN Road, Opposite Surya Function Hall, and (3) Bangalore Factory Showroom in KR Puram Hoodi Main Road. Visit any location to test our full range of mattresses in person. We recommend booking an appointment for a personalized consultation.'
      ),
      category: 'Pricing & Sizes',
      order: 8,
    },
    {
      _id: 'faq-9',
      question: 'What is the difference between Dunlop and Talalay latex?',
      answer: block(
        'Our mattresses use the Dunlop process, which produces a denser, more durable latex core. Dunlop latex has a slightly firmer feel and is more affordable than Talalay. The Dunlop process is also more environmentally friendly as it uses less energy and water. For most sleepers, Dunlop latex provides the perfect balance of support and comfort.'
      ),
      category: 'Sleep Science',
      order: 9,
    },
    {
      _id: 'faq-10',
      question: 'Is natural latex suitable for allergy sufferers?',
      answer: block(
        'Yes! Natural latex is naturally hypoallergenic, dust mite resistant, and anti-microbial. The open-cell structure prevents the accumulation of dust mites, mold, and mildew — common triggers for allergies. Our GOLS certification guarantees no harmful chemicals or pesticides were used in the latex production process.'
      ),
      category: 'Health & Posture',
      order: 10,
    },
    {
      _id: 'faq-11',
      question: 'How do I clean and maintain my RelaxPro mattress?',
      answer: block(
        'Use a mattress protector to keep your mattress clean. Spot clean with mild soap and water — never soak the mattress. Rotate your mattress every 3-6 months for even wear. Our 400-450 GSM quilted fabric is designed for durability and easy maintenance. Avoid using harsh chemicals or bleach.'
      ),
      category: 'Materials & Care',
      order: 11,
    },
    {
      _id: 'faq-12',
      question: 'What sizes do you offer?',
      answer: block(
        'We offer all standard Indian mattress sizes: King (78x72 inches), Queen (78x60 inches), Double (78x48 inches), Single (78x36 inches), and Diwan (75x48 inches). Custom sizes are available through our Mattress Builder or by contacting us directly on WhatsApp.'
      ),
      category: 'Pricing & Sizes',
      order: 12,
    },
    {
      _id: 'faq-13',
      question: 'Do you offer financing or EMI options?',
      answer: block(
        'Yes, we offer easy EMI options through our partner financing services. Contact us on WhatsApp with your preferred mattress and we will share the available EMI plans. We believe quality sleep should be accessible to everyone.'
      ),
      category: 'Pricing & Sizes',
      order: 13,
    },
    {
      _id: 'faq-14',
      question: 'How does natural latex compare to memory foam?',
      answer: block(
        'Natural latex is superior to memory foam in several ways: (1) Temperature regulation — latex sleeps cooler due to open-cell structure, (2) Durability — latex lasts 15+ years vs 5-7 years for memory foam, (3) Responsiveness — latex pushes back instead of sinking, (4) Eco-friendly — natural latex is biodegradable, (5) Safety — no chemical off-gassing or VOCs.'
      ),
      category: 'Comfort & Feel',
      order: 14,
    },
    {
      _id: 'faq-16',
      question: 'Can I visit the factory to see how mattresses are made?',
      answer: block(
        'Yes! We welcome visitors to our Hyderabad factory in Jeedimetla. You can see the entire manufacturing process from raw latex processing to final quilting and packing. We recommend calling ahead to schedule a convenient time. This transparency is part of our commitment to quality.'
      ),
      category: 'Pricing & Sizes',
      order: 16,
    },
    {
      _id: 'faq-17',
      question: 'Is natural latex better for side sleepers?',
      answer: block(
        'Yes! Natural latex is excellent for side sleepers because it provides pressure relief at the shoulders and hips while maintaining support for the rest of the body. The responsive nature of latex ensures your spine stays aligned even when you sleep on your side. Our medium and medium-soft comfort levels work particularly well for side sleepers.'
      ),
      category: 'Comfort & Feel',
      order: 17,
    },
    {
      _id: 'faq-18',
      question: 'What GSM fabric should I choose?',
      answer: block(
        'Higher GSM (grams per square meter) means denser, more durable fabric. Our 300 GSM option is a standard quilted fabric suitable for most users. Our 450 GSM premium option offers a thicker, plusher feel with enhanced durability and a more luxurious appearance. We recommend 450 GSM for master bedrooms and 300 GSM for guest rooms or budget-conscious buyers.'
      ),
      category: 'Materials & Care',
      order: 18,
    },
    {
      _id: 'faq-19',
      question: 'Do you ship outside India?',
      answer: block(
        'Currently, we ship across all major cities in India including Hyderabad, Bangalore, Chennai, Mumbai, Delhi, and Pune. We also serve tier-2 cities across Telangana, Andhra Pradesh, Karnataka, and Tamil Nadu. Contact us for specific shipping availability to your location. International shipping is not yet available.'
      ),
      category: 'Pricing & Sizes',
      order: 19,
    },
    {
      _id: 'faq-20',
      question: 'How is the mattress delivered and set up?',
      answer: block(
        'Your mattress will be vacuum-compressed, rolled, and shipped in a manageable box. Upon arrival, simply unbox and place on your bed frame — the mattress will expand to full size within 24-48 hours. Our white-glove delivery service includes placement in your room of choice and removal of packaging materials.'
      ),
      category: 'Pricing & Sizes',
      order: 20,
    },
  ]

  return faqs
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 5 — SHOWROOMS
// ═════════════════════════════════════════════════════════════════════════════

async function seedShowrooms() {
  console.log('\n═══════ SHOWROOMS ═══════')

  const showrooms = [
    {
      _id: 'showroom-hyderabad',
      name: 'RelaxPro Factory Showroom — Hyderabad',
      slug: { current: 'hyderabad' },
      type: 'factory',
      address: {
        city: 'Hyderabad',
        fullAddress:
          'RelaxPro Factory Showroom, Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana - 500055',
        street: 'Jeedimetla Industrial Area, Phase 3',
        landmark: 'Near Prasad Labs',
        pincode: '500055',
        state: 'Telangana',
      },
      contact: {
        phoneNumbers: ['+918686624494', '+917207424494'],
        email: 'relaxpro2022@gmail.com',
        whatsapp: '+918686624494',
      },
      hours: {
        monday: '10:00 AM - 9:00 PM',
        tuesday: '10:00 AM - 9:00 PM',
        wednesday: '10:00 AM - 9:00 PM',
        thursday: '10:00 AM - 9:00 PM',
        friday: '10:00 AM - 9:00 PM',
        saturday: '10:00 AM - 9:00 PM',
        sunday: '10:00 AM - 9:00 PM',
        note: 'Open all 7 days',
      },
      image: await img('hero-banner.png', 'Hyderabad Showroom'),
      order: 1,
    },
    {
      _id: 'showroom-rajahmundry',
      name: 'RelaxPro Factory Showroom — Rajahmundry',
      slug: { current: 'rajahmundry' },
      type: 'experience',
      address: {
        city: 'Rajahmundry',
        fullAddress:
          'RelaxPro Factory Showroom, JN Road, Opposite Surya Function Hall, Rajahmundry, Andhra Pradesh - 533103',
        street: 'JN Road',
        landmark: 'Opposite Surya Function Hall',
        pincode: '533103',
        state: 'Andhra Pradesh',
      },
      contact: {
        phoneNumbers: ['+918686624494'],
        email: 'relaxpro2022@gmail.com',
        whatsapp: '+918686624494',
      },
      hours: {
        monday: '10:00 AM - 8:30 PM',
        tuesday: '10:00 AM - 8:30 PM',
        wednesday: '10:00 AM - 8:30 PM',
        thursday: '10:00 AM - 8:30 PM',
        friday: '10:00 AM - 8:30 PM',
        saturday: '10:00 AM - 8:30 PM',
        sunday: '11:00 AM - 7:00 PM',
        note: 'Closed on public holidays',
      },
      image: await img('about-story.png', 'Rajahmundry Showroom'),
      order: 2,
    },
    {
      _id: 'showroom-bangalore',
      name: 'RelaxPro Factory Showroom — Bangalore',
      slug: { current: 'bangalore' },
      type: 'partner',
      address: {
        city: 'Bangalore',
        fullAddress:
          'RelaxPro Factory Showroom, KR Puram Hoodi Main Road, Bangalore, Karnataka - 560036',
        street: 'KR Puram Hoodi Main Road',
        landmark: 'KR Puram Hoodi Main Road',
        pincode: '560038',
        state: 'Karnataka',
      },
      contact: {
        phoneNumbers: ['+917207424494'],
        email: 'relaxpro2022@gmail.com',
        whatsapp: '+917207424494',
      },
      hours: {
        monday: '10:30 AM - 8:30 PM',
        tuesday: '10:30 AM - 8:30 PM',
        wednesday: '10:30 AM - 8:30 PM',
        thursday: '10:30 AM - 8:30 PM',
        friday: '10:30 AM - 8:30 PM',
        saturday: '10:30 AM - 8:30 PM',
        sunday: '10:30 AM - 8:30 PM',
        note: 'Open all 7 days',
      },
      image: await img('about-process.png', 'Bangalore Showroom'),
      order: 3,
    },
  ]

  return showrooms
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 6 — ACCESSORIES
// ═════════════════════════════════════════════════════════════════════════════

async function seedAccessories() {
  console.log('\n═══════ ACCESSORIES ═══════')

  const accessories = [
    {
      _id: 'accessory-latex-pillow',
      name: 'Natural Latex Pillow',
      slug: { current: 'natural-latex-pillow' },
      tagline: 'Contoured support for your neck and shoulders',
      description:
        'Our GOLS-certified natural latex pillow offers the perfect balance of support and comfort. The open-cell structure promotes airflow, keeping you cool all night. Available in medium and firm densities.',
      type: 'latex_pillow',
      pricing: { price: 2499, mrp: 3999, currency: '₹' },
      sizes: ['Standard', 'King'],
      features: [
        '100% Natural Latex Core — GOLS Certified',
        'Breathable Organic Cotton Cover',
        'Medium-Firm Support for All Sleep Positions',
        'Hypoallergenic & Dust Mite Resistant',
        'Dimensions: 24" x 16" x 5" (Standard)',
      ],
      thumbnail: await img(
        'accessories/latex-pillow.jpg',
        'Latex Pillow'
      ),
      inStock: true,
      isNew: false,
      isBestseller: true,
      sortOrder: 1,
    },
    {
      _id: 'accessory-shredded-pillow',
      name: 'Shredded Latex Pillow',
      slug: { current: 'shredded-latex-pillow' },
      tagline: 'Adjustable loft for personalized comfort',
      description:
        'Made from shredded natural latex with a zippered cover, allowing you to add or remove filling to achieve your perfect loft and firmness. Ideal for all sleep positions.',
      type: 'shredded_pillow',
      pricing: { price: 1999, mrp: 2999, currency: '₹' },
      sizes: ['Standard', 'Queen', 'King'],
      features: [
        'Adjustable Loft — Customize Your Fill',
        '100% Natural Latex Shredded Fill',
        'Breathable Cotton Cover with Zipper',
        'Supports Side, Back & Stomach Sleepers',
        'Dimensions: 24" x 16" x 4-6" (Adjustable)',
      ],
      thumbnail: await img(
        'accessories/shredded-pillow.jpg',
        'Shredded Latex Pillow'
      ),
      inStock: true,
      isNew: true,
      isBestseller: false,
      sortOrder: 2,
    },
    {
      _id: 'accessory-fiber-pillow',
      name: 'Premium Fiber Pillow',
      slug: { current: 'premium-fiber-pillow' },
      tagline: 'Soft, plush comfort for gentle support',
      description:
        'Our premium hollow-fiber pillow provides a soft, plush feel for those who prefer a traditional pillow. The microfiber fill is hypoallergenic and machine washable.',
      type: 'fiber_pillow',
      pricing: { price: 999, mrp: 1499, currency: '₹' },
      sizes: ['Standard', 'Queen'],
      features: [
        'Hypoallergenic Hollow Fiber Fill',
        'Soft, Plush Feel for Gentle Support',
        'Machine Washable Cover',
        'Lightweight and Breathable',
        'Dimensions: 28" x 18" x 6"',
      ],
      thumbnail: await img(
        'accessories/fiber-pillow.jpg',
        'Fiber Pillow'
      ),
      inStock: true,
      isNew: false,
      isBestseller: false,
      sortOrder: 3,
    },
    {
      _id: 'accessory-mattress-protector',
      name: 'Organic Cotton Mattress Protector',
      slug: { current: 'organic-cotton-mattress-protector' },
      tagline: 'Premium protection for your RelaxPro mattress',
      description:
        'Protect your investment with our GOTS-certified organic cotton mattress protector. Waterproof yet breathable, it guards against spills, dust mites, and allergens while maintaining the feel of your mattress.',
      type: 'mattress_protector',
      pricing: { price: 2999, mrp: 4499, currency: '₹' },
      sizes: ['King', 'Queen', 'Double', 'Single'],
      features: [
        'GOTS Certified Organic Cotton Top',
        'Waterproof Yet Breathable Membrane',
        'Deep Pockets Fits 12" Mattresses',
        'Dust Mite & Allergen Barrier',
        'Machine Washable & Dryer Safe',
      ],
      thumbnail: await img(
        'accessories/mattress-protector.jpg',
        'Mattress Protector'
      ),
      inStock: true,
      isNew: false,
      isBestseller: false,
      sortOrder: 4,
    },
  ]

  for (const a of accessories) await upsert('accessory', a)
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 7 — OFFERS
// ═════════════════════════════════════════════════════════════════════════════

function seedOffers() {
  console.log('\n═══════ OFFERS ═══════')

  const offers = [
    {
      _id: 'offer-factory-direct',
      title: 'Factory Direct Pricing — Up to 30% Off',
      subtitle:
        'Why pay retail when you can buy directly from the manufacturer?',
      description:
        'Get genuine factory-direct pricing on all RelaxPro mattresses. No middlemen, no showroom commissions, no hidden costs. What you see is what you pay — plus free delivery.',
      badge: 'Best Value',
      type: 'discount',
      discountText: 'Factory Direct — Save 30%',
      cta: {
        label: 'Shop Factory Direct',
        link: '/catalog',
        variant: 'primary',
        openInNewTab: false,
      },
      isActive: true,
      showBanner: false,
      priority: 10,
    },
    {
      _id: 'offer-free-accessories',
      title: 'Free Accessories with Every Purchase',
      subtitle:
        'Get 2 Latex Pillows + Mattress Protector Free',
      description:
        'When you buy any RelaxPro mattress, receive 2 natural latex pillows and an organic cotton mattress protector absolutely free. Limited stock offer — valid while supplies last.',
      badge: 'Limited Time',
      type: 'bundle',
      discountText: 'Free ₹8,497 Worth of Accessories',
      cta: {
        label: 'Claim This Offer',
        link: '/catalog',
        variant: 'primary',
        openInNewTab: false,
      },
      isActive: true,
      showBanner: true,
      bannerColor: 'brand',
      priority: 8,
    },
    {
      _id: 'offer-comfort-collection',
      title: 'Comfort Collection — Starting at ₹6,500',
      subtitle:
        'Premium orthopedic mattresses at entry-level prices',
      description:
        'Explore our Comfort Collection featuring the Ojas and AyushRest models. Perfect for guest rooms, hostels, and budget-conscious buyers who refuse to compromise on quality.',
      badge: 'Budget Friendly',
      type: 'seasonal',
      discountText: 'From ₹6,500',
      cta: {
        label: 'Explore Comfort Collection',
        link: '/catalog?tier=comfort',
        variant: 'secondary',
        openInNewTab: false,
      },
      isActive: true,
      showBanner: false,
      priority: 6,
    },
  ]

  return offers
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 8 — POLICY PAGES
// ═════════════════════════════════════════════════════════════════════════════

function seedPolicyPages() {
  console.log('\n═══════ POLICY PAGES ═══════')

  const pages = [
    {
      _id: 'policy-privacy',
      title: 'Privacy Policy',
      slug: { current: 'privacy-policy' },
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'At RelaxPro, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information when you visit our website or make a purchase.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Information We Collect: We collect information you provide directly, such as your name, phone number, email address, shipping address, and payment details when you place an order or fill out our contact forms.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'How We Use Your Information: We use your information to process orders, provide customer support, improve our products and services, and send occasional promotional communications (only with your consent).',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Data Protection: We implement industry-standard security measures to protect your personal information. We never sell or share your data with third parties for their marketing purposes.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Contact Us: For any privacy-related questions, contact us at relaxpro2022@gmail.com or +91 86866 24494.',
            },
          ],
        },
      ],
      seo: {
        metaTitle: 'Privacy Policy | RelaxPro Mattresses',
        metaDescription:
          'Read the RelaxPro privacy policy to understand how we collect, use, and protect your personal information.',
      },
    },
    {
      _id: 'policy-terms',
      title: 'Terms & Conditions',
      slug: { current: 'terms-and-conditions' },
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'By using the RelaxPro website and purchasing our products, you agree to the following terms and conditions. Please read them carefully.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Orders: All orders are subject to availability and confirmation of the order price. We reserve the right to cancel any order if the product is not available or if there was an error in pricing.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Pricing: All prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to change prices without prior notice. Promotional offers cannot be combined with other discounts.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Shipping: We ship across India. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by external factors such as weather, strikes, or carrier delays.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Returns: Our 100-night trial applies to all mattress purchases. Contact us within the trial period to initiate a return. The mattress must be in good condition. Refunds are processed within 7 business days after we receive the returned mattress.',
            },
          ],
        },
      ],
      seo: {
        metaTitle: 'Terms & Conditions | RelaxPro Mattresses',
        metaDescription:
          'View the terms and conditions for purchasing RelaxPro mattresses, including shipping, returns, and warranty policies.',
      },
    },
    {
      _id: 'policy-warranty',
      title: '10-Year Warranty',
      slug: { current: 'warranty' },
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'RelaxPro stands behind the quality of our mattresses with a comprehensive 10-year factory replacement warranty. This warranty covers manufacturing defects in materials and workmanship.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'What is Covered: (1) Manufacturing defects in the latex core, including splitting or delamination, (2) Defects in the quilted fabric cover, (3) Sagging greater than 1 inch that is not caused by improper foundation support, (4) Faulty zipper or seam construction.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'What is Not Covered: Normal wear and tear, mattress softening (natural characteristic of latex), damage from improper use or foundation, stains or soiling, comfort preference (covered under 100-night trial instead).',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'How to Claim: Contact us on WhatsApp at +91 86866 24494 with your order number and photos of the defect. We will arrange inspection and replacement if needed. No paperwork hassles — we believe in straightforward service.',
            },
          ],
        },
      ],
      seo: {
        metaTitle: '10-Year Warranty | RelaxPro Mattresses',
        metaDescription:
          'Learn about the RelaxPro 10-year factory replacement warranty. Coverage details, what is included, and how to make a claim.',
      },
    },
  ]

  return pages
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 9 — SLEEP STYLES
// ═════════════════════════════════════════════════════════════════════════════

function seedSleepStyles() {
  console.log('\n═══════ SLEEP STYLES ═══════')

  const styles = [
    {
      _id: 'sleep-style-side',
      title: 'Side Sleeper',
      slug: { current: 'side-sleeper' },
      description:
        'If you sleep on your side, you need a mattress that relieves pressure on your shoulders and hips while keeping your spine aligned. Our medium-soft to medium comfort levels with natural latex provide the perfect balance.',
      linkText: 'Shop Side Sleeper Mattresses',
      image: null,
      order: 1,
    },
    {
      _id: 'sleep-style-back',
      title: 'Back Sleeper',
      slug: { current: 'back-sleeper' },
      description:
        'Back sleepers need even support across the entire body with gentle lumbar contouring. Our medium to medium-firm latex mattresses excel at maintaining proper spinal alignment for back sleepers.',
      linkText: 'Shop Back Sleeper Mattresses',
      image: null,
      order: 2,
    },
    {
      _id: 'sleep-style-stomach',
      title: 'Stomach Sleeper',
      slug: { current: 'stomach-sleeper' },
      description:
        'Stomach sleeping requires a firmer surface to prevent the hips from sinking and causing lower back strain. Our firm to medium-firm models with rebonded support cores are ideal.',
      linkText: 'Shop Stomach Sleeper Mattresses',
      image: null,
      order: 3,
    },
    {
      _id: 'sleep-style-combination',
      title: 'Combination Sleeper',
      slug: { current: 'combination-sleeper' },
      description:
        'If you change positions during the night, you need a responsive mattress that adapts quickly. Natural latex is the most responsive mattress material — it springs back instantly as you move.',
      linkText: 'Shop Combination Sleeper Mattresses',
      image: null,
      order: 4,
    },
    {
      _id: 'sleep-style-orthopedic',
      title: 'Orthopedic Support',
      slug: { current: 'orthopedic-support' },
      description:
        'For those with chronic back pain or joint issues, our orthopedic models with rebonded foam bases and latex comfort layers provide the firm support needed for proper spinal alignment and recovery.',
      linkText: 'Shop Orthopedic Mattresses',
      image: null,
      order: 5,
    },
    {
      _id: 'sleep-style-luxury',
      title: 'Luxury Pure Latex',
      slug: { current: 'luxury-pure-latex' },
      description:
        'Experience the ultimate in natural sleep with our luxury collection — 100% pure GOLS-certified organic latex from Kerala. Zero synthetic materials, just pure nature for the most discerning sleepers.',
      linkText: 'Shop Luxury Collection',
      image: null,
      order: 6,
    },
  ]

  return styles
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 10 — CERTIFICATIONS
// ═════════════════════════════════════════════════════════════════════════════

async function seedCertifications() {
  console.log('\n═══════ CERTIFICATIONS ═══════')

  const certs = [
    {
      _id: 'cert-gols',
      title: 'GOLS Certified Organic',
      slug: { current: 'gols' },
      subtitle: 'Global Organic Latex Standard',
      description:
        'Our organic latex components are certified under the Global Organic Latex Standard (GOLS), ensuring sustainable farming, fair labor practices, and zero synthetic additives in the latex production chain.',
      logoImage: await img('cert-gols-logo.png', 'GOLS Logo'),
      certificateImage: await img('cert-gols.png', 'GOLS Certificate'),
      pdfUrl: 'https://drive.google.com/file/d/example-gols/view',
      pdfEmbedUrl:
        'https://drive.google.com/file/d/example-gols/preview',
      subtitle: 'Global Organic Latex Standard',
      validity: 'Valid — Audited Annually',
      order: 1,
      isActive: true,
    },
    {
      _id: 'cert-oeko-tex',
      title: 'OEKO-TEX Standard 100',
      slug: { current: 'oeko-tex' },
      subtitle: 'Confidence in Textiles',
      description:
        'All our mattress fabrics are OEKO-TEX Standard 100 certified, meaning they are free from harmful chemicals and safe for human health. This certification covers every thread and button used in our mattresses.',
      logoImage: await img('cert-oeko-logo.png', 'OEKO-TEX Logo'),
      certificateImage: await img(
        'cert-oeko-tex.png',
        'OEKO-TEX Certificate'
      ),
      pdfUrl: 'https://drive.google.com/file/d/example-oeko/view',
      pdfEmbedUrl:
        'https://drive.google.com/file/d/example-oeko/preview',
      validity: 'Valid — Tested Annually',
      order: 2,
      isActive: true,
    },
    {
      _id: 'cert-iso',
      title: 'ISO 9001:2015 Certified',
      slug: { current: 'iso-9001' },
      subtitle: 'Quality Management System',
      description:
        'Our manufacturing facility is ISO 9001:2015 certified, demonstrating our commitment to consistent quality, continuous improvement, and customer satisfaction in every mattress we produce.',
      logoImage: await img('cert-iso-logo.png', 'ISO Logo'),
      certificateImage: await img('cert-iso.png', 'ISO Certificate'),
      pdfUrl: 'https://drive.google.com/file/d/example-iso/view',
      pdfEmbedUrl:
        'https://drive.google.com/file/d/example-iso/preview',
      validity: 'Valid — Recertified Annually',
      order: 3,
      isActive: true,
    },
    {
      _id: 'cert-fsc',
      title: 'FSC Certified',
      slug: { current: 'fsc' },
      subtitle: 'Forest Stewardship Council',
      description:
        'Where wood products are used in our manufacturing and packaging, we source FSC-certified materials to ensure responsible forestry practices. We are committed to minimizing our environmental impact.',
      logoImage: null,
      certificateImage: null,
      validity: 'Valid',
      order: 4,
      isActive: true,
    },
    {
      _id: 'cert-eco-institut',
      title: 'ECO-Institut Verified',
      slug: { current: 'eco-institut' },
      subtitle: 'Environmental Compatibility',
      description:
        'Our eco-rebonded latex components have been tested and verified by ECO-Institut for environmental compatibility, confirming minimal ecological impact in both production and disposal phases.',
      logoImage: null,
      certificateImage: null,
      validity: 'Valid',
      order: 5,
      isActive: true,
    },
  ]

  for (const c of certs) await upsert('certification', c)
}

function seedCertificationSettings() {
  console.log('\n═══════ CERTIFICATION SETTINGS ═══════')

  return {
    _id: 'certificationSettings',
    sectionTitle: 'Trusted by International Quality Standards',
    sectionBadge: 'Certified Quality',
    sectionDescription:
      'Every RelaxPro mattress is backed by rigorous international certifications that guarantee purity, safety, and environmental responsibility.',
    buttonText: 'View All Certificates',
    backgroundColor: '#FAF8F5',
    isEnabled: true,
    certifications: [
      { _type: 'reference', _ref: 'cert-gols' },
      { _type: 'reference', _ref: 'cert-oeko-tex' },
      { _type: 'reference', _ref: 'cert-iso' },
      { _type: 'reference', _ref: 'cert-fsc' },
      { _type: 'reference', _ref: 'cert-eco-institut' },
    ],
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 11 — BUILDER DATA
// ═════════════════════════════════════════════════════════════════════════════

async function seedBuilderMaterials() {
  console.log('\n═══════ BUILDER MATERIALS ═══════')

  const materials = [
    {
      _id: 'mat-pure-latex-2',
      name: 'Pure Natural Latex (Soft)',
      slug: { current: 'pure-natural-latex-soft' },
      slot: 'comfort',
      brand: 'RelaxPro Kerala Organic',
      density: '80 Density',
      ild: 'ILD-22',
      feelTag: 'Soft, hugging feel',
      benefit:
        'GOLS certified pure latex with a soft, plush feel. Ideal for pressure relief and side sleepers.',
      tooltip:
        '80 Density Pure Dunlop Latex. ILD 22. GOLS certified organic. Very responsive — zero sinking feeling.',
      thicknessOptions: [
        { _key: 't1', inches: 2, addPrice: 2000 },
        { _key: 't2', inches: 3, addPrice: 3000 },
        { _key: 't3', inches: 4, addPrice: 4000 },
      ],
      stackColor: '#E8D5B7',
      image: null,
      isRecommended: false,
      order: 1,
      isActive: true,
    },
    {
      _id: 'mat-pure-latex-4',
      name: 'Pure Natural Latex (Medium)',
      slug: { current: 'pure-natural-latex-medium' },
      slot: 'comfort',
      brand: 'RelaxPro Kerala Organic',
      density: '90 Density',
      ild: 'ILD-28',
      feelTag: 'Balanced, responsive comfort',
      benefit:
        'Our most popular comfort layer. GOLS certified 90 density latex offering the perfect balance of contouring and support.',
      tooltip:
        '90 Density Pure Dunlop Latex. ILD 28. GOLS certified. Open-cell structure for cooling. 96.6% purity.',
      thicknessOptions: [
        { _key: 't1', inches: 2, addPrice: 2500 },
        { _key: 't2', inches: 3, addPrice: 3750 },
        { _key: 't3', inches: 4, addPrice: 5000 },
      ],
      stackColor: '#BFE3C0',
      image: null,
      isRecommended: true,
      order: 2,
      isActive: true,
    },
    {
      _id: 'mat-pure-latex-6',
      name: 'Pure Natural Latex (Firm)',
      slug: { current: 'pure-natural-latex-firm' },
      slot: 'comfort',
      brand: 'RelaxPro Kerala Organic',
      density: '95 Density',
      ild: 'ILD-36',
      feelTag: 'Firm, supportive feel',
      benefit:
        'High density GOLS certified latex for those who prefer a firmer surface with natural bounce.',
      tooltip:
        '95 Density Pure Dunlop Latex. ILD 36. GOLS certified. Maximum support from pure latex. Excellent for back sleepers.',
      thicknessOptions: [
        { _key: 't1', inches: 2, addPrice: 3000 },
        { _key: 't2', inches: 3, addPrice: 4500 },
        { _key: 't3', inches: 4, addPrice: 6000 },
      ],
      stackColor: '#C9B99A',
      image: null,
      isRecommended: false,
      order: 3,
      isActive: true,
    },
    {
      _id: 'mat-rebonded-firm',
      name: 'Rebonded Foam (Firm Support)',
      slug: { current: 'rebonded-foam' },
      slot: 'support',
      brand: 'Century Foam',
      density: '90-95 Density',
      ild: 'ILD-45',
      feelTag: 'Rigid, orthopedic support',
      benefit:
        'High density rebonded foam for maximum structural support. Ideal for the base layer of your mattress.',
      tooltip:
        'Century brand rebonded foam. 90-95 Density. ILD 45. Zero sagging guarantee. 10+ year lifespan.',
      thicknessOptions: [
        { _key: 't1', inches: 2, addPrice: 1500 },
        { _key: 't2', inches: 3, addPrice: 2250 },
        { _key: 't3', inches: 4, addPrice: 3000 },
        { _key: 't4', inches: 5, addPrice: 3750 },
        { _key: 't5', inches: 6, addPrice: 4500 },
      ],
      stackColor: '#D4C5A9',
      image: null,
      isRecommended: true,
      order: 4,
      isActive: true,
    },
    {
      _id: 'mat-hr-softy',
      name: 'HR Softy Foam (Cushioning)',
      slug: { current: 'hr-softy-foam' },
      slot: 'support',
      brand: 'Century AirFlow',
      density: '40-50 Density',
      ild: 'ILD-18',
      feelTag: 'Soft, plush transition layer',
      benefit:
        'High resilience softy foam that provides a gentle transition between firm support and latex comfort layers.',
      tooltip:
        'Century HR Softy Foam. 40-50 Density. ILD 18. High resilience — bounces back instantly. Great for pressure relief.',
      thicknessOptions: [
        { _key: 't1', inches: 1, addPrice: 800 },
        { _key: 't2', inches: 2, addPrice: 1600 },
      ],
      stackColor: '#F0E6D3',
      image: null,
      isRecommended: false,
      order: 5,
      isActive: true,
    },
    {
      _id: 'mat-latex-rebonded',
      name: 'Latex Rebonded Core (Eco)',
      slug: { current: 'latex-rebonded-core' },
      slot: 'support',
      brand: 'RelaxPro Eco Core',
      density: '120 Density',
      ild: 'ILD-40',
      feelTag: 'Dense, eco-friendly support',
      benefit:
        'Made from upcycled organic latex shreds compressed into a high-density core. Eco-friendly without compromising on support.',
      tooltip:
        '120 Density Latex Rebonded. ILD 40. Made from upcycled GOLS latex shreds. Eco-Institut certified. Zero waste manufacturing.',
      thicknessOptions: [
        { _key: 't1', inches: 2, addPrice: 2500 },
        { _key: 't2', inches: 3, addPrice: 3750 },
        { _key: 't3', inches: 4, addPrice: 5000 },
      ],
      stackColor: '#A8C8A8',
      image: null,
      isRecommended: false,
      order: 6,
      isActive: true,
    },
  ]

  for (const m of materials) await upsert('builderMaterial', m)
}

async function seedBuilderFabrics() {
  console.log('\n═══════ BUILDER FABRICS ═══════')

  const fabrics = [
    {
      _id: 'fabric-300gsm',
      name: '300 GSM Quilted Fabric (Standard)',
      slug: { current: 'fabric-300gsm' },
      role: 'primaryCover',
      gsm: '300 GSM',
      quiltingMm: '8mm',
      benefit:
        'Standard quilted fabric with OEKO-TEX certification. Breathable and durable for everyday use.',
      addPrice: 0,
      image: null,
      isRecommended: true,
      order: 1,
      isActive: true,
    },
    {
      _id: 'fabric-450gsm',
      name: '450 GSM Premium Quilted Fabric',
      slug: { current: 'fabric-450gsm' },
      role: 'primaryCover',
      gsm: '450 GSM',
      quiltingMm: '12mm',
      benefit:
        'Premium thick quilted fabric with OEKO-TEX certification. Plusher feel, superior durability, and elegant appearance.',
      addPrice: 2000,
      image: null,
      isRecommended: false,
      order: 2,
      isActive: true,
    },
    {
      _id: 'quilting-8mm',
      name: '8mm Standard Quilting (Upgrade)',
      slug: { current: 'quilting-8mm' },
      role: 'quiltingUpgrade',
      gsm: 'N/A',
      quiltingMm: '8mm',
      benefit:
        'Standard 8mm quilting pattern for a classic mattress appearance.',
      addPrice: 0,
      image: null,
      isRecommended: true,
      order: 3,
      isActive: true,
    },
    {
      _id: 'quilting-12mm',
      name: '12mm Deep Quilting (Premium)',
      slug: { current: 'quilting-12mm' },
      role: 'quiltingUpgrade',
      gsm: 'N/A',
      quiltingMm: '12mm',
      benefit:
        'Deep 12mm quilting for a luxurious pillow-top feel with enhanced pressure relief.',
      addPrice: 1500,
      image: null,
      isRecommended: false,
      order: 4,
      isActive: true,
    },
  ]

  for (const f of fabrics) await upsert('builderFabric', f)
}

function seedBuilderConfig() {
  console.log('\n═══════ BUILDER CONFIG ═══════')

  return {
    _id: 'customBuilder',
    header: {
      title: 'Build Your Own Mattress',
      subtitle:
        'Choose your size, comfort layer, support core, and cover fabric. Our team will handcraft it and deliver it to your doorstep.',
      trustChips: ['Free Delivery', '10-Year Warranty', '100-Night Trial', 'Handcrafted in Hyderabad'],
    },
    sizes: [
      {
        _key: 'sz0',
        name: 'Single',
        lengthInches: 78,
        widthInches: 36,
        basePrice: 6500,
        popular: false,
      },
      {
        _key: 'sz1',
        name: 'Double',
        lengthInches: 78,
        widthInches: 48,
        basePrice: 8500,
        popular: false,
      },
      {
        _key: 'sz2',
        name: 'Queen',
        lengthInches: 78,
        widthInches: 60,
        basePrice: 11000,
        popular: true,
      },
      {
        _key: 'sz3',
        name: 'King',
        lengthInches: 78,
        widthInches: 72,
        basePrice: 13000,
        popular: true,
      },
      {
        _key: 'sz4',
        name: 'Diwan',
        lengthInches: 75,
        widthInches: 48,
        basePrice: 9500,
        popular: false,
      },
    ],
    customSize: {
      enabled: true,
      unit: 'inches',
      minLength: 40,
      maxLength: 84,
      minWidth: 20,
      maxWidth: 78,
      pricePerSqInch: 187.5,
      cutCharge: 1000,
      helper: 'Need a unique size? Enter your custom dimensions below.',
    },
    steps: {
      sizeTitle: 'Choose Your Size',
      sizeHelper: 'Pick a standard size or enter custom dimensions',
      comfortTitle: 'Choose Comfort Layer',
      comfortHelper: 'This top layer determines the feel of your mattress',
      supportTitle: 'Choose Support Core',
      supportHelper: 'The base layer provides structural support and durability',
      coverTitle: 'Pick Your Cover',
      coverHelper: 'Choose fabric GSM and quilting depth',
    },
    summaryPanel: {
      heading: 'Your Mattress',
      emptySlotText: 'Tap a step to choose',
      emiNote: 'EMI starting at ₹{emi}/month',
      perks: [
        'Free delivery across South India',
        '10-year replacement warranty',
        '100-night sleep trial',
        'Handcrafted in Hyderabad',
      ],
    },
    ctas: {
      primaryLabel: 'Add to Cart',
      secondaryLabel: 'Book a Free Consultation',
      disabledHint: 'Complete all steps to add to cart',
    },
    defaults: {
      sizeName: 'Queen',
      comfortMaterialSlug: 'pure-natural-latex-medium',
      comfortThickness: 2,
      supportMaterialSlug: 'rebonded-foam',
      supportThickness: 4,
      coverFabricSlug: 'fabric-300gsm',
      quiltingSlug: 'quilting-8mm',
    },
    seo: {
      metaTitle:
        'Custom Mattress Builder — Design Your Perfect Sleep | RelaxPro',
      metaDescription:
        'Personalize your GOLS natural latex mattress layer-by-layer. Choose GOTS bamboo cover, composite layers, custom size.',
    },
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 12 — NAVIGATION
// ═════════════════════════════════════════════════════════════════════════════

function seedNavigation() {
  console.log('\n═══════ NAVIGATION ═══════')

  return {
    _id: 'navigation',
    title: 'Main Navigation',
    desktopMenu: [
      { label: 'Home', path: '/', icon: null, isCta: false, children: [] },
      {
        label: 'Shop',
        path: '/catalog',
        icon: null,
        isCta: false,
        children: [
          {
            label: 'Explore Collections',
            path: '/catalog',
            description: 'Browse all mattress models',
          },
          {
            label: 'Compare Models',
            path: '/compare',
            description: 'Side-by-side comparison of all models',
          },
        ],
      },
      {
        label: 'Customize',
        path: '/builder',
        icon: null,
        isCta: false,
        children: [],
      },
      {
        label: 'Compare',
        path: '/compare',
        icon: null,
        isCta: false,
        children: [],
      },
      {
        label: 'Sleep Science',
        path: '/science',
        icon: null,
        isCta: false,
        children: [],
      },
      {
        label: 'About',
        path: '/about',
        icon: null,
        isCta: false,
        children: [],
      },
      {
        label: 'Contact',
        path: '/contact',
        icon: null,
        isCta: false,
        children: [],
      },
    ],
    mobileMenu: [
      { label: 'Home', path: '/' },
      { label: 'Shop All', path: '/catalog' },
      { label: 'Customize Your Mattress', path: '/builder' },
      { label: 'Compare Models', path: '/compare' },
      { label: 'Sleep Science', path: '/science' },
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
    ],
    footerMenu: [
      {
        heading: 'Quick Links',
        links: [
          { label: 'Home', path: '/' },
          { label: 'Shop All', path: '/catalog' },
          { label: 'Customize', path: '/builder' },
          { label: 'Sleep Science', path: '/science' },
          { label: 'About Us', path: '/about' },
        ],
      },
      {
        heading: 'Customer Care',
        links: [
          { label: 'Contact Us', path: '/contact' },
          { label: 'Store Locations', path: '/locations' },
          { label: 'Sleep Education', path: '/science' },
          { label: 'FAQs', path: '/#faq' },
        ],
      },
      {
        heading: 'Policies',
        links: [
          { label: 'Privacy Policy', path: '/privacy-policy' },
          { label: 'Terms & Conditions', path: '/terms-and-conditions' },
          { label: 'Warranty', path: '/warranty' },
          { label: 'Return Policy', path: '/terms-and-conditions' },
        ],
      },
    ],
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 13 — HERO
// ═════════════════════════════════════════════════════════════════════════════

async function seedHero() {
  console.log('\n═══════ HERO ═══════')

  return {
    _id: 'hero',
    title: 'Homepage Hero',
    slides: [
      {
        _key: 'slide0',
        image: await img('hero-bedroom.png', 'RelaxPro Bedroom'),
        badge: 'Handcrafted Dunlop Latex Since 2015',
        heading: 'Pure Natural Latex,',
        highlight: 'From Kerala',
        subheading: 'to Your Bed',
        description:
          'GOLS-certified organic latex, zero synthetic fillers or cancer-causing VOCs. Handcrafted in Hyderabad and shipped directly to your doorstep.',
        primaryCta: {
          label: 'Explore the Collection',
          link: '/catalog',
          variant: 'primary',
          openInNewTab: false,
        },
        secondaryCta: {
          label: 'Book a Showroom Visit',
          link: '/contact',
          variant: 'secondary',
          openInNewTab: false,
        },
        trustBadges: [
          { text: 'Free Delivery', icon: 'Truck' },
          { text: 'GOLS Certified Organic', icon: 'Shield' },
          { text: 'Factory Direct', icon: 'BadgeCheck' },
        ],
      },
    ],
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 14 — SITE SETTINGS
// ═════════════════════════════════════════════════════════════════════════════

async function seedSiteSettings() {
  console.log('\n═══════ SITE SETTINGS ═══════')

  return {
    _id: 'siteSettings',
    branding: {
      siteName: 'RelaxPro Premium Mattresses',
      tagline: '100% Natural Organic Latex Mattresses — Direct from Kerala Factory',
      logo: null,
      favicon: null,
    },
    navigation: {
      mainMenu: [
        { label: 'Home', link: '/', path: '/', openInNewTab: false },
        { label: 'Shop', link: '/catalog', path: '/catalog', openInNewTab: false },
        { label: 'Customize', link: '/builder', path: '/builder', openInNewTab: false },
        { label: 'Compare', link: '/compare', path: '/compare', openInNewTab: false },
        { label: 'Sleep Science', link: '/science', path: '/science', openInNewTab: false },
        { label: 'About', link: '/about', path: '/about', openInNewTab: false },
        { label: 'Contact', link: '/contact', path: '/contact', openInNewTab: false },
      ],
      footerMenu: [
        { label: 'Home', link: '/', openInNewTab: false },
        { label: 'Shop All', link: '/catalog', openInNewTab: false },
        { label: 'Customize', link: '/builder', openInNewTab: false },
        { label: 'Sleep Science', link: '/science', openInNewTab: false },
        { label: 'About Us', link: '/about', openInNewTab: false },
        { label: 'Contact Us', link: '/contact', openInNewTab: false },
        { label: 'Store Locations', link: '/locations', openInNewTab: false },
      ],
      ctaButton: { label: 'Shop Now', link: '/catalog', variant: 'primary', openInNewTab: false },
      phoneNumber: '+91 86866 24494',
    },
    footer: {
      description:
        'Leading natural latex mattress manufacturer in Andhra Pradesh and Telangana. Handcrafted from 100% GOLS certified Dunlop rubber latex sourced directly from Kerala. Factory-direct pricing with zero middlemen.',
      socialLinks: [
        { platform: 'Facebook', url: 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/' },
        { platform: 'Instagram', url: 'https://www.instagram.com/relaxpro__mattresses/?hl=en' },
        { platform: 'YouTube', url: 'https://www.youtube.com/@sureshmattressmanufacturer3784' },
      ],
      trustBadges: [
        { icon: 'Shield', text: '100% Natural Latex' },
        { icon: 'Award', text: 'GOLS Certified' },
        { icon: 'CheckCircle', text: 'OEKO-TEX Certified' },
        { icon: 'RefreshCcw', text: 'Factory Direct' },
        { icon: 'Truck', text: 'Free Delivery' },
        { icon: 'Heart', text: 'Handmade in India' },
      ],
      certifications: [
        { name: 'GOLS Certified Organic', image: null },
        { name: 'Oeko-Tex Standard 100', image: null },
        { name: 'FSC Certified', image: null },
        { name: 'ISO 9001:2015', image: null },
        { name: 'ECO-Institut Verified', image: null },
      ],
      copyrightText: '© 2026 RelaxPro — Premium Natural Latex Mattresses. All rights reserved.',
    },
    contactInfo: {
      mainPhone: '8686624494',
      secondaryPhone: '9642024494',
      whatsappNumber: '918686624494',
      whatsappDefaultMessage:
        'Hello Suresh, I am visiting the RelaxPro Mattress website and would like a specialized orthopedic mattress advice. Please guide me!',
      email: 'relaxpro2022@gmail.com',
      factoryAddress:
        'RelaxPro Factory, Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana - 500055',
      googleMapsUrl: '',
      googleMapsLink: '',
    },
    businessHours: {
      monday: '10:00 AM - 9:00 PM',
      tuesday: '10:00 AM - 9:00 PM',
      wednesday: '10:00 AM - 9:00 PM',
      thursday: '10:00 AM - 9:00 PM',
      friday: '10:00 AM - 9:00 PM',
      saturday: '10:00 AM - 9:00 PM',
      sunday: '10:00 AM - 9:00 PM',
    },
    announcement: {
      showBanner: true,
      bannerText:
        "Telangana & AP's 1st Pure Latex Mattress Company • GOLS Certified Organic Latex • Direct Factory Pricing",
      bannerLink: '/catalog',
      bannerColor: 'green',
    },
    staticImages: {
      gotsCotton: await img('gots-cotton.png', 'GOTS Organic Cotton'),
      quiltedCotton: await img('quilted-cotton.png', 'Quilted Organic Cotton'),
      naturalLatex: await img('natural-latex.png', '100% Natural Latex'),
      comfortMeter: await img('comfort-meter.png', 'Comfort Meter Chart'),
      sizeChart: await img('size-chart.png', 'Size Chart'),
      technicalSpecifications: await img(
        'technical-specifications.png',
        'Technical Specifications'
      ),
      vilasaBenefits: await img('vilasa-benefits.png', 'Vilasa Benefits'),
      heroBedroom: await img('hero-bedroom.png', 'Hero Bedroom'),
    },
    seo: {
      metaTitle:
        'RelaxPro | Premium Natural Latex Mattresses — Factory Direct',
      metaDescription:
        'Shop GOLS-certified natural latex mattresses crafted in Kerala. 13 models from ₹6,500 with free delivery across South India. 10-year warranty. Handcrafted Dunlop latex since 2015.',
      ogImage: null,
      keywords: [
        'natural latex mattress',
        'GOLS certified',
        'organic mattress India',
        'latex mattress Hyderabad',
        'RelaxPro',
        'Dunlop latex',
        'Kerala latex',
      ],
    },
    analytics: {
      gaTrackingId: '',
      metaPixelId: '',
      gtmId: '',
    },
    leadPopup: {
      enabled: true,
      heading: 'Get Exclusive Offers',
      description:
        'Get personalized mattress recommendations and exclusive pricing directly from our sleep experts.',
      badgeText: '🎁 Limited-Time Offer',
      ctaLabel: 'Get My Offer',
      successHeading: '✅ Thank You!',
      successDescription:
        'Our sleep expert will contact you shortly with exclusive offers.',
      trustTexts: ['No Spam', 'Expert Assistance', 'Exclusive Deals'],
      disclaimer:
        'By submitting this form you agree to be contacted via call, WhatsApp or email.',
      dontShowAgainText: "Don't show this again",
      showLogo: true,
      initialDelay: 2,
      cooldownSeconds: 12,
      scrollPercent: 40,
      submittingText: 'Submitting...',
    },
    certificates: [
      {
        _key: 'cert-iso-key',
        id: 'iso',
        title: 'ISO 9001:2015',
        subtitle: 'Quality Management',
        description:
          'Our manufacturing facility is ISO 9001:2015 certified, ensuring consistent quality and continuous improvement in every mattress.',
        pdfUrl: 'https://drive.google.com/file/d/example-iso/view',
        pdfEmbedUrl:
          'https://drive.google.com/file/d/example-iso/preview',
        validity: 'Valid — Recertified Annually',
      },
      {
        _key: 'cert-oeko-key',
        id: 'oeko',
        title: 'OEKO-TEX Standard 100',
        subtitle: 'Confidence in Textiles',
        description:
          'All fabrics used in RelaxPro mattresses are OEKO-TEX Standard 100 certified, guaranteeing they are free from harmful substances.',
        pdfUrl: 'https://drive.google.com/file/d/example-oeko/view',
        pdfEmbedUrl:
          'https://drive.google.com/file/d/example-oeko/preview',
        validity: 'Valid — Tested Annually',
      },
      {
        _key: 'cert-gols-site',
        id: 'gols',
        title: 'GOLS Certified Organic',
        subtitle: 'Global Organic Latex Standard',
        description:
          'Our natural latex components are GOLS certified, ensuring organic farming practices and zero synthetic additives.',
        pdfUrl: 'https://drive.google.com/file/d/example-gols/view',
        pdfEmbedUrl:
          'https://drive.google.com/file/d/example-gols/preview',
        validity: 'Valid — Audited Annually',
      },
    ],
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 15 — HOMEPAGE (COMPLETE — all 18+ sections)
// ═════════════════════════════════════════════════════════════════════════════

async function seedHomepage() {
  console.log('\n═══════ HOMEPAGE ═══════')

  return {
    _id: 'home',
    featuresGrid: [
      {
        _key: 'fg0',
        icon: 'shield',
        title: '100-Night Sleep Trial',
        description:
          'Try it risk-free. Return for free if not in love with your new mattress. No restocking fees, no questions asked.',
      },
      {
        _key: 'fg1',
        icon: 'truck',
        title: 'Free White-Glove Delivery',
        description:
          'We deliver and set up in your bedroom across South India. No extra cost, no hassle — just pure convenience.',
      },
      {
        _key: 'fg2',
        icon: 'award',
        title: '10-Year Warranty',
        description:
          'Built to last a decade, guaranteed. Direct factory replacement policy — no paperwork, no delays.',
      },
      {
        _key: 'fg3',
        icon: 'leaf',
        title: 'GOLS Certified Organic',
        description:
          '100% natural Dunlop latex from certified organic Kerala plantations. Zero synthetic fillers or cancer-causing VOCs.',
      },
    ],
    ownershipWays: {
      sectionTitle: 'Two Ways to Own a RelaxPro',
      sectionSubtitle:
        'Direct from our factory or custom-built to your exact specifications',
      customBuilder: {
        title: 'Build Your Own Mattress',
        description:
          'Choose your exact size, thickness, and layer configuration — we manufacture it to order. Get a WhatsApp quote in minutes with our guided builder.',
        features: [
          'Pick Cover Fabric: 300 GSM or 450 GSM',
          'Comfort Layers: Choose latex density',
          'Dial in Thickness: 4" to 10" profiles',
          'Custom Built: Delivered in 7–10 days',
        ],
        cta: {
          label: 'Start Building',
          link: '/builder',
          variant: 'primary',
        },
        image: await img('box-customize.png', 'Custom Builder Box'),
      },
      shopPrebuilt: {
        title: 'Shop Pre-Built Mattresses',
        description:
          'Explore our curated collection of 13 handcrafted latex and hybrid mattresses — from value entry to 10" luxury pure latex, each backed by a 10-year warranty.',
        features: [
          '13 Organic Models: Orthopedic alignment',
          '3 Curated Tiers: Luxury, Premium & Comfort',
          'Pick Your Size: Standard or Custom',
          'Express Shipping: Delivered in 5–7 Days',
        ],
        cta: {
          label: 'Browse Catalog',
          link: '/catalog',
          variant: 'primary',
        },
        image: await img('box-models.png', 'Shop Prebuilt Models'),
      },
    },
    shopByBrands: {
      sectionTitle: 'Shop by Category',
      sectionSubtitle:
        'Find your perfect comfort from three expertly crafted collections',
      categories: [
        { _type: 'reference', _ref: 'cat-luxury' },
        { _type: 'reference', _ref: 'cat-premium' },
        { _type: 'reference', _ref: 'cat-comfort' },
      ],
    },
    bestsellersSection: {
      sectionTitle: 'Best Selling Models',
      sectionSubtitle: 'Our most-loved models chosen by families across South India',
      products: [
        { _type: 'reference', _ref: 'product-nirvana' },
        { _type: 'reference', _ref: 'product-amrita' },
        { _type: 'reference', _ref: 'product-somya' },
        { _type: 'reference', _ref: 'product-arogya' },
        { _type: 'reference', _ref: 'product-sthira' },
        { _type: 'reference', _ref: 'product-sunidra' },
      ],
      viewAllCta: {
        label: 'View All Products',
        link: '/catalog',
        variant: 'secondary',
      },
    },
    costComparison: {
      sectionTitle: 'Is Buying Latex Mattress Really Expensive?',
      sectionSubtitle:
        'Natural latex is an investment — and here is why it pays for itself',
      naturalLatex: {
        label: 'Natural Latex (Double Bed)',
        avgPrice: '₹40,000',
        lifespan: '15 Years',
        perYearCost: '₹2,700/year',
        perDayCost: '₹7/day',
        highlighted: true,
      },
      ordinaryFoam: {
        label: 'Ordinary Foam (Double Bed)',
        avgPrice: '₹20,000',
        lifespan: '7 Years',
        perYearCost: '₹2,900/year',
        perDayCost: '₹8/day',
      },
      footnote:
        'While a 100% Natural Latex Mattress may seem more expensive upfront, it actually offers better long-term value than an Ordinary Foam Mattress',
    },
    showroomCtaBanner: {
      title: 'Visit Our Showroom',
      locationName: 'RelaxPro Factory Showroom, Hyderabad',
      address:
        'Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana - 500055',
      backgroundImage: await img('hero-banner.png', 'Showroom Banner'),
      cta: {
        label: 'Book a Visit',
        link: '/contact',
        variant: 'primary',
      },
    },
    whyChooseUs: {
      sectionTitle: 'Why Choose RelaxPro',
      sectionSubtitle:
        'Every mattress we craft combines generations of expertise with the finest natural materials.',
      benefits: [
        {
          _key: 'wcu0',
          icon: 'shield',
          title: '100-Night Sleep Trial',
          description:
            'Try it risk-free. Return for free if not in love with your new mattress.',
        },
        {
          _key: 'wcu1',
          icon: 'truck',
          title: 'Free White-Glove Delivery',
          description:
            'We deliver and set up in your bedroom. No extra cost, no hassle.',
        },
        {
          _key: 'wcu2',
          icon: 'award',
          title: '10-Year Warranty',
          description:
            'Built to last a decade, guaranteed. Direct factory replacement policy.',
        },
        {
          _key: 'wcu3',
          icon: 'leaf',
          title: 'Eco-Friendly Materials',
          description:
            'GOLS certified natural latex from Kerala. Zero VOCs, zero synthetic fillers.',
        },
        {
          _key: 'wcu4',
          icon: 'check',
          title: 'Factory Direct Pricing',
          description:
            'No middlemen, no showroom commissions. You pay only for the mattress.',
        },
      ],
    },
    testimonialsSection: {
      sectionTitle: 'What Our Customers Say',
      overallRating: '4.9',
      totalReviews: '2,400+',
      testimonials: [
        { _type: 'reference', _ref: 'testimonial-gm-1' },
        { _type: 'reference', _ref: 'testimonial-gm-2' },
        { _type: 'reference', _ref: 'testimonial-gm-3' },
        { _type: 'reference', _ref: 'testimonial-gm-4' },
        { _type: 'reference', _ref: 'testimonial-gm-5' },
        { _type: 'reference', _ref: 'testimonial-gm-6' },
      ],
    },
    allShowroomsSection: {
      sectionTitle: 'RelaxPro Mattress Partner to Showrooms',
      sectionDescription:
        'Experience the RelaxPro difference in person. Our sleep consultants are ready to help you find your perfect mattress.',
      showrooms: [
        { _type: 'reference', _ref: 'showroom-hyderabad' },
        { _type: 'reference', _ref: 'showroom-rajahmundry' },
        { _type: 'reference', _ref: 'showroom-bangalore' },
      ],
    },
    faqSection: {
      sectionTitle: 'Frequently Asked Questions',
      sectionDescription:
        'Everything you need to know about natural latex and our mattresses.',
      categories: [
        'Sleep Science',
        'Comfort & Feel',
        'Pricing & Sizes',
        'Materials & Care',
        'Health & Posture',
      ],
      faqs: [
        { _type: 'reference', _ref: 'faq-1' },
        { _type: 'reference', _ref: 'faq-2' },
        { _type: 'reference', _ref: 'faq-3' },
        { _type: 'reference', _ref: 'faq-4' },
        { _type: 'reference', _ref: 'faq-5' },
        { _type: 'reference', _ref: 'faq-6' },
        { _type: 'reference', _ref: 'faq-7' },
        { _type: 'reference', _ref: 'faq-8' },
        { _type: 'reference', _ref: 'faq-9' },
        { _type: 'reference', _ref: 'faq-10' },
        { _type: 'reference', _ref: 'faq-14' },
        { _type: 'reference', _ref: 'faq-17' },
      ],
    },
    comparisonSection: {
      sectionTitle: 'Why Choose RelaxPro?',
      sectionSubtitle: 'See how we compare to other mattress brands',
      items: [
        {
          _key: 'cmp0',
          relaxProTitle: 'Natural latex',
          icon: 'leaf',
          otherTitle: 'Memory foam / Synthetic foam',
          otherSubtext: 'Latex is often just a thin synthetic layer',
        },
        {
          _key: 'cmp1',
          relaxProTitle: 'GOLS certified',
          icon: 'award',
          otherTitle: 'None / false claims',
          otherSubtext: 'Many brands claim natural without certification',
        },
        {
          _key: 'cmp2',
          relaxProTitle: 'Tailored to your comfort',
          icon: 'sliders',
          otherTitle: 'Too firm / Too soft — sinks',
          otherSubtext: 'One-size-fits-all approach',
        },
        {
          _key: 'cmp3',
          relaxProTitle: 'Safe for all ages',
          icon: 'check',
          otherTitle: 'Releases VOCs',
          otherSubtext: 'Cancer causing gas emitted daily',
        },
        {
          _key: 'cmp4',
          relaxProTitle: 'Factory direct pricing',
          icon: 'shield',
          otherTitle: 'Retail markup 200-300%',
          otherSubtext: 'Showroom commissions and middlemen',
        },
      ],
    },
    sleepStyleGuide: {
      sectionTitle: 'Find Your Sleep Style',
      sectionSubtitle:
        'Not sure which mattress is right for you? Discover your sleep style and we will recommend the perfect match.',
      styles: [
        { _type: 'reference', _ref: 'sleep-style-side' },
        { _type: 'reference', _ref: 'sleep-style-back' },
        { _type: 'reference', _ref: 'sleep-style-stomach' },
        { _type: 'reference', _ref: 'sleep-style-combination' },
        { _type: 'reference', _ref: 'sleep-style-orthopedic' },
        { _type: 'reference', _ref: 'sleep-style-luxury' },
      ],
    },
    engineeredPosture: {
      sectionTitle: 'Engineered for Every Posture',
      categories: [
        {
          _key: 'ep0',
          title: 'Side Sleepers',
          subtitle: 'Pressure relief where you need it most',
          description:
            'Our medium-soft to medium latex comfort layers provide critical pressure relief at shoulders and hips while maintaining spinal alignment.',
          items: ['Nirvana', 'Amrita', 'Ananda', 'Prakriti', 'Somya'],
          linkText: 'Shop Side Sleeper Models',
          slug: '/catalog',
          image: await img('latex-compare.png', 'Side Sleeper'),
        },
        {
          _key: 'ep1',
          title: 'Back & Stomach Sleepers',
          subtitle: 'Firm support for proper alignment',
          description:
            'Our medium-firm to firm models with rebonded support cores provide the even surface needed to keep your spine in neutral alignment.',
          items: ['Arogya', 'Sthira', 'Bhumi', 'AyushRest'],
          linkText: 'Shop Back Sleeper Models',
          slug: '/catalog',
          image: await img('foam-compare.png', 'Back Sleeper'),
        },
        {
          _key: 'ep2',
          title: 'Orthopedic & Medical',
          subtitle: 'Doctor-recommended support systems',
          description:
            'Our orthopedic models combine high-density rebonded bases with pure latex comfort layers for the therapeutic support recommended by medical professionals.',
          items: ['Arogya', 'Sthira', 'Ojas', 'AyushRest'],
          linkText: 'Shop Orthopedic Models',
          slug: '/catalog',
          image: await img('mattress-hand.png', 'Orthopedic Support'),
        },
      ],
    },
    quickConnect: {
      items: [
        {
          _key: 'qc0',
          label: 'Call Us',
          icon: 'Phone',
          link: 'tel:+918686624494',
        },
        {
          _key: 'qc1',
          label: 'WhatsApp',
          icon: 'MessageSquare',
          link: 'https://wa.me/918686624494',
        },
        {
          _key: 'qc2',
          label: 'Visit Showroom',
          icon: 'MapPin',
          link: '/locations',
        },
        {
          _key: 'qc3',
          label: 'Email Us',
          icon: 'Mail',
          link: 'mailto:relaxpro2022@gmail.com',
        },
      ],
    },
    featuredComponents: {
      sectionTitle: 'What Inside Counts: Premium Components',
      components: [
        {
          _key: 'fc0',
          title: '100% Natural Dunlop Latex',
          description:
            'Our core material — GOLS-certified organic latex from Kerala. Open-cell structure for cooling, naturally hypoallergenic, and zero VOC emissions. Provides the perfect balance of contouring support and responsive bounce.',
          badge: 'GOLS Certified',
          image: await img('natural-latex.png', 'Natural Latex'),
        },
        {
          _key: 'fc1',
          title: 'GOTS Certified Organic Cotton',
          description:
            'Our quilted fabric covers use GOTS-certified organic cotton. Free from pesticides, herbicides, and synthetic fertilizers. Gentle on skin and the environment.',
          badge: 'GOTS Certified',
          image: await img('gots-cotton.png', 'Organic Cotton'),
        },
        {
          _key: 'fc2',
          title: 'OEKO-TEX Certified Fabric',
          description:
            'Every thread in our mattresses is OEKO-TEX Standard 100 certified — guaranteed free from harmful chemicals, safe for babies, elders, and everyone in between.',
          badge: 'OEKO-TEX Certified',
          image: await img('quilted-cotton.png', 'Quilted Cotton'),
        },
      ],
    },
    bookingForm: {
      title: 'Book a Showroom Visit',
      subtitle: 'Schedule your appointment at any of our 3 showroom locations',
      submitButtonText: 'Book My Visit',
      successMessage:
        'Thanks! We will confirm your appointment within 30 minutes.',
      fields: [
        {
          _key: 'bf0',
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          required: true,
        },
        {
          _key: 'bf1',
          name: 'phone',
          label: 'Phone Number',
          type: 'tel',
          required: true,
        },
        {
          _key: 'bf2',
          name: 'preferredDate',
          label: 'Preferred Visit Date',
          type: 'date',
          required: true,
        },
        {
          _key: 'bf3',
          name: 'showroom',
          label: 'Preferred Showroom',
          type: 'select',
          required: true,
          options: ['Hyderabad', 'Rajahmundry', 'Bangalore'],
        },
        {
          _key: 'bf4',
          name: 'message',
          label: 'Any specific concerns?',
          type: 'textarea',
          required: false,
        },
      ],
    },
    diagnosticForm: {
      title: 'Free Sleep Diagnostic Consultation',
      subtitle: 'Get personalized mattress recommendation from our sleep experts',
      submitButtonText: 'Submit & Get Free Callback',
      successMessage:
        'Suresh will personally review your concern and call you back within 2 hours.',
      fields: [
        {
          _key: 'df0',
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          required: true,
        },
        {
          _key: 'df1',
          name: 'phone',
          label: 'Phone Number',
          type: 'tel',
          required: true,
        },
        {
          _key: 'df2',
          name: 'sleepStyle',
          label: 'Sleep Position',
          type: 'select',
          required: true,
          options: [
            'Side Sleeper',
            'Back Sleeper',
            'Stomach Sleeper',
            'Combination',
          ],
        },
        {
          _key: 'df3',
          name: 'painAreas',
          label: 'Pain / Concerns',
          type: 'textarea',
          required: true,
        },
        {
          _key: 'df4',
          name: 'bodyWeight',
          label: 'Body Weight (approx.)',
          type: 'text',
          required: false,
        },
        {
          _key: 'df5',
          name: 'budget',
          label: 'Budget (INR)',
          type: 'select',
          required: false,
          options: [
            'Under ₹20,000',
            '₹20k–₹35k',
            '₹35k–₹50k',
            '₹50k+',
          ],
        },
      ],
    },
    seo: {
      metaTitle:
        'RelaxPro | Premium Natural Latex Mattresses — Factory Direct',
      metaDescription:
        'Shop GOLS-certified natural latex mattresses crafted in Kerala. 13 models from ₹6,500 with free delivery across South India. 10-year warranty. Handcrafted Dunlop latex since 2015.',
      ogImage: null,
      keywords: [
        'natural latex mattress',
        'GOLS certified',
        'organic mattress India',
        'latex mattress Hyderabad',
      ],
    },
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 16 — ABOUT PAGE
// ═════════════════════════════════════════════════════════════════════════════

function seedAbout() {
  console.log('\n═══════ ABOUT ═══════')

  return {
    _id: 'about',
    hero: {
      title: 'Our Story',
      subtitle:
        "Handcrafting Kerala's Finest Natural Latex Mattresses Since 2015",
    },
    ourStory: {
      heading: 'From Kerala Plantations to Your Bedroom',
      body: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'RelaxPro was born from a simple belief: that everyone deserves access to pure, chemical-free sleep. Founded by Suresh, a mattress manufacturer with deep roots in Kerala\'s natural rubber industry, our journey began in a small workshop in Hyderabad\'s Jeedimetla industrial area. Today, we are recognized as Telangana and Andhra Pradesh\'s first dedicated natural latex mattress company.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Unlike mass-produced mattresses that rely on synthetic foams and adhesives, every RelaxPro mattress is handcrafted using 100% natural Dunlop latex sourced directly from GOLS-certified organic plantations in Kerala. Our direct-to-consumer model means you get premium quality at factory prices — no middlemen, no markup.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'What started as a small operation serving Hyderabad has grown into a trusted brand across South India — with customers in Telangana, Andhra Pradesh, Karnataka, Tamil Nadu, and beyond. We have delivered over 7,000 mattresses and counting.',
            },
          ],
        },
      ],
    },
    ourProcess: {
      heading: 'How We Craft Your Mattress',
      steps: [
        {
          _key: 'ps0',
          title: 'Sap Harvesting',
          description:
            'Raw latex sap is tapped from certified organic rubber trees in Kerala under strict GOLS guidelines. Only the purest sap makes it into our mattresses.',
        },
        {
          _key: 'ps1',
          title: 'Dunlop Processing',
          description:
            'The sap is whipped into a froth and poured into molds. No synthetic fillers or chemicals are added. This creates the signature open-cell structure.',
        },
        {
          _key: 'ps2',
          title: 'Vulcanization',
          description:
            'The latex is baked at high temperatures to set its cellular structure, creating the signature open-cell breathability and durability latex is known for.',
        },
        {
          _key: 'ps3',
          title: 'Hand Assembly',
          description:
            'Latex cores are precision-cut and layered with certified fabrics. Each mattress is inspected by Suresh personally before being approved for shipping.',
        },
        {
          _key: 'ps4',
          title: 'Compression & Packing',
          description:
            'Your mattress is vacuum-compressed for easy shipping, rolled, and shipped directly to your doorstep. Simply unbox and watch it expand to full size.',
        },
      ],
    },
    certifications: [],
    values: [],
    teamSection: [],
    seo: {
      metaTitle:
        'About RelaxPro | Natural Latex Mattress Manufacturer India',
      metaDescription:
        "Learn about RelaxPro's journey crafting premium GOLS-certified natural latex mattresses directly from our Hyderabad factory since 2015.",
    },
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 17 — CONTACT PAGE
// ═════════════════════════════════════════════════════════════════════════════

function seedContact() {
  console.log('\n═══════ CONTACT ═══════')

  return {
    _id: 'contact',
    heading: 'Submit Your Sleep Concern',
    description:
      'Share your posture, pain, size, and comfort needs. Suresh or a senior consultant personally reviews every submission and calls back at your preferred time.',
    seo: {
      metaTitle:
        'Contact RelaxPro | Get Orthopedic Mattress Advice',
      metaDescription:
        'Contact RelaxPro for expert orthopedic mattress consultation. WhatsApp or call for personalized advice on natural latex mattresses.',
    },
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 18 — PRODUCTS PAGE
// ═════════════════════════════════════════════════════════════════════════════

function seedProductsPage() {
  console.log('\n═══════ PRODUCTS PAGE ═══════')

  return {
    _id: 'productsPage',
    pageTitle: 'Our Mattress Collection',
    pageDescription:
      'Explore 13 handcrafted latex and hybrid mattresses spanning three curated collections. From premium 100% pure organic latex to value orthopedic models.',
    products: [
      { _type: 'reference', _ref: 'product-nirvana' },
      { _type: 'reference', _ref: 'product-amrita' },
      { _type: 'reference', _ref: 'product-ananda' },
      { _type: 'reference', _ref: 'product-prakriti' },
      { _type: 'reference', _ref: 'product-somya' },
      { _type: 'reference', _ref: 'product-arogya' },
      { _type: 'reference', _ref: 'product-shuddha' },
      { _type: 'reference', _ref: 'product-sthira' },
      { _type: 'reference', _ref: 'product-bhumi' },
      { _type: 'reference', _ref: 'product-sunidra' },
      { _type: 'reference', _ref: 'product-vishram' },
      { _type: 'reference', _ref: 'product-ojas' },
      { _type: 'reference', _ref: 'product-ayushrest' },
    ],
    seo: {
      metaTitle: 'All Mattresses | RelaxPro Premium Collection',
      metaDescription:
        'Browse India\'s finest natural latex and orthopedic mattresses. 13 models from ₹6,500 with 10-year warranty and free delivery.',
    },
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 19 — SLEEP SCIENCE PAGE
// ═════════════════════════════════════════════════════════════════════════════

async function seedSleepScience() {
  console.log('\n═══════ SLEEP SCIENCE ═══════')

  return {
    _id: 'sleepScience',
    title: 'Sleep Science',
    badge: 'PHYSIOLOGICAL WELLNESS DATABASE',
    heading: 'The Science of Sleep Orthopedics',
    intro:
      'Understanding how your mattress interacts with your body\'s natural alignment is the first step toward better sleep. Our natural latex technology is backed by physiological research and decades of orthopedic expertise.',
    tabs: [
      {
        _key: 'tab0',
        label: 'Dunlop Latex vs Foam',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Natural latex offers superior pressure relief, temperature regulation, and durability compared to memory foam or polyurethane foam. The open-cell structure of Dunlop latex allows air to circulate freely, preventing heat buildup. Unlike memory foam that can trap heat and cause you to sink into poor posture, latex gently pushes back, keeping your spine naturally aligned throughout the night.',
              },
            ],
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Durability is another key advantage: a high-quality latex mattress can last 15-20 years with proper care, while most memory foam mattresses begin to sag after 5-7 years. This makes latex a significantly better long-term investment.',
              },
            ],
          },
        ],
      },
      {
        _key: 'tab1',
        label: 'Spine Alignment',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Proper spinal alignment during sleep is crucial for overall health. When your mattress supports the natural curves of your spine — the cervical lordosis, thoracic kyphosis, and lumbar lordosis — your muscles can fully relax, allowing for deeper, more restorative sleep.',
              },
            ],
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Natural latex is uniquely suited for spinal alignment because it provides "zoned support" — firmer under heavier body parts like the hips and shoulders, while gently contouring to lighter areas like the lower back. The responsive push-back of latex prevents the "hammock effect" common with memory foam that can misalign the spine.',
              },
            ],
          },
        ],
      },
      {
        _key: 'tab2',
        label: 'Certified Organic',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Our GOLS (Global Organic Latex Standard) certification guarantees that our latex contains at least 95% certified organic raw material, with no synthetic latex, fillers, or prohibited chemicals. This means your mattress is free from the toxic flame retardants, formaldehyde, and VOCs commonly found in conventional mattresses.',
              },
            ],
          },
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: 'Why does this matter? The average person spends 8 hours per night on their mattress, breathing in whatever chemicals it emits. With a GOLS-certified RelaxPro mattress, you can rest assured that your sleep environment is free from harmful substances.',
              },
            ],
          },
        ],
      },
    ],
    comparisonSection: {
      badge: 'EVIDENCE BASED',
      heading: 'Natural Latex vs. Synthetic Mattresses',
      description:
        'Backed by consumer research and materials science',
      rows: [
        {
          _key: 'cs0',
          criteria: 'Average Lifespan',
          latex: '15-20 years',
          foam: '5-8 years',
        },
        {
          _key: 'cs1',
          criteria: 'Temperature Regulation',
          latex: 'Excellent (open-cell)',
          foam: 'Poor (traps heat)',
        },
        {
          _key: 'cs2',
          criteria: 'Motion Isolation',
          latex: 'Excellent',
          foam: 'Good',
        },
        {
          _key: 'cs3',
          criteria: 'Chemical Off-gassing',
          latex: 'None (zero VOCs)',
          foam: 'Significant VOCs',
        },
        {
          _key: 'cs4',
          criteria: 'Eco-Friendly',
          latex: 'Biodegradable',
          foam: 'Non-biodegradable',
        },
        {
          _key: 'cs5',
          criteria: 'Cost per Year (Double)',
          latex: '₹2,700/yr',
          foam: '₹2,900/yr',
        },
      ],
    },
    orthopedicSection: {
      badge: 'MEDICAL INSIGHT',
      heading: 'Why Orthopedic Specialists Recommend Latex',
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Natural latex mattresses are increasingly recommended by orthopedic surgeons and physiotherapists for patients suffering from chronic back pain, sciatica, and joint issues. The material\'s unique properties — pressure redistribution, spinal alignment support, and motion isolation — make it ideal for therapeutic sleep environments.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Unlike memory foam that can create pressure points by allowing the heaviest parts of your body to sink deepest, latex provides uniform support across the entire body surface. This even distribution of pressure is critical for preventing bedsores in elderly patients and reducing morning stiffness in active adults.',
            },
          ],
        },
      ],
    },
    certifications: [
      {
        _key: 'sc0',
        title: 'GOLS Certified',
        description:
          'Global Organic Latex Standard — guarantees organic purity',
        image: await img('cert-gols-logo.png', 'GOLS Logo'),
      },
      {
        _key: 'sc1',
        title: 'OEKO-TEX Standard 100',
        description:
          'All fabrics tested for harmful substances',
        image: await img('cert-oeko-logo.png', 'OEKO-TEX Logo'),
      },
      {
        _key: 'sc2',
        title: 'ECO-Institut',
        description:
          'Verified environmental compatibility',
        image: null,
      },
    ],
    ctaBadge: 'FACTORY DIRECT ASSURANCE',
    ctaHeading: 'Choose the mattress designed for your back',
    ctaDescription:
      'Compare all 13 models side by side and find your perfect match.',
    ctaLabel: 'Compare All 13 Models',
    ctaLink: '/compare',
    seo: {
      metaTitle:
        'Sleep Science | Natural Latex Benefits & Orthopedic Research',
      metaDescription:
        'Discover the science behind natural latex mattresses. Learn about pressure relief, spine alignment, and why orthopedic specialists recommend latex.',
    },
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 20 — LOCATIONS
// ═════════════════════════════════════════════════════════════════════════════

async function seedLocations() {
  console.log('\n═══════ LOCATIONS ═══════')

  const locations = [
    {
      _id: 'loc-hyderabad',
      city: 'Hyderabad',
      slug: { current: 'hyderabad' },
      address:
        'RelaxPro Factory Showroom, Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana - 500055',
      phones: ['+918686624494', '+917207424494'],
      hours: 'Mon - Sun: 10:00 AM - 9:00 PM',
      image: await img('hero-banner.png', 'Hyderabad Location'),
      mapLink: '',
      order: 1,
    },
    {
      _id: 'loc-rajahmundry',
      city: 'Rajahmundry',
      slug: { current: 'rajahmundry' },
      address:
        'RelaxPro Factory Showroom, JN Road, Opposite Surya Function Hall, Rajahmundry, Andhra Pradesh - 533103',
      phones: ['+918686624494'],
      hours: 'Mon - Sat: 10:00 AM - 8:30 PM, Sun: 11:00 AM - 7:00 PM',
      image: null,
      mapLink: '',
      order: 2,
    },
    {
      _id: 'loc-bangalore',
      city: 'Bangalore',
      slug: { current: 'bangalore' },
      address:
        'RelaxPro Factory Showroom, KR Puram Hoodi Main Road, Bangalore, Karnataka - 560036',
      phones: ['+917207424494'],
      hours: 'Mon - Sun: 10:30 AM - 8:30 PM',
      image: null,
      mapLink: '',
      order: 3,
    },
  ]

  for (const l of locations) await upsert('location', l)
}

// ═════════════════════════════════════════════════════════════════════════════
//  SECTION 21 — GALLERIES
// ═════════════════════════════════════════════════════════════════════════════

async function seedGalleries() {
  console.log('\n═══════ GALLERIES ═══════')

  const galleries = [
    {
      _id: 'gallery-products',
      title: 'Product Showcase',
      slug: { current: 'product-showcase' },
      images: [
        await img('products/nirvana.webp', 'Nirvana Mattress'),
        await img('products/amrita.webp', 'Amrita Mattress'),
        await img('products/ananda.webp', 'Ananda Mattress'),
        await img('products/somya.webp', 'Somya Mattress'),
        await img('products/arogya.webp', 'Arogya Mattress'),
        await img('products/sthira.webp', 'Sthira Mattress'),
      ].filter(Boolean),
    },
    {
      _id: 'gallery-showroom',
      title: 'Showroom Gallery',
      slug: { current: 'showroom-gallery' },
      images: [
        await img('hero-banner.png', 'Showroom Hero'),
        await img('about-story.png', 'About Story'),
        await img('about-process.png', 'About Process'),
      ].filter(Boolean),
    },
  ]

  for (const g of galleries) await upsert('gallery', g)
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN — Orchestrate everything
// ═════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║     RELAXPRO — Comprehensive Sanity Seeder          ║')
  console.log('╚══════════════════════════════════════════════════════╝')
  console.log(`Project: de6mndac / production`)
  console.log(`Images directory: ${IMAGE_DIR}`)
  console.log(`Image cache: ${CACHE_FILE}`)

  // ── Step 1: Categories ──
  await seedCategories()

  // ── Step 2: Products ──
  await seedProducts()

  // ── Step 3: Testimonials ──
  const testimonials = seedTestimonials()
  for (const t of testimonials) await upsert('testimonial', t)

  // ── Step 4: FAQs ──
  const faqs = seedFaqs()
  for (const f of faqs) await upsert('faq', f)

  // ── Step 5: Showrooms ──
  const showrooms = await seedShowrooms()
  for (const s of showrooms) await upsert('showroom' , s)

  // ── Step 6: Accessories ──
  await seedAccessories()

  // ── Step 7: Offers ──
  const offers = seedOffers()
  for (const o of offers) await upsert('offer', o)

  // ── Step 8: Policy Pages ──
  const policyPages = seedPolicyPages()
  for (const pp of policyPages) await upsert('policyPage', pp)

  // ── Step 9: Sleep Styles ──
  const sleepStyles = seedSleepStyles()
  for (const ss of sleepStyles) await upsert('sleepStyle', ss)

  // ── Step 10: Certifications ──
  await seedCertifications()

  const certSettings = seedCertificationSettings()
  await upsert('certificationSettings', certSettings)

  // ── Step 11: Builder Data ──
  const builderConfig = seedBuilderConfig()
  await upsert('customBuilder', builderConfig)
  await seedBuilderMaterials()
  await seedBuilderFabrics()

  // ── Step 12: Navigation ──
  const nav = seedNavigation()
  await upsert('navigation', nav)

  // ── Step 13: Hero ──
  const hero = await seedHero()
  await upsert('hero', hero)

  // ── Step 14: Site Settings ──
  const siteSettings = await seedSiteSettings()
  await upsert('siteSettings', siteSettings)

  // ── Step 15: Homepage ──
  const home = await seedHomepage()
  await upsert('home', home)

  // ── Step 16: About ──
  const about = seedAbout()
  await upsert('about', about)

  // ── Step 17: Contact ──
  const contact = seedContact()
  await upsert('contact', contact)

  // ── Step 18: Products Page ──
  const productsPage = seedProductsPage()
  await upsert('productsPage', productsPage)

  // ── Step 19: Sleep Science ──
  const sleepScience = await seedSleepScience()
  await upsert('sleepScience', sleepScience)

  // ── Step 20: Locations ──
  await seedLocations()

  // ── Step 21: Galleries ──
  await seedGalleries()

  console.log('\n══════════════════════════════════════════════════════')
  console.log('  ✅ SEED COMPLETE!')
  console.log('  Open your Sanity Studio to verify:')
  console.log('  https://relaxpro.sanity.studio')
  console.log('══════════════════════════════════════════════════════')
}

main().catch((err) => {
  console.error('\n❌ Seed failed:', err)
  process.exit(1)
})
