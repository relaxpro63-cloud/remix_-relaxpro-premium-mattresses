import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'fs'
import { join, extname } from 'path'

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
const IMAGE_DIR = join(PROJECT_ROOT, 'public', 'images')

async function uploadImage(filename) {
  const fullPath = join(IMAGE_DIR, filename)
  if (!existsSync(fullPath)) {
    console.error(`  IMAGE NOT FOUND: ${fullPath}`)
    return null
  }
  try {
    const buffer = readFileSync(fullPath)
    const asset = await client.assets.upload('image', buffer, { filename })
    const alt = filename.replace(extname(filename), '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    const result = {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt,
    }
    console.log(`  ✓ Uploaded ${filename} → ${asset._id}`)
    return result
  } catch (err) {
    console.error(`  ✗ Failed ${filename}: ${err.message}`)
    return null
  }
}

async function retry(fn, label, max = 3) {
  for (let i = 0; i < max; i++) {
    try { await fn(); return }
    catch { if (i < max - 1) { console.log(`    retry ${i + 1}/${max} "${label}"`); await new Promise(r => setTimeout(r, 2000)) } else throw new Error(`Failed "${label}"`) }
  }
}

async function upsert(type, item) {
  const label = item.title || item._id
  await retry(() => client.createOrReplace({ _id: item._id, _type: type, ...item }), label)
  console.log(`  OK ${type.padEnd(18)} ${label}`)
}

const CERTIFICATIONS = [
  {
    _id: 'cert-gols',
    title: 'GOLS Certified Organic',
    slug: { current: 'gols' },
    subtitle: 'Global Organic Latex Standard',
    description: 'Our organic latex components are certified under the Global Organic Latex Standard (GOLS), ensuring sustainable sourcing, environmentally responsible manufacturing, and premium natural sleep comfort. The GOLS certification guarantees that our latex contains a minimum of 95% certified organic raw material and meets strict environmental and social criteria throughout the supply chain.',
    pdfUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/15NFHl1vK5jieVnClCTr95NQKk4w1Lu8S/preview',
    validity: 'Valid — Organic Integrity Verified',
    certificateNumber: 'GOLS-2024-IND-001',
    issueDate: '2024-01-15',
    expiryDate: '2027-01-15',
    order: 1,
    isActive: true,
    logoImage: null,
    certificateImage: null,
  },
  {
    _id: 'cert-iso',
    title: 'ISO 9001:2015',
    slug: { current: 'iso' },
    subtitle: 'Quality Management System',
    description: 'Certified Quality Management System ensuring consistent manufacturing processes, rigorous quality control, and internationally recognized production standards. Our ISO 9001:2015 certification reflects our commitment to systematic quality assurance, continuous improvement, and customer satisfaction across all operations.',
    pdfUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1etftPWgHKB8QtviIrbEsLwb9xWav_xcG/preview',
    validity: 'Valid — Audited Annually',
    certificateNumber: 'ISO-9001-2024-IND',
    issueDate: '2024-03-01',
    expiryDate: '2027-03-01',
    order: 2,
    isActive: true,
    logoImage: null,
    certificateImage: null,
  },
  {
    _id: 'cert-oeko',
    title: 'OEKO-TEX® STANDARD 100',
    slug: { current: 'oeko' },
    subtitle: 'Textile Safety & Confidence',
    description: 'Our certified fabrics are independently tested for harmful substances, providing safe, skin-friendly, and environmentally responsible sleep products. The OEKO-TEX® STANDARD 100 certification guarantees that every component of our mattress fabric — from threads to accessories — has been tested for harmful substances and is harmless for human health.',
    pdfUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/view',
    pdfEmbedUrl: 'https://drive.google.com/file/d/1YTrKBrNx9L0ZWLqI5Q87UoEHXrnAu65q/preview',
    validity: 'Valid — Annual Renewal',
    certificateNumber: 'OEKO-TEX-2024-IND',
    issueDate: '2024-06-01',
    expiryDate: '2027-06-01',
    order: 3,
    isActive: true,
    logoImage: null,
    certificateImage: null,
  },
]

const CERTIFICATION_SETTINGS = {
  _id: 'certificationSettings',
  sectionTitle: 'Trusted by International Quality Standards',
  sectionBadge: 'Certified Quality',
  sectionDescription: 'Every RelaxPro mattress is crafted using premium materials and manufactured to meet globally recognized quality, safety, and environmental standards. Sleep with complete confidence knowing your mattress is backed by certified excellence.',
  buttonText: 'View Certificates',
  backgroundColor: '#FAF8F5',
  isEnabled: true,
  certifications: [
    { _type: 'reference', _ref: 'cert-gols' },
    { _type: 'reference', _ref: 'cert-iso' },
    { _type: 'reference', _ref: 'cert-oeko' },
  ],
}

async function main() {
  console.log('─' .repeat(50))
  console.log('  Certifications Seed')
  console.log('─' .repeat(50))
  console.log()

  // Upload logo images
  console.log('── Uploading Logo Images ──')
  const logoFiles = [
    { file: 'cert-gols-logo.png', certId: 'cert-gols' },
    { file: 'cert-iso-logo.png', certId: 'cert-iso' },
    { file: 'cert-oeko-logo.png', certId: 'cert-oeko' },
  ]

  for (const { file, certId } of logoFiles) {
    const image = await uploadImage(file)
    const cert = CERTIFICATIONS.find(c => c._id === certId)
    if (cert && image) {
      cert.logoImage = image
      console.log(`  Assigned logo to ${certId}`)
    }
  }

  console.log()
  console.log('── Creating Certification Documents ──')
  for (const cert of CERTIFICATIONS) {
    await upsert('certification', cert)
  }

  console.log()
  console.log('── Creating Certification Settings ──')
  await upsert('certificationSettings', CERTIFICATION_SETTINGS)

  console.log()
  console.log('─' .repeat(50))
  console.log('✅ Certifications seed complete!')
  console.log('─' .repeat(50))
}

main().catch(err => { console.error('\n❌ Seed failed:', err); process.exit(1) })
