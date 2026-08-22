/**
 * update-pricing.mjs — Update product pricing in Sanity to ensure withAccessories prices are correct
 *
 *   SANITY_AUTH_TOKEN=<token> node update-pricing.mjs
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

// Correct withAccessories prices for all products
const pricingUpdates = [
  { slug: 'nirvana',   withAccessories: { king: 54000, queen: 45000, double: 32000, single: 27000, diwan: 34000, custom: 0 } },
  { slug: 'amrita',    withAccessories: { king: 48000, queen: 40000, double: 32000, single: 24000, diwan: 34000, custom: 0 } },
  { slug: 'ananda',    withAccessories: { king: 42000, queen: 35000, double: 28000, single: 21000, diwan: 34000, custom: 0 } },
  { slug: 'prakriti',  withAccessories: { king: 44000, queen: 36500, double: 29000, single: 22000, diwan: 34000, custom: 0 } },
  { slug: 'somya',     withAccessories: { king: 41000, queen: 34000, double: 27000, single: 20500, diwan: 34000, custom: 0 } },
  { slug: 'arogya',    withAccessories: { king: 38000, queen: 31500, double: 26000, single: 19000, diwan: 34000, custom: 0 } },
  { slug: 'shuddha',   withAccessories: { king: 33000, queen: 27500, double: 22000, single: 16500, diwan: 34000, custom: 0 } },
  { slug: 'sthira',    withAccessories: { king: 27000, queen: 22500, double: 18000, single: 13500, diwan: 34000, custom: 0 } },
  { slug: 'bhumi',     withAccessories: { king: 33000, queen: 27500, double: 22000, single: 16500, diwan: 34000, custom: 0 } },
  { slug: 'sunidra',   withAccessories: { king: 30000, queen: 25000, double: 20000, single: 15000, diwan: 34000, custom: 0 } },
  { slug: 'vishram',   withAccessories: { king: 24000, queen: 20000, double: 18000, single: 12000, diwan: 34000, custom: 0 } },
]

async function main() {
  for (const update of pricingUpdates) {
    try {
      // Find the product by slug
      const product = await client.fetch(`*[_type == "product" && slug.current == $slug][0]{ _id, pricingModel }`, { slug: update.slug })
      if (!product) {
        console.log(`⚠️  Product ${update.slug} not found, skipping`)
        continue
      }

      // Patch the withAccessories pricing
      await client
        .patch(product._id)
        .set({
          'pricing.withAccessories': update.withAccessories,
          'pricing.startingPrice': update.withAccessories.king,
        })
        .commit()

      console.log(`✅ ${update.slug}: withAccessories.king = ₹${update.withAccessories.king.toLocaleString('en-IN')}`)
    } catch (err) {
      console.error(`❌ ${update.slug}: ${err.message}`)
    }
  }
  console.log('\n🎉 All product pricing updated in Sanity CMS')
}

main()
