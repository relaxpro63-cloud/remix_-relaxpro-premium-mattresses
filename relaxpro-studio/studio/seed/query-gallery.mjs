import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

async function main() {
  const products = await client.fetch(`
    *[_type == "product"] | order(order asc) {
      name,
      slug,
      totalThickness,
      thickness,
      comfortLevel,
      comfortRating,
      "galleryImages": images[] {
        _key,
        alt,
        caption,
        asset->{url, metadata{dimensions, lqip}},
      },
      internalArchitecture,
      components,
      specifications,
      longDescription,
      features,
    }
  `);

  for (const p of products) {
    console.log('\n' + '='.repeat(80));
    console.log(`MODEL: ${p.name}`);
    console.log(`totalThickness: ${p.totalThickness}`);
    console.log(`thickness: ${p.thickness}`);
    console.log(`comfortLevel: ${p.comfortLevel}`);
    console.log(`comfortRating: ${p.comfortRating}`);
    
    console.log('\n--- GALLERY IMAGES ---');
    if (p.galleryImages?.length) {
      for (const img of p.galleryImages) {
        console.log(`  [${img._key}] alt: "${img.alt}" | caption: "${img.caption}" | url: ${img.asset?.url?.substring(0,80)}...`);
      }
    } else {
      console.log('  (none)');
    }
    
    console.log('\n--- INTERNAL ARCHITECTURE ---');
    if (p.internalArchitecture?.length) {
      for (const layer of p.internalArchitecture) {
        console.log(`  ${JSON.stringify(layer)}`);
      }
    } else {
      console.log('  (none)');
    }
    
    console.log('\n--- COMPONENTS ---');
    if (p.components?.length) {
      for (const c of p.components) {
        console.log(`  ${JSON.stringify(c)}`);
      }
    } else {
      console.log('  (none)');
    }
    
    console.log('\n--- SPECIFICATIONS ---');
    console.log(`  ${JSON.stringify(p.specifications)}`);
    
    console.log('\n--- LONG DESCRIPTION ---');
    console.log(`  ${p.longDescription?.substring(0, 200)}...`);
    
    console.log('\n--- FEATURES ---');
    if (p.features?.length) {
      for (const f of p.features) {
        console.log(`  - ${f}`);
      }
    }
  }
}

main().catch(err => { console.error(err); process.exit(1); });
