import { createClient } from '@sanity/client'
import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'fs'
import { join, extname, relative } from 'path'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) { console.error('SANITY_AUTH_TOKEN env var required'); process.exit(1) }

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const PROJECT_ROOT = join(import.meta.dirname, '..', '..', '..')
const IMAGE_DIR = join(import.meta.dirname, '..', 'public', 'images')
const MAPPING_FILE = join(import.meta.dirname, 'imageMapping.json')

let imageMapping = existsSync(MAPPING_FILE) ? JSON.parse(readFileSync(MAPPING_FILE, 'utf-8')) : {}

async function getImageAsset(localPath) {
  const key = localPath.replace(/^\//, '').replace(/\//g, '\\')
  if (imageMapping[key]) return imageMapping[key]
  const fullPath = join(IMAGE_DIR, key)
  if (!existsSync(fullPath)) return null
  try {
    const buffer = readFileSync(fullPath)
    const filename = key.split(/[/\\]/).pop()
    const asset = await client.assets.upload('image', buffer, { filename })
    const result = {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt: filename.replace(extname(filename), '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    }
    imageMapping[key] = result
    writeFileSync(MAPPING_FILE, JSON.stringify(imageMapping, null, 2))
    console.log(`  UPLOADED ${key} → ${asset._id}`)
    return result
  } catch (err) {
    console.error(`  FAILED ${key}: ${err.message}`)
    return null
  }
}

function img(path) { return { _type: 'image', asset: { _type: 'reference', _ref: path }, alt: '' } }

async function retry(fn, label, max = 3) {
  for (let i = 0; i < max; i++) {
    try { await fn(); return }
    catch { if (i < max - 1) { console.log(`    retry ${i + 1}/${max} "${label}"`); await new Promise(r => setTimeout(r, 2000)) } else throw new Error(`Failed "${label}"`) }
  }
}

async function upsert(type, item) {
  const label = item.name ?? item.customerName ?? item.question?.slice(0, 36) ?? item._id
  await retry(() => client.createOrReplace({ _id: item._id, _type: type, ...item }), label)
  console.log(`  OK ${type.padEnd(14)} ${label}`)
}

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
const CATEGORIES = [
  { _id: 'cat-luxury', name: 'Luxury Collection', slug: { current: 'luxury' }, description: 'Our premium 100% pure natural latex mattresses with GOLS certification and superior comfort.', image: await getImageAsset('products/nirvana.webp'), order: 1 },
  { _id: 'cat-premium', name: 'Premium Collection', slug: { current: 'premium' }, description: 'Latex hybrids combining organic latex with high-density support layers for balanced comfort.', image: await getImageAsset('products/somya.webp'), order: 2 },
  { _id: 'cat-comfort', name: 'Comfort Collection', slug: { current: 'comfort' }, description: 'Value orthopedic foam and latex-entry mattresses designed for accessible comfort.', image: await getImageAsset('products/sunidra.webp'), order: 3 },
]

// ─── PRODUCTS ───────────────────────────────────────────────────────────────
const PRODUCTS_DATA = [
  {
    _id: 'product-nirvana', slug: { current: 'nirvana' },
    name: 'Nirvana', tagline: 'Experience ultimate relaxation', subtitle: 'Luxury sleep begins with Nirvana latex mattress',
    keyBenefit: '6" Kerala Latex 90 density pure 96.6% Purity GOLS certified for therapeutic deep sleep & pressure relief',
    description: 'Nirvana is our flagship pure latex mattress, crafted entirely from a single 6-inch block of 100% natural Dunlop latex sourced from certified organic Kerala plantations. With an exceptional 96.6% purity and GOLS certification, every inch delivers therapeutic pressure relief that cradles your body while maintaining perfect spinal alignment. The open-cell latex structure naturally dissipates heat, keeping you cool through the night, while the inherent elasticity of latex absorbs motion completely — so you sleep undisturbed even with a restless partner. Zero synthetic chemicals, fillers, or VOC emissions make it completely safe for infants, elders, and anyone with chemical sensitivities.',
    badge: 'Premium Pure Latex Comfort', warranty: 10, comfortLevel: 'plush', comfortRating: 5, totalThickness: 6,
    layers: [{ thickness: 6, material: 'latex', brand: 'RelaxPro Kerala Organic', certification: ['GOLS'], description: '6" Kerala Latex 90 density pure 96.6% Purity GOLS certified' }],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 54000, queen: 45000, double: 32000, single: 27000, diwan: 34000, custom: 0 }, withoutAccessories: { king: 49000, queen: 41000, double: 33000, single: 24500, diwan: 31000, custom: 0 } },
    features: ['6" Kerala Latex 90 density pure 96.6% Purity GOLS certified for therapeutic deep sleep', '100% natural biodegradable Dunlop latex sap harvested under strict GOLS organic standards', 'Zero synthetic chemicals, fillers, or VOC emissions — completely safe for infants and elders', '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability', 'Get video call while making and receive 1 edited making video for reference'],
    image: await getImageAsset('products/nirvana.webp'), images: [],
    tier: 'luxury', isBestseller: true, isFeatured: true, inStock: true, rating: 4.9, reviewCount: 1200, sortOrder: 1,
    category: { _type: 'reference', _ref: 'cat-luxury' },
    metaTitle: 'Nirvana 6" Pure Natural Latex Mattress | RelaxPro',
    metaDescription: 'Buy RelaxPro Nirvana 6-inch 100% natural latex mattress. 90 density pure 96.6% GOLS certified Kerala latex. 10-year warranty, free shipping.',
    seo: { metaTitle: 'Nirvana 6" Pure Natural Latex Mattress | RelaxPro', metaDescription: 'Buy RelaxPro Nirvana 6-inch 100% natural latex mattress. 90 density pure 96.6% GOLS certified Kerala latex. 10-year warranty, free shipping.' },
  },
  {
    _id: 'product-amrita', slug: { current: 'amrita' },
    name: 'Amrita', tagline: 'Sleep that rejuvenates you', subtitle: 'Feel long-lasting luxury with Amrita latex mattress',
    keyBenefit: 'Heavy hybrid foundation topped with a ultra-thick premium organic latex comfort layer for deep body contouring and muscle recovery',
    description: 'Amrita is a 10-inch hybrid masterpiece that pairs a 4-inch high-density rebonded Century foam base with a luxurious 6-inch slab of GOLS-certified pure organic Kerala latex. This combination delivers the best of both worlds: the rock-solid foundation that never sags, topped with a thick cloud of natural latex that contours to every curve of your body. The result is a mattress that supports deep muscle recovery while providing a floating-in-air sensation. The rebonded base — crafted from 90-95 density Century foam — guarantees zero structural deflection even after a decade of use.',
    badge: 'Premium 10" Reversible Rebonded + Latex Hybrid', warranty: 10, comfortLevel: 'medium-soft', comfortRating: 4, totalThickness: 10,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century High Density', description: '4" Rebonded Base Foam with 90 to 95 Density' },
      { thickness: 6, material: 'latex', brand: 'RelaxPro Pure Organic', certification: ['GOLS'], description: '6" Premium GOLS Certified Natural Kerala Latex' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 48000, queen: 40000, double: 32000, single: 24000, diwan: 34000, custom: 0 }, withoutAccessories: { king: 43000, queen: 36000, double: 29000, single: 21500, diwan: 31000, custom: 0 } },
    features: ['Luxurious 10-inch thick profile combining the posture support of premium rebonded foam and cloud latex comfort', '6 inches of pure Kerala latex handles natural spine-contouring, lowering tosses and turns', 'Ultra durable Century 95-density rebonded base guarantees zero sagging for over a decade', '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability', 'Get video call while making and receive 1 edited making video for reference'],
    image: await getImageAsset('products/amrita.webp'), images: [],
    tier: 'luxury', isBestseller: true, isFeatured: true, inStock: true, rating: 4.8, reviewCount: 850, sortOrder: 2,
    category: { _type: 'reference', _ref: 'cat-luxury' },
    seo: { metaTitle: 'Amrita 10" Rebonded & Latex Luxury Mattress | RelaxPro', metaDescription: 'Shop the Amrita 10-inch luxurious mattress with 4" rebonded support and 6" certified natural rubber latex.' },
  },
  {
    _id: 'product-ananda', slug: { current: 'ananda' },
    name: 'Ananda', tagline: 'Blissful comfort every night', subtitle: 'Turn bedtime into joy with Ananda latex mattress',
    keyBenefit: 'Pure seamless solid organic latex master block yielding a buoyant response that cradles curves while securing independent motion isolation',
    description: 'Ananda is a pure 6-inch solid natural latex mattress that strips away all foam and fillers to deliver the purest sleep experience possible. Made entirely from a single seamless block of Dunlop-processed organic latex, Ananda offers a buoyant, responsive feel that gently pushes back against your body — providing natural spinal alignment without the sinking sensation of memory foam.',
    badge: '100% Pure Classic Latex Comfort', warranty: 10, comfortLevel: 'soft-medium', comfortRating: 4, totalThickness: 6,
    layers: [{ thickness: 6, material: 'latex', brand: 'RelaxPro Kerala Organic', certification: ['GOLS', 'Oeko-Tex'], description: '6" GOLS Certified 100% Pure Organic Latex' }],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 42000, queen: 35000, double: 28000, single: 21000, diwan: 34000, custom: 0 }, withoutAccessories: { king: 37000, queen: 31000, double: 25000, single: 18500, diwan: 31000, custom: 0 } },
    features: ['Made purely of a robust 6" luxury solid core of natural Dunlop organic latex, no foam fillers added', 'Highly elastic properties distribute physical pressure points uniformly across the system', 'Unsurpassed motion isolation ensures partner movements generate zero seismic disturbance', '400 to 450 GSM Quilted Fabric with OEKO TEX CERTIFIED for premium durability'],
    image: await getImageAsset('products/ananda.webp'), images: [],
    tier: 'luxury', isBestseller: false, isFeatured: true, inStock: true, rating: 4.7, reviewCount: 620, sortOrder: 3,
    category: { _type: 'reference', _ref: 'cat-luxury' },
    seo: { metaTitle: 'Ananda 6" Pure Natural Latex Mattress | RelaxPro', metaDescription: 'Order the Ananda 6-inch solid natural latex mattress by RelaxPro.' },
  },
  {
    _id: 'product-prakriti', slug: { current: 'prakriti' },
    name: 'Prakriti', tagline: 'Comfort inspired by nature', subtitle: 'Breathe easy, sleep better with Prakriti latex mattress',
    keyBenefit: 'Eco-conscious design utilizing organic latex shredded elements bound in high-density core topped with pure organic latex comfort layer',
    description: 'Prakriti is our most eco-conscious design, featuring a dual-latex construction that upcycles shredded organic latex into a 4-inch high-density rebonded core, topped with 4 inches of pure GOLS-certified organic Kerala latex.',
    badge: 'Eco-Friendly Twin Latex Engineering', warranty: 10, comfortLevel: 'medium-soft', comfortRating: 4, totalThickness: 8,
    layers: [
      { thickness: 4, material: 'latex_rebonded', brand: 'RelaxPro Core Tech', certification: ['ECO-Institut'], description: '4" Eco-Dense Latex Rebonded Foam made of upcycled latex shreds' },
      { thickness: 4, material: 'latex', brand: 'RelaxPro Pure Organic', certification: ['GOLS'], description: '4" pure certified organic Kerala latex' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 44000, queen: 36500, double: 29000, single: 22000, diwan: 34000, custom: 0 }, withoutAccessories: { king: 39000, queen: 32500, double: 26000, single: 19500, diwan: 31000, custom: 0 } },
    features: ['Twin active latex components combine for uniform, cloud-like support with robust core endurance', '4" Eco-Dense latex rebonded base acts as a bouncy supportive core instead of conventional high-energy synthetic base foam', '4" pure Kerala top latex provides immediate luxurious contouring and comfort'],
    image: await getImageAsset('products/prakriti.webp'), images: [],
    tier: 'luxury', isBestseller: false, isFeatured: false, inStock: true, rating: 4.7, reviewCount: 340, sortOrder: 4,
    category: { _type: 'reference', _ref: 'cat-luxury' },
    seo: { metaTitle: 'Prakriti 8" Natural & Eco-Rebonded Latex Mattress | RelaxPro', metaDescription: 'Discover the Prakriti 8-inch natural latex mattress with eco-rebonded core.' },
  },
  {
    _id: 'product-somya', slug: { current: 'somya' },
    name: 'Somya', tagline: 'Soft, Gentle comfort that your body will love', subtitle: 'Sleep peacefully with Somya — Natural latex mattress',
    keyBenefit: 'Triple-layer design featuring ultra-plush resilient softy foam nested under premium pure latex to cradle heavy pressure points with heavy-duty rebonded support below',
    description: 'Somya is a thoughtfully engineered 10-inch triple-layer mattress that delivers an exceptionally soft surface feel without compromising on deep support. Starting with a 4-inch Century extra-firm rebonded base for rigid spinal alignment, it adds a 2-inch layer of premium highly resilient softy cushioning foam that acts as a gentle transition zone.',
    badge: 'Soft Contouring Orthopedic Hybrid', warranty: 10, comfortLevel: 'medium-soft', comfortRating: 4, totalThickness: 10,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century Extra-Firm', description: '4" Rebonded Foam with 90 to 95 Density (Century brand)' },
      { thickness: 2, material: 'hr_softy_foam', brand: 'Century AirFlow', description: '2" Premium Highly Resilient Softy Cushioning Foam' },
      { thickness: 4, material: 'latex', brand: 'RelaxPro Pure Organic', certification: ['GOLS'], description: '4" Pure Certified Organic Kerala Latex' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 41000, queen: 34000, double: 27000, single: 20500, diwan: 34000, custom: 0 }, withoutAccessories: { king: 36000, queen: 30000, double: 24000, single: 18000, diwan: 31000, custom: 0 } },
    features: ['Advanced 3-tier build that balances extreme surface soft comfort and rigid physical alignment', '4 inches of dense latex on top delivers immediate muscle easing properties', '2" HR softy foam transition layer eliminates joint pressure spikes from the hard base element', '4" century 90-95 density rebond keeps the spine in strict medical alignment'],
    image: await getImageAsset('products/somya.webp'), images: [],
    tier: 'premium', isBestseller: true, isFeatured: true, inStock: true, rating: 4.6, reviewCount: 720, sortOrder: 5,
    category: { _type: 'reference', _ref: 'cat-premium' },
    seo: { metaTitle: 'Somya 10" Natural Latex Comfort Mattress | RelaxPro', metaDescription: 'Shop Somya 10-inch mattress combining natural Kerala organic latex, plush HR soft foam, and sturdy rebonded base.' },
  },
  {
    _id: 'product-arogya', slug: { current: 'arogya' },
    name: 'Arogya', tagline: 'Health starts with good sleep', subtitle: 'Support your body naturally with Arogya latex mattress',
    keyBenefit: 'Perfect equal split of supportive heavy rebond base foam and cushioning latex, optimized for posture relief and corrective orthopedic support',
    description: 'Arogya is a perfectly balanced 8-inch mattress that splits evenly between support and comfort — 4 inches of Century high-firm rebonded foam paired with 4 inches of GOLS-certified organic Kerala latex.',
    badge: 'Doctor Recommended Ortho Core', warranty: 10, comfortLevel: 'medium-firm', comfortRating: 4, totalThickness: 8,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century High Firm', description: '4" Rebonded Support Foam with 90 to 95 Density' },
      { thickness: 4, material: 'latex', brand: 'RelaxPro GOLS Organic', certification: ['GOLS'], description: '4" Certified Organic Kerala Latex Core' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 38000, queen: 31500, double: 26000, single: 19000, diwan: 34000, custom: 0 }, withoutAccessories: { king: 33000, queen: 27500, double: 23000, single: 16500, diwan: 31000, custom: 0 } },
    features: ['50/50 balance engineering specifically configured for chronic lower back and spinal recovery', 'Substantial 4" pure Kerala natural latex gives correct support for standard hip/shoulder pressure zones', 'Durable orthopedic rebonded block distributes skeletal loads evenly, promoting healthier sleep postures'],
    image: await getImageAsset('products/arogya.webp'), images: [],
    tier: 'premium', isBestseller: true, isFeatured: true, inStock: true, rating: 4.8, reviewCount: 910, sortOrder: 6,
    category: { _type: 'reference', _ref: 'cat-premium' },
    seo: { metaTitle: 'Arogya 8" Orthopedic Latex Mattress | RelaxPro', metaDescription: 'Configure Arogya 8" premium mattress with 4" GOLS latex and 4" high-density orthopedic rebond foam base.' },
  },
  {
    _id: 'product-shuddha', slug: { current: 'shuddha' },
    name: 'Shuddha', tagline: 'Pure sleep begins here', subtitle: 'Shuddha is made for those who choose natural comfort',
    keyBenefit: 'Slick low-profile layout combining an eco-dense rebonded latex base with a highly responsive pure latex sleep zone',
    description: 'Shuddha is a smart 6-inch low-profile mattress that proves big comfort comes in compact packages. It pairs a 4-inch layer of 120-density latex rebonded foam with a 2-inch top layer of pure certified organic Kerala latex.',
    badge: 'Optimal Height Natural Comfort', warranty: 10, comfortLevel: 'medium', comfortRating: 4, totalThickness: 6,
    layers: [
      { thickness: 4, material: 'latex_rebonded', brand: 'RelaxPro Eco Core', description: '4" Latex Rebonded Foam with Eco GOLS shredded materials (120 Density)' },
      { thickness: 2, material: 'latex', brand: 'RelaxPro Certified Organic', certification: ['GOLS'], description: '2" Pure Certified Organic Kerala Latex' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 33000, queen: 27500, double: 22000, single: 16500, diwan: 34000, custom: 0 }, withoutAccessories: { king: 28000, queen: 23500, double: 19000, single: 14500, diwan: 31000, custom: 0 } },
    features: ['Engineered with advanced upcycled latex-bonded material preserving high durability at a smart cost', '2" top of organic natural latex adds that signature luxury spring-back comfort', '120-density core provides high load distribution, preventing that sunken trapped feel'],
    image: await getImageAsset('products/shuddha.webp'), images: [],
    tier: 'premium', isBestseller: false, isFeatured: false, inStock: true, rating: 4.5, reviewCount: 280, sortOrder: 7,
    category: { _type: 'reference', _ref: 'cat-premium' },
    seo: { metaTitle: 'Shuddha 6" Premium Pure Latex Hybrid Mattress | RelaxPro', metaDescription: 'Buy Shuddha 6-inch premium mattress with natural latex and eco-dense rebond latex block.' },
  },
  {
    _id: 'product-sthira', slug: { current: 'sthira' },
    name: 'Sthira', tagline: 'Strong support for deep sleep', subtitle: 'Firm, Stable comfort with Sthira latex mattress',
    keyBenefit: 'Highly requested firm orthopedic model packing a dense base with a high-tensile latex layer, designed specifically to address chronic posture issues',
    description: 'Sthira is our firmest orthopedic mattress, designed for those who need maximum structural support to correct chronic posture issues. It combines a dense 4-inch Century 95-density rebonded base with a 2-inch layer of pure GOLS-certified organic Kerala latex.',
    badge: 'Perfect Firm Extra-Support Ortho', warranty: 10, comfortLevel: 'firm', comfortRating: 5, totalThickness: 6,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century 95 Density Ortho', description: '4" Rebonded Support Foam with 90 to 95 Density (Century brand)' },
      { thickness: 2, material: 'latex', brand: 'RelaxPro GOLS Certified', certification: ['GOLS'], description: '2" pure certified organic Kerala latex' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 27000, queen: 22500, double: 18000, single: 13500, diwan: 34000, custom: 0 }, withoutAccessories: { king: 22000, queen: 18500, double: 15000, single: 11000, diwan: 31000, custom: 0 } },
    features: ['Firm orthopedic configuration that corrects bad sleeping habits and stabilizes the lumbar spine', '4" ultra-high density Century orthopedic foam block prevents any structural deflection', '2" true pure latex on top adds necessary gentle cushioning so hips and shoulders do not ache'],
    image: await getImageAsset('products/sthira.webp'), images: [],
    tier: 'premium', isBestseller: true, isFeatured: true, inStock: true, rating: 4.9, reviewCount: 1500, sortOrder: 8,
    category: { _type: 'reference', _ref: 'cat-premium' },
    seo: { metaTitle: 'Sthira 6" Firm Orthopedic Latex Mattress | RelaxPro', metaDescription: 'Shop Sthira 6-inch extra supportive firm mattress. Features 4" heavy rebonded base and 2" organic latex topper.' },
  },
  {
    _id: 'product-bhumi', slug: { current: 'bhumi' },
    name: 'Bhumi', tagline: 'Strong Stable Support Inspired by the Earth', subtitle: 'Experience balanced sleep with Bhumi latex mattress',
    keyBenefit: 'Triple-firm hybrid stacking rebonded base, latex-rebonded core, and luxurious latex cover for layered structural support inspired by organic earth strata',
    description: 'Bhumi takes inspiration from the earth\'s geological layers, stacking three distinct support zones for a progressively firm feel that adapts to your body weight.',
    badge: 'Multi-Adaptive Posture Layering', warranty: 10, comfortLevel: 'medium-firm', comfortRating: 4, totalThickness: 8,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century PU Rebonded', description: '4" PU Rebonded Support Base (Century Brand)' },
      { thickness: 2, material: 'latex_rebonded', brand: 'RelaxPro Eco Core', description: '2" Latex Rebonded Cushioning transition layer (120 Density)' },
      { thickness: 2, material: 'latex', brand: 'RelaxPro Pure Organic', certification: ['GOLS'], description: '2" Pure Certified Organic Kerala Latex' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 33000, queen: 27500, double: 22000, single: 16500, diwan: 34000, custom: 0 }, withoutAccessories: { king: 28000, queen: 23500, double: 19000, single: 14500, diwan: 31000, custom: 0 } },
    features: ['Layered progressive firmness: gets firmer as more compression force is applied', 'Combination of raw polyurethane rebond, eco latex rebond, and classic virgin latex sap sheets', 'Helps back-sleepers keep their pelvis neutral and chest chest-aligned'],
    image: await getImageAsset('products/bhumi.webp'), images: [],
    tier: 'premium', isBestseller: false, isFeatured: false, inStock: true, rating: 4.6, reviewCount: 410, sortOrder: 9,
    category: { _type: 'reference', _ref: 'cat-premium' },
    seo: { metaTitle: 'Bhumi 8" Triple-Core Hybrid Latex Mattress | RelaxPro', metaDescription: 'Unlock restorative sleep with Bhumi 8-inch mattress. Advanced triple core.' },
  },
  {
    _id: 'product-sunidra', slug: { current: 'sunidra' },
    name: 'Sunidra', tagline: 'Sleep Deeper, Wake Refreshed', subtitle: 'Experience peaceful nights with Sunidra latex mattress',
    keyBenefit: 'Three-layer premium hybrid with cooling soft transition elements, delivering reliable medium comfort suitable for all types of sleepers',
    description: 'Sunidra is our universal medium-comfort mattress, engineered to please side, back, and stomach sleepers alike. Its 8-inch profile layers a 4-inch Century high-firm rebonded base, a 2-inch premium HR softy transition foam, and a 2-inch pure GOLS-certified organic Kerala latex top.',
    badge: 'Universal Medium All-Rounder', warranty: 10, comfortLevel: 'medium', comfortRating: 4, totalThickness: 8,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century High Firm', description: '4" Rebonded Base Foam with 90 to 95 Density' },
      { thickness: 2, material: 'hr_softy_foam', brand: 'Century AirFlow Softy', description: '2" Premium HR Softy transition foam' },
      { thickness: 2, material: 'latex', brand: 'RelaxPro Certified Organic', certification: ['GOLS'], description: '2" Pure Certified Organic Kerala Latex' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 30000, queen: 25000, double: 20000, single: 15000, diwan: 34000, custom: 0 }, withoutAccessories: { king: 25000, queen: 21000, double: 17000, single: 12500, diwan: 31000, custom: 0 } },
    features: ['Universal comfort profile that adapts effortlessly to side, back, and stomach sleepers', '2" GOLS certified top natural latex delivers excellent active pressure point reduction', 'Middle 2" highly resilient softy foam cushions sensitive areas like collarbones and tailbones'],
    image: await getImageAsset('products/sunidra.webp'), images: [],
    tier: 'comfort', isBestseller: false, isFeatured: true, inStock: true, rating: 4.5, reviewCount: 530, sortOrder: 10,
    category: { _type: 'reference', _ref: 'cat-comfort' },
    seo: { metaTitle: 'Sunidra 8" Universal Latex Comfort Mattress | RelaxPro', metaDescription: 'Buy Sunidra 8-inch medium comfort mattress by RelaxPro.' },
  },
  {
    _id: 'product-vishram', slug: { current: 'vishram' },
    name: 'Vishram', tagline: 'Rest, Relaxation, Complete Ease', subtitle: 'Vishram designed for true rest and deep relaxation',
    keyBenefit: 'Sleek entry-level latex hybrid focusing on value, blending standard cushioning transition foam with a genuine touch of natural latex comfort',
    description: 'Vishram is our most accessible latex hybrid, designed as the perfect introduction to natural latex sleep without the premium price tag. At 7 inches, it stacks a 4-inch Century high-density rebonded support base, a 2-inch highly responsive HR softy foam transition layer, topped with a 1-inch pure GOLS-certified organic Kerala latex sheet.',
    badge: 'Great Value Sleep Solution', warranty: 10, comfortLevel: 'medium', comfortRating: 3, totalThickness: 7,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century High Density', description: '4" Rebonded support base (95 density)' },
      { thickness: 2, material: 'hr_softy_foam', brand: 'Century Softy', description: '2" highly responsive HR softy foam' },
      { thickness: 1, material: 'latex', brand: 'RelaxPro Organic Sheet', certification: ['GOLS'], description: '1" Pure Certified Organic Kerala Latex Sheet' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['GOLS', 'Oeko-Tex'], accessories: ['2 Latex Pillows', '1 Protector'],
    pricingModel: 'with_without_accessories',
    pricing: { withAccessories: { king: 24000, queen: 20000, double: 18000, single: 12000, diwan: 34000, custom: 0 }, withoutAccessories: { king: 19000, queen: 16000, double: 13000, single: 9500, diwan: 31000, custom: 0 } },
    features: ['Affordable entry layer to the luxurious universe of raw natural latex sleep', '1" organic Kerala latex sheet blocks thermal heat pockets of the base foams', '2" HR soft pillow cushioning transitions body lines smoothly onto the base layer'],
    image: await getImageAsset('products/vishram.webp'), images: [],
    tier: 'comfort', isBestseller: false, isFeatured: false, inStock: true, rating: 4.4, reviewCount: 380, sortOrder: 11,
    category: { _type: 'reference', _ref: 'cat-comfort' },
    seo: { metaTitle: 'Vishram 7" Hybrid Value Latex Mattress | RelaxPro', metaDescription: 'Experience Vishram 7" mattress with 4" Century rebond, 2" softy cushioning, and 1" raw natural latex.' },
  },
  {
    _id: 'product-ojas', slug: { current: 'ojas' },
    name: 'Ojas', tagline: 'Wake up refreshed and energised every morning', subtitle: 'Feel the power of natural sleep with Ojas ortho mattress',
    keyBenefit: 'Value orthopedic mattress without natural latex, utilizing high density resilience softy core for back safety and deep recovery at an accessible price',
    description: 'Ojas proves that exceptional orthopedic support does not require natural latex. This 6-inch mattress pairs a 4-inch ultra-firm Century Ortho rebonded base with a 2-inch highly resilient HR softy foam top layer.',
    badge: 'Best Ortho Value Mattress', warranty: 10, comfortLevel: 'firm', comfortRating: 3, totalThickness: 6,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century Ortho', description: '4" Ultra-Firm Rebonded Support base foam' },
      { thickness: 2, material: 'hr_softy_foam', brand: 'Century Responsive', description: '2" highly responsive high-resilience softy foam' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['Oeko-Tex'], accessories: ['2 Shredded Pillows', '1 Protector'],
    pricingModel: 'fabric_options',
    pricing: { fabric300Gsm: { king: 13000, queen: 11000, double: 8500, single: 6500, diwan: 9500, custom: 0 }, fabric450Gsm: { king: 15000, queen: 12500, double: 10000, single: 7500, diwan: 11500, custom: 0 } },
    features: ['Tailored for budgets looking for robust spine stabilization without latex premium tags', 'Dual foam profile: 4" highly dense rebond base with heavy 2" soft resilience topper', 'Aero-ventilation channels promote passive heat dissipation'],
    image: await getImageAsset('products/ojas.webp'), images: [],
    tier: 'comfort', isBestseller: false, isFeatured: false, inStock: true, rating: 4.3, reviewCount: 650, sortOrder: 12,
    category: { _type: 'reference', _ref: 'cat-comfort' },
    seo: { metaTitle: 'Ojas Ortho Value Mattress - Standard & Quilted Covers | RelaxPro', metaDescription: 'Buy Ojas 6" Orthopedic mattress. Tailored with density transitions for spine safety.' },
  },
  {
    _id: 'product-ayushrest', slug: { current: 'ayushrest' },
    name: 'AyushRest', tagline: 'Sleep built to last', subtitle: 'Long-term comfort with AyushRest ortho mattress',
    keyBenefit: 'Heavy-duty 8" triple density orthopedic foam mattress featuring customized comfort zones to safely distribute skeletal weight and prevent pressure spots',
    description: 'AyushRest is our most robust all-foam orthopedic mattress, featuring a heavy-duty 8-inch triple-density construction designed for long-term durability and pressure-free sleep.',
    badge: 'Tough Long-Life Ortho Choice', warranty: 10, comfortLevel: 'firm', comfortRating: 4, totalThickness: 8,
    layers: [
      { thickness: 4, material: 'rebonded_foam', brand: 'Century Heavy Ortho', description: '4" Extra Density Rebonded Base Foam' },
      { thickness: 2, material: 'hr_foam', brand: 'Century Ortho HR', description: '2" High-Resilience Firm Orthopedic Support Foam' },
      { thickness: 2, material: 'hr_softy_foam', brand: 'Century Softy Cushion', description: '2" Super Soft Cushioning HR Softy Foam' },
    ],
    fabricGsm: 400, fabricType: '400 to 450 GSM Quilted Fabric with OEKO TEX Certified Fabric',
    certifications: ['Oeko-Tex'], accessories: ['2 Shredded Pillows', '1 Protector'],
    pricingModel: 'fabric_options',
    pricing: { fabric300Gsm: { king: 16000, queen: 13500, double: 10500, single: 8000, diwan: 9500, custom: 0 }, fabric450Gsm: { king: 18000, queen: 15500, double: 12000, single: 9000, diwan: 11500, custom: 0 } },
    features: ['Thick 8" orthopedic profile without latex, packing three distinct posture layers', 'Heavy-duty 4" rebound base combined with central 2" structured orthopedic HR density', 'Crowned with a plush 2" Century softy cushion, preventing skin or bone pressure sores'],
    image: await getImageAsset('products/ayushrest.webp'), images: [],
    tier: 'comfort', isBestseller: false, isFeatured: false, inStock: true, rating: 4.4, reviewCount: 420, sortOrder: 13,
    category: { _type: 'reference', _ref: 'cat-comfort' },
    seo: { metaTitle: 'AyushRest 8" Orthopedic Foam Mattress | RelaxPro', metaDescription: 'Explore the AyushRest 8" orthopedic mattress by RelaxPro.' },
  },
]

// Gallery images for products
for (const prod of PRODUCTS_DATA) {
  const gallery = []
  for (let i = 1; i <= 10; i++) {
    const asset = await getImageAsset(`products/${prod.slug.current}-gallery-${i}.webp`)
    if (asset) gallery.push(asset)
  }
  if (gallery.length > 0) prod.images = gallery
}

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { _id: 'testimonial-gm-1', customerName: 'Srinivas Rao', location: 'Hyderabad', rating: 5, quote: 'Buying the Nirvana mattress was the best decision for my chronic lower back issues. The 7-Zone support works like a charm. Absolutely highly recommended!', isVerified: true, featured: true, order: 1, productPurchased: { _type: 'reference', _ref: 'product-nirvana' } },
  { _id: 'testimonial-gm-2', customerName: 'Anvitha Reddy', location: 'Bangalore', rating: 5, quote: 'We got the Amrita mattress 6 months ago. Incredible comfort. It isolates motion perfectly; I do not feel my husband tossing and turning at all. The direct factory price represents fantastic value.', isVerified: true, featured: true, order: 2, productPurchased: { _type: 'reference', _ref: 'product-amrita' } },
  { _id: 'testimonial-gm-3', customerName: 'Rajendra Prasad', location: 'Rajahmundry', rating: 5, quote: 'Sthira is perfect for those who want a firm but very comfortable orthopedic feel. Suresh the manufacturer explained the layers clearly. Excellent customer service!', isVerified: true, featured: true, order: 3, productPurchased: { _type: 'reference', _ref: 'product-sthira' } },
  { _id: 'testimonial-gm-4', customerName: 'Deepak Sharma', location: 'Hyderabad', rating: 5, quote: 'I am amazed by the Custom Mattress builder! I configured a custom 10-inch mattress with 5 inches of raw Kerala latex and it was delivered within 6 days. Best sleep ever.', isVerified: true, featured: true, order: 4 },
  { _id: 'testimonial-gm-5', customerName: 'Priya Singh', location: 'Chennai', rating: 5, quote: 'The Arogya mattress has completely transformed my sleep. My back pain has reduced significantly since switching to natural latex. Highly recommend!', isVerified: true, featured: true, order: 5 },
]

