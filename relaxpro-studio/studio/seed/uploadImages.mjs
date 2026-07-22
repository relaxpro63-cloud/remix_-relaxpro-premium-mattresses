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

const IMAGE_DIR = join(import.meta.dirname, '..', '..', '..', 'public', 'images')
const OUTPUT = join(import.meta.dirname, 'imageMapping.json')
const EXISTING = existsSync(OUTPUT) ? JSON.parse(readFileSync(OUTPUT, 'utf-8')) : {}

const SUPPORTED = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.svg']

async function uploadImage(filePath, relativePath) {
  const key = relativePath.replace(/\\/g, '/')
  if (EXISTING[key]) {
    console.log(`  SKIP ${key} (already uploaded: ${EXISTING[key].asset._ref})`)
    return EXISTING[key]
  }

  try {
    const buffer = readFileSync(filePath)
    const filename = key.split('/').pop()
    const asset = await client.assets.upload('image', buffer, { filename })
    const result = {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
      alt: filename.replace(extname(filename), '').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    }
    EXISTING[key] = result
    console.log(`  UPLOAD ${key} → ${asset._id}`)
    return result
  } catch (err) {
    console.error(`  FAIL ${key}: ${err.message}`)
    return null
  }
}

function walk(dir, baseDir) {
  const entries = readdirSync(dir, { withFileTypes: true })
  const results = []
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walk(fullPath, baseDir))
    } else if (SUPPORTED.includes(extname(entry.name).toLowerCase())) {
      results.push({ fullPath, relative: relative(baseDir, fullPath) })
    }
  }
  return results
}

async function main() {
  console.log('Scanning', IMAGE_DIR)
  const images = walk(IMAGE_DIR, join(IMAGE_DIR, '..'))
  console.log(`Found ${images.length} images`)

  for (const img of images) {
    await uploadImage(img.fullPath, img.relative)
  }

  writeFileSync(OUTPUT, JSON.stringify(EXISTING, null, 2))
  console.log(`\nDone. Mapping saved to ${OUTPUT}`)
}

main().catch(err => { console.error(err); process.exit(1) })
