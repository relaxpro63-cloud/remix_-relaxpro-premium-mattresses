/**
 * Upload Product Images to Sanity
 *
 * Scans local product images from public/images/products/,
 * uploads each to Sanity as an image asset, and patches
 * the product documents with the correct image references.
 *
 * Usage:
 *   SANITY_TOKEN=your_write_token npx tsx scripts/upload-product-images-to-sanity.ts
 *
 * Environment:
 *   SANITY_TOKEN    (required) — Sanity write token
 *   SANITY_PROJECT_ID — defaults to 'de6mndac'
 *   SANITY_DATASET    — defaults to 'production'
 */

import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// ─── Resolve project root (works with tsx ESM) ──────────────────────────
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const IMAGES_DIR = path.resolve(PROJECT_ROOT, 'public/images/products')

// ─── Sanity client (write token required) ─────────────────────────────────
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'de6mndac',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

// ─── Types ────────────────────────────────────────────────────────────────
interface ProductImageGroup {
  slug: string
  mainImage: string | null      // path to main image (e.g. nirvana.webp)
  galleryImages: string[]        // paths to gallery images (e.g. nirvana-gallery-1.webp)
}

interface SanityProduct {
  _id: string
  _type: string
  slug: { current: string }
  name?: string
}

// ─── Scan local images ────────────────────────────────────────────────────
function scanLocalImages(): ProductImageGroup[] {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`[ERROR] Images directory not found: ${IMAGES_DIR}`)
    process.exit(1)
  }

  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.webp') || f.endsWith('.svg'))
  const webpCount = files.filter(f => f.endsWith('.webp')).length
  const svgCount = files.filter(f => f.endsWith('.svg')).length
  console.log(`[SCAN] Found ${files.length} image files (${webpCount} .webp, ${svgCount} .svg) in ${IMAGES_DIR}\n`)

  // Group by product slug
  const groupMap = new Map<string, { main: string | null; gallery: string[] }>()

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file)
    // Pattern: "nirvana.webp" or "nirvana.svg" → slug = "nirvana", main image
    // Pattern: "nirvana-gallery-1.webp" → slug = "nirvana", gallery image
    const galleryMatch = file.match(/^(.+)-gallery-\d+\.(webp|svg)$/)
    const mainMatch = file.match(/^(.+)\.(webp|svg)$/)

    if (galleryMatch) {
      const slug = galleryMatch[1]
      if (!groupMap.has(slug)) groupMap.set(slug, { main: null, gallery: [] })
      groupMap.get(slug)!.gallery.push(filePath)
    } else if (mainMatch) {
      const slug = mainMatch[1]
      if (!groupMap.has(slug)) groupMap.set(slug, { main: null, gallery: [] })
      groupMap.get(slug)!.main = filePath
    }
  }

  const groups: ProductImageGroup[] = []
  for (const [slug, { main, gallery }] of groupMap) {
    groups.push({ slug, mainImage: main, galleryImages: gallery })
  }

  console.log(`[SCAN] Grouped into ${groups.length} products:\n`)
  for (const g of groups) {
    console.log(`  ${g.slug}: ${g.mainImage ? 'main ✓' : 'main ✗'}, ${g.galleryImages.length} gallery images`)
  }
  console.log('')

  return groups
}

// ─── Fetch existing products from Sanity (with image state) ──────────────
interface ProductWithImageState extends SanityProduct {
  hasMainImage: boolean
  galleryCount: number
}

async function fetchSanityProducts(): Promise<Map<string, ProductWithImageState>> {
  console.log('[SANITY] Fetching existing products...')
  const products: ProductWithImageState[] = await client.fetch(
    `*[_type == "product"]{
      _id, _type, slug, name,
      "hasMainImage": image != null,
      "galleryCount": count(images)
    }`
  )
  const map = new Map<string, ProductWithImageState>()
  let withImages = 0
  for (const p of products) {
    if (p.slug?.current) {
      map.set(p.slug.current, p)
      if (p.hasMainImage) withImages++
    }
  }
  console.log(`[SANITY] Found ${map.size} products (${withImages} with images, ${map.size - withImages} without)\n`)
  return map
}

// ─── Upload a single image to Sanity (with retry on transient errors) ─────
async function uploadImage(filePath: string, label: string, retries = 3): Promise<string | null> {
  const fileName = path.basename(filePath)
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const buffer = fs.readFileSync(filePath)
      const asset = await client.assets.upload('image', buffer, {
        filename: fileName,
        contentType: fileName.endsWith('.svg') ? 'image/svg+xml' : 'image/webp',
        label: `${label} — ${fileName}`,
      })
      console.log(`  ✓ Uploaded: ${fileName} → ${asset._id}`)
      return asset._id
    } catch (err: any) {
      const isRetryable = err.message?.includes('ECONNRESET') || err.message?.includes('ETIMEDOUT') || err.message?.includes('socket hang up')
      if (attempt < retries && isRetryable) {
        const delay = attempt * 2000
        console.log(`  ⏳ Retry ${attempt}/${retries - 1} for ${fileName} in ${delay}ms...`)
        await sleep(delay)
      } else {
        console.error(`  ✗ Failed to upload ${fileName}${attempt > 1 ? ` after ${attempt} attempts` : ''}: ${err.message}`)
        return null
      }
    }
  }
  return null
}