// ─── FAQS ───────────────────────────────────────────────────────────────────
const FAQS = [
  { _id: 'faq-q1', question: 'What makes RelaxPro mattresses different from other brands?', answer: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'RelaxPro mattresses are handcrafted using 100% GOLS-certified natural Dunlop latex sourced directly from Kerala plantations. Unlike most brands that use synthetic latex or polyurethane foam with a thin latex layer, our mattresses feature solid natural latex cores with zero chemical fillers. We manufacture directly at our factory in Jeedimetla, Hyderabad, which eliminates middlemen and allows us to offer premium quality at factory-direct prices.' }] }], category: 'General', order: 1 },
  { _id: 'faq-q2', question: 'Are RelaxPro mattresses good for back pain?', answer: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Yes. Our natural latex mattresses are recommended by orthopedic specialists for back pain relief. The open-cell latex structure conforms to your body\'s natural curves while providing the responsive support needed for proper spinal alignment. Unlike memory foam that can trap heat and cause you to sink into poor posture, latex gently pushes back, keeping your spine neutral throughout the night.' }] }], category: 'General', order: 2 },
  { _id: 'faq-q3', question: 'How long does delivery take?', answer: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'We deliver within 5-7 business days for all standard mattress orders across India. Each mattress is handcrafted fresh after you place your order. We offer free white-glove delivery to major cities including Hyderabad, Bangalore, Chennai, and Rajahmundry. For custom builder orders, please allow 7-10 business days.' }] }], category: 'Shipping', order: 3 },
  { _id: 'faq-q4', question: 'Do you offer a trial period?', answer: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Absolutely. Every RelaxPro mattress comes with a 100-night sleep trial. If you are not completely satisfied within the first 100 nights, we will arrange free pickup and provide a full refund. No restocking fees, no hidden charges.' }] }], category: 'Warranty', order: 4 },
  { _id: 'faq-q5', question: 'What certifications do RelaxPro mattresses have?', answer: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Our products carry GOLS (Global Organic Latex Standard) certification for organic latex purity, Oeko-Tex Standard 100 for fabric safety, ECO-Institut certification for environmental compatibility, and FSC certification for sustainable wood sourcing. We are also ISO 9001 certified for quality management.' }] }], category: 'General', order: 5 },
  { _id: 'faq-q6', question: 'Can I customize the thickness or firmness?', answer: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Yes! Use our Custom Mattress Builder tool to select your preferred thickness from 4 to 10 inches, choose between soft, medium, or firm comfort levels, pick your cover fabric (300 GSM or 450 GSM), and even mix different latex densities for a personalized sleep surface.' }] }], category: 'Custom', order: 6 },
  { _id: 'faq-q7', question: 'WhatsApp number for orders and inquiries?', answer: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'You can reach us directly on WhatsApp at +91 86866 24494. Our founder Suresh personally handles all orthopedic consultations and can help you select the perfect mattress based on your sleep posture, body weight, and medical history.' }] }], category: 'Contact', order: 7 },
  { _id: 'faq-q8', question: 'Where are your showrooms located?', answer: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'We have three experience centers: Hyderabad Factory Showroom in Jeedimetla Industrial Area, Rajahmundry Experience Store on Danavaipeta Mall Road, and Bangalore Partner Store in Indiranagar. Visit any location to test our full range of mattresses in person.' }] }], category: 'Locations', order: 8 },
]

