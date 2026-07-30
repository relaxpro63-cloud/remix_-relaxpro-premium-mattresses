/**
 * seed-supplement.mjs — Seeds content types missing from seed.mjs
 *
 * Run AFTER seed.mjs to add:
 *   accessory (4), offer (3), certification (5), certificationSettings,
 *   builderMaterial (6), builderFabric (4), customBuilder, productsPage
 *
 * Usage:
 *   SANITY_AUTH_TOKEN=<token> node seed-supplement.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { join, extname } from 'path'

const TOKEN = process.env.SANITY_AUTH_TOKEN
if (!TOKEN) { console.error('SANITY_AUTH_TOKEN env var required'); process.exit(1) }

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const PROJECT_ROOT = join(import.meta.dirname, '..', '..', '..')
const IMAGE_DIR = join(PROJECT_ROOT, 'public', 'images')
const CACHE_FILE = join(import.meta.dirname, 'image-cache.json')

let imageCache = {}
try {
  if (existsSync(CACHE_FILE)) imageCache = JSON.parse(readFileSync(CACHE_FILE, 'utf-8'))
} catch { /* ignore */ }

async function img(localPath, altText) {
  if (!localPath) return null
  const key = localPath.replace(/\\/g, '/').replace(/^\//, '')
  if (imageCache[key]) {
    return { _type: 'image', asset: { _type: 'reference', _ref: imageCache[key].asset }, alt: altText || imageCache[key].alt || '' }
  }
  const fullPath = join(IMAGE_DIR, key)
  if (!existsSync(fullPath)) { console.warn(`  ⚠ Image not found: ${key}`); return null }
  try {
    const buffer = readFileSync(fullPath)
    const filename = key.split(/[/\\]/).pop()
    const asset = await client.assets.upload('image', buffer, { filename })
    const fallbackAlt = filename.replace(extname(filename), '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    imageCache[key] = { asset: asset._id, alt: fallbackAlt }
    writeFileSync(CACHE_FILE, JSON.stringify(imageCache, null, 2))
    console.log(`  📷 Uploaded ${key} → ${asset._id}`)
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: altText || fallbackAlt }
  } catch (err) { console.error(`  ❌ Upload failed ${key}: ${err.message}`); return null }
}

async function retry(fn, label, max = 3) {
  for (let i = 0; i < max; i++) {
    try { await fn(); return }
    catch { if (i < max - 1) { console.log(`  ⟳ retry ${i+1}/${max} "${label}"`); await new Promise(r => setTimeout(r, 2000)) } else throw new Error(`Failed "${label}"`) }
  }
}

async function upsert(type, item) {
  const label = item.name || item.title || item._id
  await retry(() => client.createOrReplace({ _id: item._id, _type: type, ...item }), `${type}: ${label}`)
  console.log(`  ✅ ${type.padEnd(18)} ${label}`)
}

// ═════════════════════════════════════════════════════════════════════════════
//  1 — ACCESSORIES
// ═════════════════════════════════════════════════════════════════════════════

async function seedAccessories() {
  console.log('\n═══════ ACCESSORIES ═══════')
  const accessories = [
    {
      _id: 'accessory-latex-pillow', name: 'Natural Latex Pillow', slug: { current: 'natural-latex-pillow' },
      tagline: 'Contoured support for your neck and shoulders',
      description: 'Our GOLS-certified natural latex pillow offers the perfect balance of support and comfort. The open-cell structure promotes airflow, keeping you cool all night. Available in medium and firm densities.',
      type: 'latex_pillow', pricing: { price: 2499, mrp: 3999, currency: '₹' },
      sizes: ['Standard', 'King'],
      features: ['100% Natural Latex Core — GOLS Certified', 'Breathable Organic Cotton Cover', 'Medium-Firm Support for All Sleep Positions', 'Hypoallergenic & Dust Mite Resistant', 'Dimensions: 24" x 16" x 5" (Standard)'],
      thumbnail: await img('accessories/latex-pillow.jpg', 'Latex Pillow'),
      inStock: true, isNew: false, isBestseller: true, sortOrder: 1,
    },
    {
      _id: 'accessory-shredded-pillow', name: 'Shredded Latex Pillow', slug: { current: 'shredded-latex-pillow' },
      tagline: 'Adjustable loft for personalized comfort',
      description: 'Made from shredded natural latex with a zippered cover, allowing you to add or remove filling to achieve your perfect loft and firmness. Ideal for all sleep positions.',
      type: 'shredded_pillow', pricing: { price: 1999, mrp: 2999, currency: '₹' },
      sizes: ['Standard', 'Queen', 'King'],
      features: ['Adjustable Loft — Customize Your Fill', '100% Natural Latex Shredded Fill', 'Breathable Cotton Cover with Zipper', 'Supports Side, Back & Stomach Sleepers', 'Dimensions: 24" x 16" x 4-6" (Adjustable)'],
      thumbnail: await img('accessories/shredded-pillow.jpg', 'Shredded Latex Pillow'),
      inStock: true, isNew: true, isBestseller: false, sortOrder: 2,
    },
    {
      _id: 'accessory-fiber-pillow', name: 'Premium Fiber Pillow', slug: { current: 'premium-fiber-pillow' },
      tagline: 'Soft, plush comfort for gentle support',
      description: 'Our premium hollow-fiber pillow provides a soft, plush feel for those who prefer a traditional pillow. The microfiber fill is hypoallergenic and machine washable.',
      type: 'fiber_pillow', pricing: { price: 999, mrp: 1499, currency: '₹' },
      sizes: ['Standard', 'Queen'],
      features: ['Hypoallergenic Hollow Fiber Fill', 'Soft, Plush Feel for Gentle Support', 'Machine Washable Cover', 'Lightweight and Breathable', 'Dimensions: 28" x 18" x 6"'],
      thumbnail: await img('accessories/fiber-pillow.jpg', 'Fiber Pillow'),
      inStock: true, isNew: false, isBestseller: false, sortOrder: 3,
    },
    {
      _id: 'accessory-mattress-protector', name: 'Organic Cotton Mattress Protector', slug: { current: 'organic-cotton-mattress-protector' },
      tagline: 'Premium protection for your RelaxPro mattress',
      description: 'Protect your investment with our GOTS-certified organic cotton mattress protector. Waterproof yet breathable, it guards against spills, dust mites, and allergens while maintaining the feel of your mattress.',
      type: 'mattress_protector', pricing: { price: 2999, mrp: 4499, currency: '₹' },
      sizes: ['King', 'Queen', 'Double', 'Single'],
      features: ['GOTS Certified Organic Cotton Top', 'Waterproof Yet Breathable Membrane', 'Deep Pockets Fits 12" Mattresses', 'Dust Mite & Allergen Barrier', 'Machine Washable & Dryer Safe'],
      thumbnail: await img('accessories/mattress-protector.jpg', 'Mattress Protector'),
      inStock: true, isNew: false, isBestseller: false, sortOrder: 4,
    },
  ]
  for (const a of accessories) await upsert('accessory', a)
}

// ═════════════════════════════════════════════════════════════════════════════
//  2 — OFFERS
// ═════════════════════════════════════════════════════════════════════════════

function seedOffers() {
  console.log('\n═══════ OFFERS ═══════')
  const offers = [
    {
      _id: 'offer-factory-direct', title: 'Factory Direct Pricing — Up to 30% Off',
      subtitle: 'Why pay retail when you can buy directly from the manufacturer?',
      description: 'Get genuine factory-direct pricing on all RelaxPro mattresses. No middlemen, no showroom commissions, no hidden costs. What you see is what you pay — plus free delivery.',
      badge: 'Best Value', type: 'discount', discountText: 'Factory Direct — Save 30%',
      cta: { label: 'Shop Factory Direct', link: '/catalog', variant: 'primary', openInNewTab: false },
      isActive: true, showBanner: false, priority: 10,
    },
    {
      _id: 'offer-free-accessories', title: 'Free Accessories with Every Purchase',
      subtitle: 'Get 2 Latex Pillows + Mattress Protector Free',
      description: 'When you buy any RelaxPro mattress, receive 2 natural latex pillows and an organic cotton mattress protector absolutely free. Limited stock offer — valid while supplies last.',
      badge: 'Limited Time', type: 'bundle', discountText: 'Free ₹8,497 Worth of Accessories',
      cta: { label: 'Claim This Offer', link: '/catalog', variant: 'primary', openInNewTab: false },
      isActive: true, showBanner: true, bannerColor: 'brand', priority: 8,
    },
    {
      _id: 'offer-comfort-collection', title: 'Comfort Collection — Starting at ₹6,500',
      subtitle: 'Premium orthopedic mattresses at entry-level prices',
      description: 'Explore our Comfort Collection featuring the Ojas and AyushRest models. Perfect for guest rooms, hostels, and budget-conscious buyers who refuse to compromise on quality.',
      badge: 'Budget Friendly', type: 'seasonal', discountText: 'From ₹6,500',
      cta: { label: 'Explore Comfort Collection', link: '/catalog?tier=comfort', variant: 'secondary', openInNewTab: false },
      isActive: true, showBanner: false, priority: 6,
    },
  ]
  return offers
}

// ═════════════════════════════════════════════════════════════════════════════
//  3 — CERTIFICATIONS
// ═════════════════════════════════════════════════════════════════════════════

async function seedCertifications() {
  console.log('\n═══════ CERTIFICATIONS ═══════')
  const certs = [
    { _id: 'cert-gols', title: 'GOLS Certified Organic', slug: { current: 'gols' }, subtitle: 'Global Organic Latex Standard',
      description: 'Our organic latex components are certified under the Global Organic Latex Standard (GOLS), ensuring sustainable farming, fair labor practices, and zero synthetic additives in the latex production chain.',
      logoImage: await img('cert-gols-logo.png', 'GOLS Logo'), certificateImage: await img('cert-gols.png', 'GOLS Certificate'),
      pdfUrl: '', pdfEmbedUrl: '', validity: 'Valid — Audited Annually', order: 1, isActive: true },
    { _id: 'cert-oeko-tex', title: 'OEKO-TEX Standard 100', slug: { current: 'oeko-tex' }, subtitle: 'Confidence in Textiles',
      description: 'All our mattress fabrics are OEKO-TEX Standard 100 certified, meaning they are free from harmful chemicals and safe for human health. This certification covers every thread and button used in our mattresses.',
      logoImage: await img('cert-oeko-logo.png', 'OEKO-TEX Logo'), certificateImage: await img('cert-oeko-tex.png', 'OEKO-TEX Certificate'),
      pdfUrl: '', pdfEmbedUrl: '', validity: 'Valid — Tested Annually', order: 2, isActive: true },
    { _id: 'cert-iso', title: 'ISO 9001:2015 Certified', slug: { current: 'iso-9001' }, subtitle: 'Quality Management System',
      description: 'Our manufacturing facility is ISO 9001:2015 certified, demonstrating our commitment to consistent quality, continuous improvement, and customer satisfaction in every mattress we produce.',
      logoImage: await img('cert-iso-logo.png', 'ISO Logo'), certificateImage: await img('cert-iso.png', 'ISO Certificate'),
      pdfUrl: '', pdfEmbedUrl: '', validity: 'Valid — Recertified Annually', order: 3, isActive: true },
    { _id: 'cert-fsc', title: 'FSC Certified', slug: { current: 'fsc' }, subtitle: 'Forest Stewardship Council',
      description: 'Where wood products are used in our manufacturing and packaging, we source FSC-certified materials to ensure responsible forestry practices. We are committed to minimizing our environmental impact.',
      logoImage: await img('cert-fsc-logo.svg', 'FSC Logo'), certificateImage: null, validity: 'Valid', order: 4, isActive: true },
    { _id: 'cert-eco-institut', title: 'ECO-Institut Verified', slug: { current: 'eco-institut' }, subtitle: 'Environmental Compatibility',
      description: 'Our eco-rebonded latex components have been tested and verified by ECO-Institut for environmental compatibility, confirming minimal ecological impact in both production and disposal phases.',
      logoImage: await img('cert-eco-institut-logo.svg', 'ECO-Institut Logo'), certificateImage: null, validity: 'Valid', order: 5, isActive: true },
  ]
  for (const c of certs) await upsert('certification', c)
}

function seedCertificationSettings() {
  console.log('\n═══════ CERTIFICATION SETTINGS ═══════')
  return {
    _id: 'certificationSettings', sectionTitle: 'Trusted by International Quality Standards',
    sectionBadge: 'Certified Quality',
    sectionDescription: 'Every RelaxPro mattress is backed by rigorous international certifications that guarantee purity, safety, and environmental responsibility.',
    buttonText: 'View All Certificates', backgroundColor: '#FAF8F5', isEnabled: true,
    certifications: [
      { _type: 'reference', _ref: 'cert-gols' }, { _type: 'reference', _ref: 'cert-oeko-tex' },
      { _type: 'reference', _ref: 'cert-iso' }, { _type: 'reference', _ref: 'cert-fsc' },
      { _type: 'reference', _ref: 'cert-eco-institut' },
    ],
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  4 — BUILDER DATA
// ═════════════════════════════════════════════════════════════════════════════

async function seedBuilderMaterials() {
  console.log('\n═══════ BUILDER MATERIALS ═══════')
  const materials = [
    { _id: 'mat-pure-latex-2', name: 'Pure Natural Latex (Soft)', slug: { current: 'pure-natural-latex-soft' }, slot: 'comfort', brand: 'RelaxPro Kerala Organic', density: '80 Density', ild: 'ILD-22', feelTag: 'Soft, hugging feel', benefit: 'GOLS certified pure latex with a soft, plush feel. Ideal for pressure relief and side sleepers.', tooltip: '80 Density Pure Dunlop Latex. ILD 22. GOLS certified organic. Very responsive — zero sinking feeling.', thicknessOptions: [{ _key: 't1', inches: 2, addPrice: 2000 }, { _key: 't2', inches: 3, addPrice: 3000 }, { _key: 't3', inches: 4, addPrice: 4000 }], stackColor: '#E8D5B7', image: null, isRecommended: false, order: 1, isActive: true },
    { _id: 'mat-pure-latex-4', name: 'Pure Natural Latex (Medium)', slug: { current: 'pure-natural-latex-medium' }, slot: 'comfort', brand: 'RelaxPro Kerala Organic', density: '90 Density', ild: 'ILD-28', feelTag: 'Balanced, responsive comfort', benefit: 'Our most popular comfort layer. GOLS certified 90 density latex offering the perfect balance of contouring and support.', tooltip: '90 Density Pure Dunlop Latex. ILD 28. GOLS certified. Open-cell structure for cooling. 96.6% purity.', thicknessOptions: [{ _key: 't1', inches: 2, addPrice: 2500 }, { _key: 't2', inches: 3, addPrice: 3750 }, { _key: 't3', inches: 4, addPrice: 5000 }], stackColor: '#BFE3C0', image: null, isRecommended: true, order: 2, isActive: true },
    { _id: 'mat-pure-latex-6', name: 'Pure Natural Latex (Firm)', slug: { current: 'pure-natural-latex-firm' }, slot: 'comfort', brand: 'RelaxPro Kerala Organic', density: '95 Density', ild: 'ILD-36', feelTag: 'Firm, supportive feel', benefit: 'High density GOLS certified latex for those who prefer a firmer surface with natural bounce.', tooltip: '95 Density Pure Dunlop Latex. ILD 36. GOLS certified. Maximum support from pure latex. Excellent for back sleepers.', thicknessOptions: [{ _key: 't1', inches: 2, addPrice: 3000 }, { _key: 't2', inches: 3, addPrice: 4500 }, { _key: 't3', inches: 4, addPrice: 6000 }], stackColor: '#C9B99A', image: null, isRecommended: false, order: 3, isActive: true },
    { _id: 'mat-rebonded-firm', name: 'PU Rebonded Foam (Firm Support)', slug: { current: 'pu-rebonded' }, slot: 'support', brand: 'Century Foam', density: '90-95 Density', ild: 'ILD-45', feelTag: 'Rigid, orthopedic support', benefit: 'High density PU rebonded foam for maximum structural support. The rigid foundation keeps your spine aligned.', tooltip: 'Century brand PU rebonded foam. 90-95 Density. ILD 45. Zero sagging guarantee. 10+ year lifespan.', thicknessOptions: [{ _key: 't1', inches: 2, addPrice: 1500 }, { _key: 't2', inches: 4, addPrice: 3000 }], stackColor: '#D4C5A9', image: null, isRecommended: true, order: 4, isActive: true },
    { _id: 'mat-hr-foam', name: 'HR Foam (Orthopedic Support)', slug: { current: 'hr-foam' }, slot: 'comfort', brand: 'Century Ortho HR', density: '60-70 Density', ild: 'ILD-38', feelTag: 'Firm, supportive middle layer', benefit: 'High-resilience foam that provides firm orthopedic support for the middle layer. Ideal for back sleepers needing extra lumbar support.', tooltip: 'Century HR Foam. 60-70 Density. ILD 38. High resilience orthopedic support foam. Excellent for spinal alignment.', thicknessOptions: [{ _key: 't1', inches: 2, addPrice: 1500 }], stackColor: '#B8C5D6', image: null, isRecommended: true, order: 5, isActive: true },
    { _id: 'mat-hr-softy', name: 'HR Softy Foam (Plush Cushioning)', slug: { current: 'hr-softy-foam' }, slot: 'comfort', brand: 'Century AirFlow', density: '40-50 Density', ild: 'ILD-18', feelTag: 'Soft, plush transition comfort', benefit: 'High resilience softy foam that provides a plush, cushioning middle layer — perfect for pressure relief and side sleepers.', tooltip: 'Century HR Softy Foam. 40-50 Density. ILD 18. High resilience — bounces back instantly. Great for pressure relief.', thicknessOptions: [{ _key: 't1', inches: 2, addPrice: 1500 }], stackColor: '#F0E6D3', image: null, isRecommended: false, order: 6, isActive: true },
    { _id: 'mat-latex-rebonded', name: 'Latex Rebonded Core (Eco)', slug: { current: 'latex-rebonded-core' }, slot: 'support', brand: 'RelaxPro Eco Core', density: '120 Density', ild: 'ILD-40', feelTag: 'Dense, eco-friendly support', benefit: 'Made from upcycled organic latex shreds compressed into a high-density core. Eco-friendly without compromising on support.', tooltip: '120 Density Latex Rebonded. ILD 40. Made from upcycled GOLS latex shreds. Eco-Institut certified. Zero waste manufacturing.', thicknessOptions: [{ _key: 't1', inches: 2, addPrice: 2500 }, { _key: 't2', inches: 4, addPrice: 5000 }], stackColor: '#A8C8A8', image: null, isRecommended: false, order: 7, isActive: true },
  ]
  for (const m of materials) await upsert('builderMaterial', m)
}

async function seedBuilderFabrics() {
  console.log('\n═══════ BUILDER FABRICS ═══════')
  const fabrics = [
    { _id: 'fabric-300gsm', name: '300 GSM Quilted Fabric (Standard)', slug: { current: 'fabric-300gsm' }, role: 'primaryCover', gsm: '300 GSM', quiltingMm: '8mm', benefit: 'Standard quilted fabric with OEKO-TEX certification. Breathable and durable for everyday use.', addPrice: 0, image: null, isRecommended: true, order: 1, isActive: true },
    { _id: 'fabric-450gsm', name: '450 GSM Premium Quilted Fabric', slug: { current: 'fabric-450gsm' }, role: 'primaryCover', gsm: '450 GSM', quiltingMm: '12mm', benefit: 'Premium thick quilted fabric with OEKO-TEX certification. Plusher feel, superior durability, and elegant appearance.', addPrice: 2000, image: null, isRecommended: false, order: 2, isActive: true },
    { _id: 'quilting-8mm', name: '8mm Standard Quilting (Upgrade)', slug: { current: 'quilting-8mm' }, role: 'quiltingUpgrade', gsm: 'N/A', quiltingMm: '8mm', benefit: 'Standard 8mm quilting pattern for a classic mattress appearance.', addPrice: 0, image: null, isRecommended: true, order: 3, isActive: true },
    { _id: 'quilting-12mm', name: '12mm Deep Quilting (Premium)', slug: { current: 'quilting-12mm' }, role: 'quiltingUpgrade', gsm: 'N/A', quiltingMm: '12mm', benefit: 'Deep 12mm quilting for a luxurious pillow-top feel with enhanced pressure relief.', addPrice: 1500, image: null, isRecommended: false, order: 4, isActive: true },
  ]
  for (const f of fabrics) await upsert('builderFabric', f)
}

function seedBuilderConfig() {
  console.log('\n═══════ BUILDER CONFIG ═══════')
  return {
    _id: 'customBuilder',
    header: { title: 'Build Your Own Mattress', subtitle: 'Choose your size, comfort layer, support core, and cover fabric. Our team will handcraft it and deliver it to your doorstep.', trustChips: ['Free Delivery', '10-Year Warranty', '100-Night Trial', 'Handcrafted in Hyderabad'] },
    sizes: [
      { _key: 'sz0', name: 'Single', lengthInches: 78, widthInches: 36, basePrice: 6500, popular: false },
      { _key: 'sz1', name: 'Double', lengthInches: 78, widthInches: 48, basePrice: 8500, popular: false },
      { _key: 'sz2', name: 'Queen', lengthInches: 78, widthInches: 60, basePrice: 11000, popular: true },
      { _key: 'sz3', name: 'King', lengthInches: 78, widthInches: 72, basePrice: 13000, popular: true },
      { _key: 'sz4', name: 'Diwan', lengthInches: 75, widthInches: 48, basePrice: 9500, popular: false },
    ],
    customSize: { enabled: true, unit: 'inches', minLength: 40, maxLength: 84, minWidth: 20, maxWidth: 78, pricePerSqInch: 187.5, cutCharge: 1000, helper: 'Need a unique size? Enter your custom dimensions below.' },
    steps: { sizeTitle: 'Choose Your Size', sizeHelper: 'Pick a standard size or enter custom dimensions', comfortTitle: 'Choose Comfort Layer', comfortHelper: 'This top layer determines the feel of your mattress', supportTitle: 'Choose Support Core', supportHelper: 'The base layer provides structural support and durability', coverTitle: 'Pick Your Cover', coverHelper: 'Choose fabric GSM and quilting depth' },
    summaryPanel: { heading: 'Your Mattress', emptySlotText: 'Tap a step to choose', emiNote: 'EMI starting at ₹{emi}/month', perks: ['Free delivery across South India', '10-year replacement warranty', '100-night sleep trial', 'Handcrafted in Hyderabad'] },
    ctas: { primaryLabel: 'Add to Cart', secondaryLabel: 'Book a Free Consultation', disabledHint: 'Complete all steps to add to cart' },
    defaults: { sizeName: 'Queen', comfortMaterialSlug: 'pure-natural-latex-medium', comfortThickness: 2, supportMaterialSlug: 'pu-rebonded', supportThickness: 4, coverFabricSlug: 'fabric-300gsm', quiltingSlug: 'quilting-12mm' },
    seo: { metaTitle: 'Custom Mattress Builder — Design Your Perfect Sleep | RelaxPro', metaDescription: 'Personalize your GOLS natural latex mattress layer-by-layer. Choose GOTS bamboo cover, composite layers, custom size.' },
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  5 — PRODUCTS PAGE
// ═════════════════════════════════════════════════════════════════════════════

function seedProductsPage() {
  console.log('\n═══════ PRODUCTS PAGE ═══════')
  return {
    _id: 'productsPage',
    pageTitle: 'Our Mattress Collection',
    pageDescription: 'Explore 13 handcrafted latex and hybrid mattresses spanning three curated collections. From premium 100% pure organic latex to value orthopedic models.',
    products: [
      { _type: 'reference', _ref: 'product-nirvana' }, { _type: 'reference', _ref: 'product-amrita' },
      { _type: 'reference', _ref: 'product-ananda' }, { _type: 'reference', _ref: 'product-prakriti' },
      { _type: 'reference', _ref: 'product-somya' }, { _type: 'reference', _ref: 'product-arogya' },
      { _type: 'reference', _ref: 'product-shuddha' }, { _type: 'reference', _ref: 'product-sthira' },
      { _type: 'reference', _ref: 'product-bhumi' }, { _type: 'reference', _ref: 'product-sunidra' },
      { _type: 'reference', _ref: 'product-vishram' }, { _type: 'reference', _ref: 'product-ojas' },
      { _type: 'reference', _ref: 'product-ayushrest' },
    ],
    seo: { metaTitle: 'All Mattresses | RelaxPro Premium Collection', metaDescription: "Browse India's finest natural latex and orthopedic mattresses. 13 models from ₹6,500 with 10-year warranty and free delivery." },
  }
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN
// ═════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log('═'.repeat(50))
  console.log('  🌿 RELAXPRO — SUPPLEMENT SEEDER')
  console.log('  Seeds content types missing from seed.mjs')
  console.log('═'.repeat(50))

  await seedAccessories()
  const offers = seedOffers()
  for (const o of offers) await upsert('offer', o)
  await seedCertifications()
  await upsert('certificationSettings', seedCertificationSettings())
  const builderConfig = seedBuilderConfig()
  await upsert('customBuilder', builderConfig)
  await seedBuilderMaterials()
  await seedBuilderFabrics()
  await upsert('productsPage', seedProductsPage())

  console.log('\n═'.repeat(50))
  console.log('  ✅ Supplement seeding complete!')
  console.log('═'.repeat(50))
}

main().catch(err => { console.error('❌', err); process.exit(1) })
