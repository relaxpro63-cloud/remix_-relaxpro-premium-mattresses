/**
 * patch-contacts.mjs — Patch contact info & hours on showroom documents
 * Uses Sanity patch (not createOrReplace) so existing fields are preserved.
 *
 *   SANITY_AUTH_TOKEN=<token> node patch-contacts.mjs
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

const patches = [
  {
    _id: 'showroom-hyderabad',
    contact: {
      phoneNumbers: ['+918686624494', '+917207424494'],
      whatsapp: '+918686624494',
      email: 'relaxpro.latexlabs@gmail.com',
    },
    hours: {
      monday: '10:00 AM – 9:00 PM',
      tuesday: '10:00 AM – 9:00 PM',
      wednesday: '10:00 AM – 9:00 PM',
      thursday: '10:00 AM – 9:00 PM',
      friday: '10:00 AM – 9:00 PM',
      saturday: '10:00 AM – 9:00 PM',
      sunday: '10:00 AM – 9:00 PM',
      note: 'Main factory showroom — visit to see all 12 models and get free sleep advice',
    },
    coordinates: { lat: 17.4461, lng: 78.3936 },
    ctaButtons: [
      { label: 'Call Us', href: 'tel:+918686624494', variant: 'secondary' },
      { label: 'WhatsApp', href: 'https://wa.me/918686624494', variant: 'primary' },
    ],
    slug: { current: 'hyderabad' },
    isActive: true,
    order: 1,
  },
  {
    _id: 'showroom-rajahmundry',
    contact: {
      phoneNumbers: ['+918686624494'],
      whatsapp: '+918686624494',
      email: 'relaxpro.latexlabs@gmail.com',
    },
    hours: {
      monday: '10:00 AM – 8:30 PM',
      tuesday: '10:00 AM – 8:30 PM',
      wednesday: '10:00 AM – 8:30 PM',
      thursday: '10:00 AM – 8:30 PM',
      friday: '10:00 AM – 8:30 PM',
      saturday: '10:00 AM – 8:30 PM',
      sunday: '11:00 AM – 7:00 PM',
      note: 'Experience center for East Andhra Pradesh customers',
    },
    coordinates: { lat: 17.0005, lng: 81.7836 },
    ctaButtons: [
      { label: 'Call Us', href: 'tel:+918686624494', variant: 'secondary' },
      { label: 'WhatsApp', href: 'https://wa.me/918686624494', variant: 'primary' },
    ],
    slug: { current: 'rajahmundry' },
    isActive: true,
    order: 2,
  },
  {
    _id: 'showroom-bangalore',
    contact: {
      phoneNumbers: ['+917207424494'],
      whatsapp: '+917207424494',
      email: 'relaxpro.latexlabs@gmail.com',
    },
    hours: {
      monday: '10:30 AM – 8:30 PM',
      tuesday: '10:30 AM – 8:30 PM',
      wednesday: '10:30 AM – 8:30 PM',
      thursday: '10:30 AM – 8:30 PM',
      friday: '10:30 AM – 8:30 PM',
      saturday: '10:30 AM – 8:30 PM',
      sunday: '10:30 AM – 8:30 PM',
      note: 'Karnataka partner location — all RelaxPro models available for viewing',
    },
    coordinates: { lat: 12.9784, lng: 77.6408 },
    ctaButtons: [
      { label: 'Call Us', href: 'tel:+917207424494', variant: 'secondary' },
      { label: 'WhatsApp', href: 'https://wa.me/917207424494', variant: 'primary' },
    ],
    slug: { current: 'bangalore' },
    isActive: true,
    order: 3,
  },
]

async function main() {
  for (const p of patches) {
    const { _id, ...fields } = p
    try {
      await client.patch(_id).set(fields).commit()
      console.log(`✅ Patched ${_id}`)
    } catch (err) {
      console.error(`❌ Failed ${_id}: ${err.message}`)
    }
  }
  console.log('\n🎉 All showroom contacts patched')
}

main()
