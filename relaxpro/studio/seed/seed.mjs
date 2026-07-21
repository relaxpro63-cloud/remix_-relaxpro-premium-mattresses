import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'

const token = process.env.SANITY_AUTH_TOKEN
if (!token) {
  console.error('SANITY_AUTH_TOKEN env var required')
  process.exit(1)
}

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  token,
  apiVersion: '2024-01-01',
})

async function seed() {
  console.log('Seeding RelaxPro CMS...')

  const categories = JSON.parse(readFileSync('./seed/categories.json', 'utf-8'))
  const products = JSON.parse(readFileSync('./seed/products.json', 'utf-8'))
  const testimonials = JSON.parse(readFileSync('./seed/testimonials.json', 'utf-8'))
  const faqs = JSON.parse(readFileSync('./seed/faqs.json', 'utf-8'))
  const homepage = JSON.parse(readFileSync('./seed/homepage.json', 'utf-8'))

  for (const item of categories) {
    await client.createIfNotExists(item)
    console.log(`  ✓ Category: ${item.name}`)
  }

  for (const item of products) {
    await client.createIfNotExists(item)
    console.log(`  ✓ Product: ${item.name}`)
  }

  for (const item of testimonials) {
    await client.createIfNotExists(item)
    console.log(`  ✓ Testimonial: ${item.customerName}`)
  }

  for (const item of faqs) {
    await client.createIfNotExists(item)
    console.log(`  ✓ FAQ: ${item.question.substring(0, 50)}...`)
  }

  await client.createIfNotExists(homepage)
  console.log('  ✓ Homepage content')

  console.log('\nSeed complete! Go to https://relaxpro.sanity.studio')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
