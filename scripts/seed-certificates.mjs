/**
 * Seed Certificate PDF Links into Sanity siteSettings
 *
 * This script pushes the ISO, OEKO-TEX, and GOLS certificate PDF URLs
 * into the `certificates` array field of the siteSettings document.
 * After running, the certificate links can be managed from Sanity Studio.
 *
 * Usage:
 *   SANITY_TOKEN=your_write_token node scripts/seed-certificates.mjs
 */
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'de6mndac',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

const certificates = [
  {
    _key: 'iso',
    id: 'iso',
    title: 'ISO 9001:2015',
    subtitle: 'Quality Management System',
    description:
      'Certified Quality Management System ensuring consistent manufacturing processes, rigorous quality control, and internationally recognized production standards.',
    pdfUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/preview',
    validity: 'Valid — Audited Annually',
  },
  {
    _key: 'oeko',
    id: 'oeko',
    title: 'OEKO-TEX® STANDARD 100',
    subtitle: 'Textile Safety & Confidence',
    description:
      'Our certified fabrics are independently tested for harmful substances, providing safe, skin-friendly, and environmentally responsible sleep products.',
    pdfUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/preview',
    validity: 'Valid — Annual Renewal',
  },
  {
    _key: 'gols',
    id: 'gols',
    title: 'Global Organic Latex Standard',
    subtitle: 'GOLS Certified Organic',
    description:
      'Our organic latex components are certified under the Global Organic Latex Standard, ensuring sustainable sourcing, environmentally responsible manufacturing, and premium natural sleep comfort.',
    pdfUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/preview',
    validity: 'Valid — Organic Integrity Verified',
  },
]

async function main() {
  console.log('══════════════════════════════════════════════════')
  console.log('  Seed Certificate PDFs into Sanity')
  console.log('══════════════════════════════════════════════════\n')

  if (!process.env.SANITY_TOKEN) {
    console.error('[ERROR] SANITY_TOKEN environment variable is required.')
    process.exit(1)
  }

  // 1. Fetch existing siteSettings
  console.log('[FETCH] Looking up siteSettings document...')
  const settings = await client.fetch(`*[_type == "siteSettings"][0]{ _id, _rev }`)

  if (!settings) {
    console.log('[SKIP] No siteSettings document found in Sanity.')
    return
  }
  console.log(`  ✓ Found: ${settings._id} (rev: ${settings._rev})\n`)

  // 2. Patch the certificates field
  console.log('[PATCH] Setting certificates array...')
  const result = await client
    .patch(settings._id)
    .set({ certificates })
    .commit()

  console.log(`  ✓ Patched ${certificates.length} certificates into siteSettings\n`)
  console.log('Certificates seeded:')
  for (const cert of certificates) {
    console.log(`  • ${cert.title} (${cert.id}): ${cert.pdfUrl}`)
  }

  console.log('\n══════════════════════════════════════════════════')
  console.log('  Done!')
  console.log('══════════════════════════════════════════════════')
  console.log('\nCheck Sanity Studio: siteSettings → Certificates section')
}

main().catch(err => {
  console.error('\n[FATAL]', err)
  process.exit(1)
})
