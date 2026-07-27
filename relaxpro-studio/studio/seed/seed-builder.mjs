import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { join } from 'path'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) { console.error('SANITY_AUTH_TOKEN env var required'); process.exit(1) }

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function upsert(type, item) {
  const label = item.name ?? item._id
  try {
    await client.createOrReplace({ _id: item._id, _type: type, ...item })
    console.log(`  OK ${type.padEnd(16)} ${label}`)
  } catch (err) {
    console.error(`  FAIL ${type.padEnd(16)} ${label}: ${err.message}`)
  }
}

async function main() {
  const dir = import.meta.dirname

  console.log('\n── Builder Config ──')
  const config = JSON.parse(readFileSync(join(dir, 'builderConfig.json'), 'utf-8'))
  await upsert('customBuilder', config)

  console.log('\n── Builder Materials ──')
  const materials = JSON.parse(readFileSync(join(dir, 'builderMaterials.json'), 'utf-8'))
  for (const m of materials) await upsert('builderMaterial', m)

  console.log('\n── Builder Fabrics ──')
  const fabrics = JSON.parse(readFileSync(join(dir, 'builderFabrics.json'), 'utf-8'))
  for (const f of fabrics) await upsert('builderFabric', f)

  console.log('\n✅ Builder seed complete!')
}

main().catch(err => { console.error('\n❌ Failed:', err); process.exit(1) })