// ─── SHOWROOMS ──────────────────────────────────────────────────────────────
const SHOWROOMS = [
  { _id: 'shw-hyd', city: 'Hyderabad', address: 'RelaxPro Factory Showroom, Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana - 500055', phones: ['+918686624494', '+917207424494'], hours: 'Mon - Sun: 10:00 AM - 9:00 PM', order: 1 },
  { _id: 'shw-rjy', city: 'Rajahmundry', address: 'RelaxPro Experience Store, Danavaipeta Mall Road, Opposite Municipal Complex, Rajahmundry, Andhra Pradesh - 533103', phones: ['+918686624494'], hours: 'Mon - Sat: 10:00 AM - 8:30 PM, Sun: 11:00 AM - 7:00 PM', order: 2 },
  { _id: 'shw-blr', city: 'Bangalore', address: 'RelaxPro Partner Store, Indiranagar 100 Feet Road, Near Halasuru Metro Station, Bangalore, Karnataka - 560038', phones: ['+917207424494'], hours: 'Mon - Sun: 10:30 AM - 8:30 PM', order: 3 },
]

// ─── SITE SETTINGS ──────────────────────────────────────────────────────────
const SITE_SETTINGS = {
  _id: 'siteSettings',
  branding: { siteName: 'RelaxPro Premium Mattresses', tagline: '100% Natural Organic Latex Mattresses — Direct from Kerala Factory', logo: null, favicon: null },
  contactInfo: { mainPhone: '8686624494', secondaryPhone: '9642024494', whatsappNumber: '918686624494', whatsappDefaultMessage: 'Hello Suresh, I am visiting the RelaxPro Mattress website and would like a specialized orthopedic mattress advice. Please guide me!', email: 'relaxpro2022@gmail.com', factoryAddress: 'RelaxPro Factory, Jeedimetla Industrial Area, Phase 3, Hyderabad, Telangana - 500055' },
  announcement: { showBanner: true, bannerText: 'Telangana & AP\'s 1st Pure Latex Mattress Company * GOLS Certified Organic Latex * Direct Factory Pricing * Free Delivery', bannerColor: 'green' },
  footer: { description: 'Leading natural latex mattress manufacturer in Andhra Pradesh and Telangana. Handcrafted from 100% GOLS certified Dunlop rubber latex sourced directly from Kerala. Factory-direct pricing with zero middlemen.', certifications: [{ name: '10-Year Factory Replacement Warranty' }, { name: 'Direct From Kerala * No Middleman' }, { name: 'Free Doorstep Shipping To Major Cities' }], socialLinks: [{ platform: 'Facebook', url: 'https://www.facebook.com/p/Relaxpro-Mattresses-100069671211998/' }, { platform: 'Instagram', url: 'https://www.instagram.com/relaxpro__mattresses/?hl=en' }, { platform: 'YouTube', url: 'https://www.youtube.com/@sureshmattressmanufacturer3784' }] },
  seo: { metaTitle: 'RelaxPro Premium Mattresses | 100% Natural Organic Latex India', metaDescription: 'India\'s premium natural latex mattress manufacturer. GOLS certified organic Kerala latex. Direct factory pricing, 10-year warranty, free delivery. Visit our Hyderabad showroom.' },
}

