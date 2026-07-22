/**
 * Check what images are stored on a Sanity product.
 * Usage: SANITY_TOKEN=xxx npx tsx scripts/check-product-images.ts [slug]
 */
import { createClient } from '@sanity/client'
import { fileURLToPath } from 'url'
import path from 'path'

const slug = process.argv[2] || 'amrita'
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || 'de6mndac',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_TOKEN,
  useCdn: false,
})

async function main() {
  console.log(`\n🔍 Checking product: "${slug}"\n`)

  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id, name, slug,
      "hasMainImage": image != null,
      "mainImageRef": image.asset._ref,
      "galleryCount": count(images),
      "galleryRefs": images[].asset._ref
    }`,
    { slug }
  )

  if (!product) {
    console.log(`❌ Product "${slug}" not found in Sanity.\n`)
    return
  }

  console.log(`ID:      ${product._id}`)
  console.log(`Name:    ${product.name}`)
  console.log(`Slug:    ${product.slug?.current}`)
  console.log(`\n📸 Image Status:`)
  console.log(`  Main image:   ${product.hasMainImage ? '✅ ' + product.mainImageRef : '❌ EMPTY'}`)
  console.log(`  Gallery count: ${product.galleryCount || 0}`)
  
  if (product.galleryRefs?.length > 0) {
    console.log(`  Gallery refs:  ${product.galleryRefs.length} images uploaded`)
    product.galleryRefs.forEach((ref: string, i: number) => {
      console.log(`    ${i + 1}. ${ref}`)
    })
  }

  // Also list all products that have images vs don't
  console.log(`\n📋 All products summary:\n`)
  const all = await client.fetch(
    `*[_type == "product"]{ name, "slug": slug.current, "hasImage": image != null, "galleryCount": count(images) } | order(name asc)`
  )
  
  let withImages = 0, withoutImages = 0
  for (const p of all) {
    const status = p.hasImage ? `✅ main + ${p.galleryCount} gallery` : '❌ no images'
    console.log(`  ${p.name.padEnd(14)} ${status}`)
    if (p.hasImage) withImages++; else withoutImages++
  }
  
  console.log(`\n📊 Total: ${withImages} with images, ${withoutImages} without images out of ${all.length} products\n`)
}

main().catch(err => {
  console.error('FATAL:', err)
  process.exit(1)
})
