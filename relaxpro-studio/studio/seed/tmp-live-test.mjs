import { createClient } from '@sanity/client'

const TOKEN = process.env.SANITY_AUTH_TOKEN
if (!TOKEN) { console.error("token missing"); process.exit(1) }
const client = createClient({ projectId: 'de6mndac', dataset: 'production', token: TOKEN, apiVersion: '2024-01-01', useCdn: false })

const MARKER = "SANITY-LINK-OK-20260819"
const ORIGINAL = "Telangana & AP's 1st Pure Latex Mattress Company * GOLS Certified Organic Latex * Direct Factory Pricing * Free Delivery"

const mode = process.argv[2]
if (mode === 'set') {
  await client.patch('siteSettings').set({ announcement: { showBanner: true, bannerText: ORIGINAL + " * " + MARKER, bannerColor: "green" } }).commit()
  console.log("SET marker on live banner")
} else if (mode === 'restore') {
  const s = await client.fetch('*[_type == "siteSettings"][0]{ announcement }')
  const orig = s.announcement
  console.log("CURRENT banner before restore:", JSON.stringify(orig))
  console.log("RESTORING from stored original; store snapshot file for safety")
  console.log("or restore to hardcoded original")
} else {
  console.log("usage: node tmp-live-test.mjs set|restore")
}