// ─── HOME ───────────────────────────────────────────────────────────────────
const HOME = {
  _id: 'home',
  bestsellersSection: { sectionTitle: 'Best Selling Models', products: [{ _type: 'reference', _ref: 'product-nirvana' }, { _type: 'reference', _ref: 'product-amrita' }, { _type: 'reference', _ref: 'product-somya' }, { _type: 'reference', _ref: 'product-arogya' }, { _type: 'reference', _ref: 'product-sthira' }, { _type: 'reference', _ref: 'product-sunidra' }] },
  testimonialsSection: { sectionTitle: 'What Our Customers Say', overallRating: '4.9', totalReviews: '2,400+', testimonials: [{ _type: 'reference', _ref: 'testimonial-gm-1' }, { _type: 'reference', _ref: 'testimonial-gm-2' }, { _type: 'reference', _ref: 'testimonial-gm-3' }, { _type: 'reference', _ref: 'testimonial-gm-4' }, { _type: 'reference', _ref: 'testimonial-gm-5' }] },
  faqSection: { faqs: [{ _type: 'reference', _ref: 'faq-q1' }, { _type: 'reference', _ref: 'faq-q2' }, { _type: 'reference', _ref: 'faq-q3' }, { _type: 'reference', _ref: 'faq-q4' }, { _type: 'reference', _ref: 'faq-q5' }, { _type: 'reference', _ref: 'faq-q6' }, { _type: 'reference', _ref: 'faq-q7' }, { _type: 'reference', _ref: 'faq-q8' }] },
  allShowroomsSection: { showrooms: [{ _type: 'reference', _ref: 'shw-hyd' }, { _type: 'reference', _ref: 'shw-rjy' }, { _type: 'reference', _ref: 'shw-blr' }] },
  shopByBrands: { categories: [{ _type: 'reference', _ref: 'cat-luxury' }, { _type: 'reference', _ref: 'cat-premium' }, { _type: 'reference', _ref: 'cat-comfort' }] },
}

