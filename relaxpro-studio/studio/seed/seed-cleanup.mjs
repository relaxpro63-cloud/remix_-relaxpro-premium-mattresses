/**
 * seed-cleanup.mjs — Deletes all builder-related documents from Sanity
 *
 * Run BEFORE seed-supplement.mjs to ensure a clean slate:
 *   node seed-cleanup.mjs && node seed-supplement.mjs
 *
 * Deletes: builderMaterial, builderFabric, customBuilder
 */

import { createClient } from '@sanity/client'

const TOKEN = process.env.SANITY_AUTH_TOKEN
if (!TOKEN) { console.error('SANITY_AUTH_TOKEN env var required'); process.exit(1) }

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token: TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function deleteAll(type, label) {
  console.log(`\n═══ Deleting ${label}... ═══`)
  const ids = await client.fetch(`*[_type == "${type}"]._id`)
  if (ids.length === 0) { console.log(`  No ${label} to delete.`); return }
  console.log(`  Found ${ids.length} ${label} documents`)
  const tx = client.transaction()
  for (const id of ids) tx.delete(id)
  await tx.commit()
  console.log(`  ✅ Deleted ${ids.length} ${label} documents`)
}

async function main() {
  console.log('═'.repeat(50))
  console.log('  🧹 RELAXPRO — SANITY BUILDER CLEANUP')
  console.log('  Deletes builder data before fresh reseed')
  console.log('═'.repeat(50))

  await deleteAll('builderMaterial', 'builder materials')
  await deleteAll('builderFabric', 'builder fabrics')
  await deleteAll('customBuilder', 'custom builder config')

  console.log('\n' + '═'.repeat(50))
  console.log('  ✅ Cleanup complete! Ready for fresh seed.')
  console.log('═'.repeat(50))
}

main().catch(err => { console.error('❌', err); process.exit(1) })
