/**
 * update-showrooms.mjs — Update only showroom addresses in Sanity CMS
 *
 *   SANITY_AUTH_TOKEN=<token> node update-showrooms.mjs
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

const showrooms = [
  {
    _id: 'showroom-hyderabad',
    _type: 'showroom',
    name: 'RelaxPro Factory Showroom — Hyderabad',
    type: 'factory',
    address: {
      street: 'Jeedimetla Industrial Area, Phase 3',
      landmark: 'Near Prasad Labs',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500055',
      fullAddress: 'RelaxPro Factory Showroom, Jeedimetla Industrial Area, Phase 3, Near Prasad Labs, Hyderabad, Telangana - 500055',
    },
  },
  {
    _id: 'showroom-rajahmundry',
    _type: 'showroom',
    name: 'RelaxPro Factory Showroom — Rajahmundry',
    type: 'factory',
    address: {
      street: 'JN Road',
      landmark: 'Opposite Surya Function Hall',
      city: 'Rajahmundry',
      state: 'Andhra Pradesh',
      pincode: '533103',
      fullAddress: 'RelaxPro Factory Showroom, JN Road, Opposite Surya Function Hall, Rajahmundry, Andhra Pradesh - 533103',
    },
  },
  {
    _id: 'showroom-bangalore',
    _type: 'showroom',
    name: 'RelaxPro Factory Showroom — Bangalore',
    type: 'factory',
    address: {
      street: 'KR Puram Hoodi Main Road',
      landmark: 'KR Puram Hoodi Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560036',
      fullAddress: 'RelaxPro Factory Showroom, KR Puram Hoodi Main Road, Bangalore, Karnataka - 560036',
    },
  },
]

async function main() {
  for (const s of showrooms) {
    try {
      await client.createOrReplace(s)
      console.log(`✅ Updated ${s._id}: ${s.name}`)
    } catch (err) {
      console.error(`❌ Failed ${s._id}: ${err.message}`)
    }
  }
  console.log('\n🎉 All showrooms updated in Sanity CMS')
}

main()
