#!/usr/bin/env node
/**
 * Targeted patch: Update Sthira + Somya descriptions in Sanity CMS
 * Usage: SANITY_AUTH_TOKEN=sk... node patch-descriptions.mjs
 */
import { createClient } from '@sanity/client'

const TOKEN = process.env.SANITY_AUTH_TOKEN
if (!TOKEN) {
  console.error('❌ SANITY_AUTH_TOKEN env var required')
  console.error('   Run: SANITY_AUTH_TOKEN=sk... node patch-descriptions.mjs')
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
    id: 'product-sthira',
    name: 'Sthira',
    description:
      "Sthira is our firmest orthopedic mattress, designed for those who need maximum structural support to correct chronic posture issues. It combines a dense 4-inch Century 90 to 95 density rebonded base with a 2-inch layer of pure GOLS-certified organic Kerala latex. The ultra-high-density foam block prevents any structural deflection, keeping your spine in perfect neutral alignment throughout the night. The thin latex top layer adds just enough gentle cushioning to prevent aching on hips and shoulders — a common complaint with ultra-firm mattresses. This configuration is ideal for stomach sleepers, heavier individuals, and anyone with lower back pain who needs a surface that won't yield under pressure. Sthira is our most frequently recommended model by orthopedic specialists.",
  },
  {
    id: 'product-somya',
    name: 'Somya',
    description:
      "Somya is a thoughtfully engineered 10-inch triple-layer mattress that delivers an exceptionally soft surface feel without compromising on deep support. Starting with a 4-inch Century extra-firm rebonded base for rigid spinal alignment, it adds a 2-inch layer of premium highly resilient softy cushioning foam that acts as a gentle transition zone, absorbing joint pressure spikes. The top layer is 4 inches of 90-95 density pure GOLS-certified organic Kerala latex, providing that signature buoyant comfort that relieves pressure on shoulders, hips, and knees.",
  },
]

async function main() {
  for (const patch of patches) {
    console.log(`\n📝 Updating ${patch.name} (${patch.id})...`)
    try {
      const result = client
        .patch(patch.id)
        .set({ description: patch.description })
        .commit()
      await result
      console.log(`   ✅ ${patch.name} description updated successfully`)
    } catch (err) {
      console.error(`   ❌ Failed to update ${patch.name}:`, err.message)
    }
  }

  // Verify
  console.log('\n🔍 Verifying updates...')
  for (const patch of patches) {
    const doc = await client.getDocument(patch.id)
    const desc = doc?.description || ''
    const hasLatex = desc.toLowerCase().includes('latex')
    const hasDensity = desc.includes('90 to 95') || desc.includes('90-density')
    console.log(`   ${patch.name}: latex=${hasLatex ? '✅' : '❌'} density=${hasDensity ? '✅' : '❌'} (length=${desc.length})`)
  }

  console.log('\n✨ Done!')
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