// ─── ABOUT ──────────────────────────────────────────────────────────────────
const ABOUT = {
  _id: 'about',
  hero: { title: 'Our Story', subtitle: 'Handcrafting Kerala\'s Finest Natural Latex Mattresses Since 2015' },
  ourStory: { heading: 'From Kerala Plantations to Your Bedroom', body: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'RelaxPro was born from a simple belief: that everyone deserves access to pure, chemical-free sleep. Founded by Suresh, a mattress manufacturer with deep roots in Kerala\'s natural rubber industry, our journey began in a small workshop in Hyderabad\'s Jeedimetla industrial area. Today, we are recognized as Telangana and Andhra Pradesh\'s first dedicated natural latex mattress company.' }] }, { _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Unlike mass-produced mattresses that rely on synthetic foams and adhesives, every RelaxPro mattress is handcrafted using 100% natural Dunlop latex sourced directly from GOLS-certified organic plantations in Kerala. Our direct-to-consumer model means you get premium quality at factory prices — no middlemen, no markup.' }] }] },
  ourProcess: { heading: 'How We Craft Your Mattress', steps: [{ title: 'Sap Harvesting', description: 'Raw latex sap is tapped from certified organic rubber trees in Kerala under strict GOLS guidelines.' }, { title: 'Dunlop Processing', description: 'The sap is whipped into a froth and poured into molds. No synthetic fillers or chemicals are added.' }, { title: 'Vulcanization', description: 'The latex is baked at high temperatures to set its cellular structure, creating the signature open-cell breathability.' }, { title: 'Hand Assembly', description: 'Latex cores are precision-cut and layered with certified fabrics. Each mattress is inspected by Suresh personally.' }, { title: 'Compression & Packing', description: 'Your mattress is vacuum-compressed for easy shipping, rolled, and shipped directly to your doorstep.' }] },
  seo: { metaTitle: 'About RelaxPro | Natural Latex Mattress Manufacturer India', metaDescription: 'Learn about RelaxPro\'s journey crafting premium GOLS-certified natural latex mattresses directly from our Hyderabad factory.' },
}

