/**
 * Generate placeholder SVG images for products that have no local images.
 *
 * Creates branded SVGs in public/images/products/ for:
 *   Kshiti, Octavius, Prayag, Smrithi, Sukoon
 *
 * Usage: npx tsx scripts/generate-placeholder-images.ts
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PRODUCTS_DIR = path.resolve(PROJECT_ROOT, 'public/images/products')

interface MissingProduct {
  slug: string
  name: string
  tagline: string
  tier: 'luxury' | 'premium' | 'comfort'
}

const MISSING_PRODUCTS: MissingProduct[] = [
  { slug: 'kshiti',     name: 'Kshiti',     tagline: 'Ground your sleep in nature',               tier: 'premium' },
  { slug: 'octavius',   name: 'Octavius',   tagline: 'Eight layers of pure comfort',              tier: 'premium' },
  { slug: 'prayag',     name: 'Prayag',     tagline: 'Sacred sleep every night',                  tier: 'premium' },
  { slug: 'smrithi',    name: 'Smrithi',    tagline: 'Memory that cares for you',                 tier: 'comfort' },
  { slug: 'sukoon',     name: 'Sukoon',     tagline: 'Peaceful sleep for everyone',               tier: 'comfort' },
]

const TIER_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  luxury:  { bg: '#0F1F17', accent: '#C9A87C', text: '#F5F2EB' },
  premium: { bg: '#1A2E2A', accent: '#2D8CFF', text: '#F5F2EB' },
  comfort: { bg: '#2A3F3A', accent: '#5A8F7B', text: '#F5F2EB' },
}

function generateSvg(product: MissingProduct): string {
  const colors = TIER_COLORS[product.tier] || TIER_COLORS.premium
  const initials = product.name.charAt(0).toUpperCase()

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustColor(colors.bg, -20)};stop-opacity:1" />
    </linearGradient>
    <pattern id="dots" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)">
      <circle cx="2" cy="2" r="1" fill="${colors.accent}" opacity="0.08"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="url(#bg)" />
  <rect width="800" height="600" fill="url(#dots)" />

  <!-- Accent top line -->
  <rect x="0" y="0" width="800" height="3" fill="${colors.accent}" />

  <!-- Large initial letter -->
  <text x="400" y="280" text-anchor="middle"
        font-family="'Playfair Display', Georgia, serif"
        font-size="180" font-weight="400"
        fill="${colors.accent}" opacity="0.15">
    ${initials}
  </text>

  <!-- Product name -->
  <text x="400" y="310" text-anchor="middle"
        font-family="'Playfair Display', Georgia, serif"
        font-size="52" font-weight="700"
        fill="${colors.text}">
    ${product.name}
  </text>

  <!-- Tagline -->
  <text x="400" y="355" text-anchor="middle"
        font-family="'Plus Jakarta Sans', 'Helvetica Neue', Arial, sans-serif"
        font-size="18" font-weight="400" letter-spacing="1"
        fill="${colors.accent}" opacity="0.85">
    ${product.tagline}
  </text>

  <!-- Tier badge -->
  <rect x="300" y="390" width="200" height="32" rx="16"
        fill="${colors.accent}" opacity="0.15" />
  <text x="400" y="411" text-anchor="middle"
        font-family="'Plus Jakarta Sans', sans-serif"
        font-size="11" font-weight="700" letter-spacing="3"
        fill="${colors.accent}">
    ${product.tier.toUpperCase()} COLLECTION
  </text>

  <!-- Decorative line -->
  <line x1="250" y1="430" x2="550" y2="430"
        stroke="${colors.accent}" stroke-width="1" opacity="0.2" />

  <!-- Brand -->
  <text x="400" y="485" text-anchor="middle"
        font-family="'Plus Jakarta Sans', sans-serif"
        font-size="10" font-weight="300" letter-spacing="4"
        fill="${colors.text}" opacity="0.3">
    RELAXPRO PREMIUM MATTRESSES
  </text>
</svg>`
}

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xFF) + amount))
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xFF) + amount))
  const b = Math.max(0, Math.min(255, (num & 0xFF) + amount))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

function main() {
  console.log('══════════════════════════════════════════════════')
  console.log('  Generate Placeholder Images for Missing Products')
  console.log('══════════════════════════════════════════════════\n')

  if (!fs.existsSync(PRODUCTS_DIR)) {
    fs.mkdirSync(PRODUCTS_DIR, { recursive: true })
  }

  for (const product of MISSING_PRODUCTS) {
    const svgContent = generateSvg(product)
    const filePath = path.join(PRODUCTS_DIR, `${product.slug}.svg`)

    fs.writeFileSync(filePath, svgContent, 'utf-8')
    const size = fs.statSync(filePath).size

    console.log(`  ${product.name.padEnd(12)} → ${filePath}`)
    console.log(`  ${''.padEnd(12)}   ${(size / 1024).toFixed(1)} KB, SVG\n`)
  }

  console.log(`✅ Generated ${MISSING_PRODUCTS.length} placeholder SVGs in:`)
  console.log(`   ${PRODUCTS_DIR}\n`)
  console.log('Next: Run the upload script to push these to Sanity:')
  console.log('  SANITY_TOKEN=xxx npx tsx scripts/upload-product-images-to-sanity.ts\n')
}

main()
