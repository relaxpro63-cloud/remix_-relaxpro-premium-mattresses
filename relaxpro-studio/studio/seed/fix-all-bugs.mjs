import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

const diwanFixes = {
  'nirvana': { diwan_with: 34000, diwan_without: 31000 },
  'amrita': { diwan_with: 32000, diwan_without: 29000 },
  'ananda': { diwan_with: 28000, diwan_without: 25000 },
  'prakriti': { diwan_with: 29000, diwan_without: 26000 },
  'somya': { diwan_with: 27000, diwan_without: 24000 },
  'arogya': { diwan_with: 26000, diwan_without: 23000 },
  'sthira': { diwan_with: 18000, diwan_without: 15000 },
  'bhumi': { diwan_with: 22000, diwan_without: 19000 },
  'shuddha': { diwan_with: 22000, diwan_without: 19000 },
  'sunidra': { diwan_with: 20000, diwan_without: 17000 },
  'vishram': { diwan_with: 18000, diwan_without: 13000 },
};

async function main() {
  const products = await client.fetch(`*[_type == "product" && defined(slug)]{ _id, slug, name, features }`);
  
  let updated = 0;
  
  for (const p of products) {
    const slug = typeof p.slug === 'object' ? p.slug?.current : p.slug;
    if (!slug) continue;
    
    const patch = {};
    
    // Fix diwan pricing
    if (diwanFixes[slug]) {
      const d = diwanFixes[slug];
      patch['pricing.withAccessories.diwan'] = d.diwan_with;
      patch['pricing.withoutAccessories.diwan'] = d.diwan_without;
      // Also sync double to match diwan
      patch['pricing.withAccessories.double'] = d.diwan_with;
      patch['pricing.withoutAccessories.double'] = d.diwan_without;
    }
    
    // Fix spelling: "cradle curves" -> "cradles curves"
    if (p.features?.some(f => f.includes('cradle curves'))) {
      const fixedFeatures = p.features.map(f => 
        f.includes('cradle curves') ? f.replace('cradle curves', 'cradles curves') : f
      );
      patch.features = fixedFeatures;
    }
    
    // Fix spelling: "chest chest-aligned" -> "chest-aligned"
    if (p.features?.some(f => f.includes('chest chest-aligned'))) {
      const fixedFeatures = (patch.features || p.features).map(f =>
        f.includes('chest chest-aligned') ? f.replace('chest chest-aligned', 'chest-aligned') : f
      );
      patch.features = fixedFeatures;
    }
    
    // Fix keyBenefit "cradle curves" -> "cradles curves" (for ananda)
    if (slug === 'ananda') {
      // Will handle via separate keyBenefit patch if needed
    }
    
    if (Object.keys(patch).length > 0) {
      console.log(`Patching ${p.name} (${slug}):`, Object.keys(patch).join(', '));
      await client.patch(p._id).set(patch).commit();
      updated++;
    }
  }
  
  console.log(`\nDone! Updated ${updated} products.`);
}

main().catch(err => { console.error(err); process.exit(1); });
