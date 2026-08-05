import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) { console.error('SANITY_AUTH_TOKEN env var required (sanity.io/manage → API → Tokens → create read+write token)'); process.exit(1) }

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const daysFromNow = (days) => new Date(Date.now() + days * 86400000).toISOString()

async function upsert(offer) {
  try {
    await client.createOrReplace({ _id: offer._id, _type: 'offer', ...offer })
    console.log(`  OK offer ${offer.title}`)
  } catch (err) {
    console.error(`  FAIL offer ${offer.title}: ${err.message}`)
  }
}

async function main() {
  const offers = JSON.parse(readFileSync(join(import.meta.dirname, 'offers.json'), 'utf-8'))
  console.log(`\n── Offers & Campaigns (${offers.length}) ──`)
  for (const o of offers) {
    // Convert relative endDateDaysFromNow → absolute ISO for Sanity datetime fields
    const { endDateDaysFromNow, ...doc } = o
    await upsert({ ...doc, startDate: new Date().toISOString(), ...(endDateDaysFromNow ? { endDate: daysFromNow(endDateDaysFromNow) } : {}) })
  }
  console.log('\n✅ Offers seed complete!')
}

main().catch(err => { console.error('\n❌ Failed:', err); process.exit(1) })
