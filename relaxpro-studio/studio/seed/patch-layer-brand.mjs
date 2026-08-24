#!/usr/bin/env node
/**
 * Patch: Fix Sthira layer brand in Sanity CMS
 * Usage: SANITY_AUTH_TOKEN=sk... node patch-layer-brand.mjs
 */
import { createClient } from '@sanity/client'

const TOKEN = process.env.SANITY_AUTH_TOKEN
if (!TOKEN) {
  console.error('❌ SANITY_AUTH_TOKEN env var required')
  process.exit(1)
}

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function main() {
  // Get current document
  const doc = await client.getDocument('product-sthira')
  if (!doc?.layers) {
    console.error('❌ No layers found for product-sthira')
    process.exit(1)
  }

  console.log('📋 Current layers:')
  doc.layers.forEach((l, i) => {
    console.log(`   [${i}] brand: "${l.brand}" | desc: "${l.description}"`)
  })

  // Find and update the rebonded foam layer brand
  const updatedLayers = doc.layers.map(l => {
    if (l.material === 'rebonded_foam' && l.brand?.includes('95 Density')) {
      const newBrand = l.brand.replace('95 Density', '90 to 95 Density')
      console.log(`\n🔧 Patching brand: "${l.brand}" → "${newBrand}"`)
      return { ...l, brand: newBrand }
    }
    return l
  })

  await client
    .patch('product-sthira')
    .set({ layers: updatedLayers })
    .commit()

  console.log('✅ Layers updated successfully')

  // Verify
  const verify = await client.getDocument('product-sthira')
  console.log('\n🔍 Verified layers:')
  verify.layers.forEach((l, i) => {
    console.log(`   [${i}] brand: "${l.brand}"`)
  })
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
