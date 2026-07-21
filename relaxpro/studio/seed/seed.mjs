import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) { console.error('SANITY_AUTH_TOKEN env var required'); process.exit(1) }

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token,
  apiVersion: '2024-01-01',
  useCdn: false,
})

function read (p) { return JSON.parse(readFileSync(p, 'utf-8')) }

async function retry (fn, label, max = 3) {
  for (let i = 0; i < max; i++) {
    try  { await fn(); return }
    catch { if (i < max - 1) { console.log(`    ⚠ retry ${i + 1}/${max} "${label}"`); await new Promise(r => setTimeout(r, 2000)) } else throw new Error(`Failed "${label}"`) }
  }
}

async function batch (type, items) {
  for (const item of items) {
    const label = item.name ?? item.customerName ?? item.question?.slice(0, 36) ?? item._id
    await retry(() => client.createIfNotExists({ _type: type, ...item }), label)
    console.log(`  ✓ ${type.padEnd(14)} ${label}`)
  }
}

async function singleton (id, type, data) {
  await retry(() => client.createOrReplace({ _id: id, _type: type, ...data }), id)
  console.log(`  ✓ ${type.padEnd(14)} ${id}`)
}

async function seed () {
  console.log('Seeding RelaxPro CMS...\n')
  await batch('brandCategory', read('./seed/categories.json'))
  await batch('product',       read('./seed/products.json'))
  await batch('showroom',      read('./seed/showrooms.json'))
  await batch('testimonial',   read('./seed/testimonials.json'))
  await batch('faq',           read('./seed/faqs.json'))
  await singleton('home',          'home',          read('./seed/homepage.json'))
  await singleton('productsPage',  'productsPage',  read('./seed/productsPage.json'))
  await batch('builderMaterial', read('./seed/builderMaterials.json'))
  await batch('builderFabric',   read('./seed/builderFabrics.json'))
  await singleton('customBuilder', 'customBuilder', read('./seed/builderConfig.json'))
  await singleton('about',         'about',         read('./seed/about.json'))
  await singleton('contact',       'contact',       read('./seed/contact.json'))
  await singleton('siteSettings',  'siteSettings',  read('./seed/siteSettings.json'))
  console.log('\n🎉 All done → https://relaxpro.sanity.studio')
}

seed().catch(e => { console.error('\n❌', e.message); process.exit(1) })