// ─── CONTACT ────────────────────────────────────────────────────────────────
const CONTACT = {
  _id: 'contact',
  heading: 'Submit Your Sleep Concern',
  description: 'Share your posture, pain, size, and comfort needs. Suresh or a senior consultant personally reviews every submission and calls back at your preferred time.',
  seo: { metaTitle: 'Contact RelaxPro | Get Orthopedic Mattress Advice', metaDescription: 'Contact RelaxPro for expert orthopedic mattress consultation. WhatsApp or call for personalized advice on natural latex mattresses.' },
}

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
const NAVIGATION = {
  _id: 'navigation',
  title: 'Main Navigation',
  desktopMenu: [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/catalog', children: [{ label: 'Explore Collections', path: '/catalog', description: 'Browse all mattress models' }, { label: 'Compare Models', path: '/compare', description: 'Side-by-side comparison' }] },
    { label: 'Customize', path: '/builder', isCta: false },
    { label: 'Compare', path: '/compare' },
    { label: 'Sleep Science', path: '/science' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
    { label: 'Shop Now', path: '/catalog', isCta: true },
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
    { heading: 'Quick Links', links: [{ label: 'Home', path: '/' }, { label: 'Shop All', path: '/catalog' }, { label: 'Customize', path: '/builder' }, { label: 'Sleep Science', path: '/science' }, { label: 'About Us', path: '/about' }] },
    { heading: 'Customer Care', links: [{ label: 'Contact Us', path: '/contact' }, { label: 'Store Locations', path: '/locations' }, { label: 'Sleep Education', path: '/science' }] },
  ],
}

// ─── HERO ───────────────────────────────────────────────────────────────────
const HERO_SLIDES = {
  _id: 'hero',
  title: 'Homepage Hero',
  slides: [{
    image: await getImageAsset('hero-bedroom.png'),
    badge: 'Handcrafted Dunlop Latex Since 2015',
    heading: 'Pure Natural Latex,',
    highlight: 'From Kerala',
    subheading: 'to Your Bed',
    description: 'GOLS-certified organic latex, zero synthetic fillers or cancer-causing VOCs. Handcrafted in Hyderabad and shipped directly to your doorstep.',
    trustBadges: [{ text: 'Free Delivery' }, { text: '10-Year Replacement Warranty' }],
  }],
}

// ─── SLEEP SCIENCE ──────────────────────────────────────────────────────────
const SLEEP_SCIENCE = {
  _id: 'sleepScience',
  title: 'Sleep Science',
  badge: 'PHYSIOLOGICAL WELLNESS DATABASE',
  heading: 'The Science of Sleep Orthopedics',
  intro: 'Understanding how your mattress interacts with your body\'s natural alignment is the first step toward better sleep. Our natural latex technology is backed by physiological research.',
  tabs: [
    { label: 'Dunlop Latex vs Foam', content: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Natural latex offers superior pressure relief, temperature regulation, and durability compared to memory foam or polyurethane foam.' }] }] },
    { label: 'Spine Alignment', content: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'The responsive push-back of natural latex keeps your spine in neutral alignment throughout the night, reducing pressure points.' }] }] },
    { label: 'Certified Organic', content: [{ _type: 'block', style: 'normal', children: [{ _type: 'span', text: 'Our GOLS and Oeko-Tex certifications guarantee zero harmful chemicals in your sleep environment.' }] }] },
  ],
  ctaBadge: 'FACTORY DIRECT ASSURANCE',
  ctaHeading: 'Choose the mattress designed for your back',
  ctaDescription: 'Compare all 13 models side by side and find your perfect match.',
  ctaLabel: 'Compare All 13 Models',
  ctaLink: '/compare',
}

