/**
 * update-homepage-showrooms-section.mjs — Update the allShowroomsSection title in Sanity CMS
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
  // Fetch current homepage document
  const home = await client.fetch('*[_type == "home"][0]{ _id, allShowroomsSection { sectionTitle } }')
  if (!home) {
    console.error('❌ No home document found')
    return
  }
  
  console.log(`Current title: "${home.allShowroomsSection?.sectionTitle}"`)
  
  // Patch the section title
  await client
    .patch(home._id)
    .set({ 'allShowroomsSection.sectionTitle': 'RelaxPro Mattress Partner to Showrooms' })
    .commit()
  
  console.log('✅ Updated allShowroomsSection.sectionTitle to "RelaxPro Mattress Partner to Showrooms"')
}

main()