// ─── Build image reference for Sanity patch ──────────────────────────────
function imageRef(assetId: string | null, alt?: string) {
  if (!assetId) return undefined
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt: alt || '',
  }
}

function imageRefArray(assetIds: (string | null)[], altPrefix: string) {
  return assetIds
    .filter((id): id is string => id !== null)
    .map((id, i) => ({
      _type: 'image',
      asset: { _type: 'reference', _ref: id },
      alt: `${altPrefix} - View ${i + 1}`,
    }))
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('══════════════════════════════════════════════════')
  console.log('  RelaxPro — Upload Product Images to Sanity')
  console.log('══════════════════════════════════════════════════\n')

  // Validate token
  if (!process.env.SANITY_TOKEN) {
    console.error('[ERROR] SANITY_TOKEN environment variable is required.')
    console.error('  Usage: SANITY_TOKEN=xxx npx tsx scripts/upload-product-images-to-sanity.ts')
    process.exit(1)
  }

  // 1. Scan local images
  const localGroups = scanLocalImages()

  // 2. Get existing Sanity products
  const sanityProducts = await fetchSanityProducts()

  // 3. Determine which products to process
  const slugsToProcess = new Set<string>()

  // Products that have local images
  for (const g of localGroups) {
    slugsToProcess.add(g.slug)
  }

  // Products that exist in Sanity but might not have images yet
  for (const [slug] of sanityProducts) {
    // Only process Sanity products that also have local images
    if (localGroups.some(g => g.slug === slug)) {
      slugsToProcess.add(slug)
    }
  }

  // Also show products that are in Sanity but have no local images
  for (const [slug] of sanityProducts) {
    if (!localGroups.some(g => g.slug === slug)) {
      console.log(`[SKIP] "${slug}" exists in Sanity but has no local image files\n`)
    }
  }

  if (slugsToProcess.size === 0) {
    console.log('[DONE] No products to process.')
    return
  }

  console.log(`[PROCESS] Will process ${slugsToProcess.size} products\n`)
  let patched = 0, skipped = 0

  // 4. Process each product
  for (const slug of slugsToProcess) {
    const group = localGroups.find(g => g.slug === slug)!
    const sanityProduct = sanityProducts.get(slug)
    const productLabel = sanityProduct?.name || slug

    console.log(`──────────────────────────────────────────────`)
    console.log(`  Product: ${productLabel} (${slug})`)
    console.log(`──────────────────────────────────────────────`)

    // ⚠️ IMPORTANT: Check if product already has images from a previous run.
    // Sanity's patch.set() REPLACES the entire field, so re-running would
    // overwrite previously uploaded images with only partial results.
    const needsMain = !sanityProduct?.hasMainImage
    const needsGallery = !sanityProduct?.galleryCount || sanityProduct.galleryCount === 0

    if (!needsMain && !needsGallery) {
      console.log(`  ℹ Already has images — skipping\n`)
      skipped++
      continue
    }

    console.log(`  ℹ Needs: ${needsMain ? 'main image ' : ''}${needsGallery ? 'gallery images' : ''}\n`)

    // Upload main image (only if missing)
    let mainAssetId: string | null = null
    if (needsMain && group.mainImage) {
      mainAssetId = await uploadImage(group.mainImage, productLabel)
    } else if (needsMain && group.galleryImages.length > 0) {
      console.log(`  ℹ No main image file found, using first gallery image as main`)
      mainAssetId = await uploadImage(group.galleryImages[0], productLabel)
    }

    // Upload gallery images (only if missing)
    const galleryAssetIds: (string | null)[] = []
    if (needsGallery) {
      for (const imgPath of group.galleryImages) {
        const id = await uploadImage(imgPath, `${productLabel} gallery`)
        galleryAssetIds.push(id)
      }
    }

    // Build patch document
    if (sanityProduct) {
      const patch: Record<string, any> = {}

      if (mainAssetId) {
        patch.image = imageRef(mainAssetId, `${productLabel} — Natural Organic Latex Mattress`)
      }

      if (galleryAssetIds.length > 0) {
        patch.images = imageRefArray(galleryAssetIds, productLabel)
      }

      if (Object.keys(patch).length > 0) {
        try {
          await client.patch(sanityProduct._id).set(patch).commit()
          console.log(`  ✓ Patched ${sanityProduct._id} with image references\n`)
          patched++
        } catch (err: any) {
          console.error(`  ✗ Failed to patch ${sanityProduct._id}: ${err.message}\n`)
        }
      } else {
        console.log(`  — No images to patch\n`)
        skipped++
      }
    } else {
      console.log(`  ℹ Product "${slug}" not found in Sanity. Images uploaded but not linked to a document.\n`)
    }
  }

  console.log(`[SUMMARY] ${patched} patched, ${skipped} already had images\n`)

  // 5. Summary
  console.log('══════════════════════════════════════════════════')
  console.log('  Upload Complete!')
  console.log('══════════════════════════════════════════════════')
  console.log(`\nNext steps:`)
  console.log(`  1. Verify in Sanity Studio that images appear on products`)
  console.log(`  2. Deploy the frontend for the changes to take effect`)
  console.log(`  3. If some images look wrong, re-run with fixes\n`)
}

main().catch(err => {
  console.error('\n[FATAL]', err)
  process.exit(1)
})