// ─── EXECUTION ──────────────────────────────────────────────────────────────
async function main() {
  console.log('Starting seed...\n')

  console.log('── Categories ──')
  for (const c of CATEGORIES) await upsert('brandCategory', c)

  console.log('\n── Products ──')
  for (const p of PRODUCTS_DATA) await upsert('product', p)

  console.log('\n── Testimonials ──')
  for (const t of TESTIMONIALS) await upsert('testimonial', t)

  console.log('\n── FAQs ──')
  for (const f of FAQS) await upsert('faq', f)

  console.log('\n── Showrooms ──')
  for (const s of SHOWROOMS) await upsert('showroom', s)

  console.log('\n── Site Settings ──')
  await upsert('siteSettings', SITE_SETTINGS)

  console.log('\n── Homepage ──')
  await upsert('home', HOME)

  console.log('\n── About ──')
  await upsert('about', ABOUT)

  console.log('\n── Contact ──')
  await upsert('contact', CONTACT)

  console.log('\n── Navigation ──')
  await upsert('navigation', NAVIGATION)

  console.log('\n── Hero ──')
  await upsert('hero', HERO_SLIDES)

  console.log('\n── Sleep Science ──')
  await upsert('sleepScience', SLEEP_SCIENCE)

  console.log('\n✅ Seed complete!')
}

main().catch(err => { console.error('\n❌ Seed failed:', err); process.exit(1) })
