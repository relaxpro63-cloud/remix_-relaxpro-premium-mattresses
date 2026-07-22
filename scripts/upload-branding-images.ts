/**
 * Upload Branding Images (Logo + Favicon) to Sanity
 *
 * Creates branded SVG logo and favicon based on the RelaxPro brand,
 * uploads them to Sanity as image assets, and patches the
 * siteSettings document with the references.
 *
 * Usage:
 *   SANITY_TOKEN=your_write_token npx tsx scripts/upload-branding-images.ts
 */
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IMAGES_DIR = path.resolve(PROJECT_ROOT, 'public/images')

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'de6mndac',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// ─── Logo SVG ──────────────────────────────────────────────────────────────
// Inspired by the RelaxProLogo.tsx component — full brand lock-up
const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 185" width="440" height="185">
  <defs>
    <style>
      .logo-letter { font-family: Georgia, 'Times New Roman', serif; font-weight: 900; font-size: 72px; fill: #1E1E1E; }
      .logo-pro { font-family: system-ui, -apple-system, sans-serif; font-weight: 900; font-size: 24px; fill: #2D8CFF; letter-spacing: 1px; }
      .logo-tagline-bg { fill: #1E1E1E; }
      .logo-tagline { font-family: Georgia, serif; font-style: italic; font-weight: bold; font-size: 11.5px; fill: #2D8CFF; text-anchor: middle; }
    </style>
  </defs>
  <text x="35" y="98" class="logo-letter">R</text>
  <text x="100" y="98" class="logo-letter">E</text>
  <text x="162" y="98" class="logo-letter">L</text>
  <text x="218" y="98" class="logo-letter">A</text>
  <text x="290" y="98" class="logo-letter">X</text>
  <!-- Bed icon -->
  <path d="M 211,44 L 239,20 L 267,44" stroke="#1E1E1E" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" fill="none"/>
  <rect x="254" y="24" width="6" height="12" fill="#1E1E1E"/>
  <rect x="235" y="29" width="8" height="8" rx="1.5" fill="none" stroke="#1E1E1E" stroke-width="1.5"/>
  <line x1="239" y1="29" x2="239" y2="37" stroke="#1E1E1E" stroke-width="1.2"/>
  <line x1="235" y1="33" x2="243" y2="33" stroke="#1E1E1E" stroke-width="1.2"/>
  <!-- Mattress springs -->
  <line x1="211" y1="72" x2="211" y2="92" stroke="#2D8CFF" stroke-width="3" stroke-linecap="round"/>
  <line x1="267" y1="72" x2="267" y2="92" stroke="#2D8CFF" stroke-width="3" stroke-linecap="round"/>
  <line x1="211" y1="81" x2="267" y2="81" stroke="#2D8CFF" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="218" y1="81" x2="218" y2="92" stroke="#2D8CFF" stroke-width="2.2"/>
  <line x1="260" y1="81" x2="260" y2="92" stroke="#2D8CFF" stroke-width="2.2"/>
  <rect x="216" y="75" width="13" height="5" rx="1" fill="#2D8CFF"/>
  <path d="M 218,75 Q 228,68 238,75 T 258,75" stroke="#2D8CFF" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.85"/>
  <!-- PRO badge -->
  <text x="348" y="52" class="logo-pro">PRO</text>
  <!-- Tagline -->
  <rect x="110" y="122" width="220" height="23" rx="11.5" class="logo-tagline-bg"/>
  <text x="220" y="137" class="logo-tagline">Sleep Better Wake Better</text>
  <text x="220" y="172" font-family="system-ui, -apple-system, sans-serif" font-weight="bold" font-size="10" fill="#4A5A57" text-anchor="middle" letter-spacing="1.2">MATTRESSES • SOFAS • INTERIORS</text>
</svg>`

// ─── Favicon SVG — simplified "R" mark ────────────────────────────────────
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="8" fill="#0F1F17"/>
  <text x="32" y="48" font-family="Georgia, 'Times New Roman', serif" font-weight="900" font-size="40" fill="#C9A87C" text-anchor="middle">R</text>
  <circle cx="32" cy="32" r="30" fill="none" stroke="#C9A87C" stroke-width="0.5" opacity="0.3"/>
  <rect x="19" y="25" width="26" height="3" rx="1.5" fill="#C9A87C" opacity="0.6"/>
  <rect x="19" y="36" width="26" height="3" rx="1.5" fill="#C9A87C" opacity="0.6"/>
  <line x1="32" y1="25" x2="32" y2="39" stroke="#C9A87C" stroke-width="1.5" opacity="0.4"/>
</svg>`

// ─── Save SVG to disk ──────────────────────────────────────────────────────
function saveSvg(filename: string, content: string): string {
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true })
  }
  const filePath = path.join(IMAGES_DIR, filename)
  fs.writeFileSync(filePath, content, 'utf-8')
  return filePath
}

// ─── Upload to Sanity ──────────────────────────────────────────────────────
async function uploadImage(filePath: string, label: string, alt: string): Promise<string | null> {
  try {
    const buffer = fs.readFileSync(filePath)
    const fileName = path.basename(filePath)
    const asset = await client.assets.upload('image', buffer, {
      filename: fileName,
      contentType: 'image/svg+xml',
      label: `${label} — ${fileName}`,
    })
    console.log(`  ✓ Uploaded: ${fileName} → ${asset._id}`)
    return asset._id
  } catch (err: any) {
    console.error(`  ✗ Failed to upload ${path.basename(filePath)}: ${err.message}`)
    return null
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────
async function main() {
  console.log('══════════════════════════════════════════════════')
  console.log('  RelaxPro — Upload Branding (Logo + Favicon)')
  console.log('══════════════════════════════════════════════════\n')

  if (!process.env.SANITY_TOKEN) {
    console.error('[ERROR] SANITY_TOKEN environment variable is required.')
    process.exit(1)
  }

  // 1. Generate SVG files
  console.log('[GENERATE] Creating logo and favicon SVGs...')
  const logoPath = saveSvg('relaxpro-logo.svg', LOGO_SVG)
  const faviconPath = saveSvg('relaxpro-favicon.svg', FAVICON_SVG)
  console.log(`  Logo:    ${logoPath}`)
  console.log(`  Favicon: ${faviconPath}\n`)

  // 2. Upload to Sanity
  console.log('[UPLOAD] Uploading to Sanity...')
  const logoAssetId = await uploadImage(logoPath, 'RelaxPro Brand Logo', 'RelaxPro Premium Mattresses Logo')
  const faviconAssetId = await uploadImage(faviconPath, 'RelaxPro Favicon', 'RelaxPro Favicon Icon')

  // 3. Fetch siteSettings
  console.log('\n[PATCH] Fetching siteSettings document...')
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ _id }`)

  if (!settings) {
    console.log('[SKIP] No siteSettings document found in Sanity.')
    return
  }

  // 4. Build patch
  const patch: Record<string, any> = {}
  if (logoAssetId) {
    patch['branding.logo'] = {
      _type: 'image',
      asset: { _type: 'reference', _ref: logoAssetId },
      alt: 'RelaxPro Premium Mattresses',
    }
  }
  if (faviconAssetId) {
    patch['branding.favicon'] = {
      _type: 'image',
      asset: { _type: 'reference', _ref: faviconAssetId },
    }
  }

  if (Object.keys(patch).length > 0) {
    const p = client.patch(settings._id).setIfMissing({ branding: {} })
    if (patch['branding.logo']) p.set({ 'branding.logo': patch['branding.logo'] })
    if (patch['branding.favicon']) p.set({ 'branding.favicon': patch['branding.favicon'] })
    await p.commit()
    console.log(`  ✓ Patched siteSettings (${settings._id}) with branding images\n`)
  } else {
    console.log('  — No branding images to patch\n')
  }

  // 5. Summary
  console.log('══════════════════════════════════════════════════')
  console.log('  Done!')
  console.log('══════════════════════════════════════════════════')
  console.log(`\nFiles saved locally:`)
  console.log(`  ${logoPath}`)
  console.log(`  ${faviconPath}`)
  console.log(`\nCheck Sanity Studio: siteSettings → Branding → Logo & Favicon\n`)
}

main().catch(err => {
  console.error('\n[FATAL]', err)
  process.exit(1)
})
