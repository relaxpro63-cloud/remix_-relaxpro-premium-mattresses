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
      _id,
      name,
      slug,
      tagline,
      comfort,
      comfortRating,
      thickness,
      material,
      materialType,
      tier,
      longDescription,
      keyBenefit,
      description,
      construction,
      naturalLatex,
      // pricing
      pricing {
        pricingModel,
        withAccessories {
          single, diwan, double, queen, king
        },
        withoutAccessories {
          single, diwan, double, queen, king
        },
        mrp {
          single, diwan, double, queen, king
        }
      },
      // internal architecture
      internalArchitecture[] {
        thickness,
        material,
        name,
        description,
        certification
      },
      // components
      components[] {
        name,
        description,
        badge
      },
      // sizes
      sizes[] {
        label,
        dimensions,
        category
      },
      // features
      features,
      specifications
    }
  `);

  for (const p of products) {
    console.log('\n' + '='.repeat(80));
    console.log(`MODEL: ${p.name} (${p.slug})`);
    console.log(`TAGLINE: ${p.tagline}`);
    console.log(`TIER: ${p.tier}`);
    console.log(`COMFORT: ${p.comfort} (${p.comfortRating}/5)`);
    console.log(`THICKNESS: ${p.thickness}"`);
    console.log(`MATERIAL: ${p.material}`);
    console.log(`MATERIAL TYPE: ${p.materialType}`);
    console.log(`CONSTRUCTION: ${p.construction}`);
    console.log(`NATURAL LATEX: ${p.naturalLatex}`);
    console.log(`KEY BENEFIT: ${p.keyBenefit}`);
    console.log(`LONG DESCRIPTION: ${p.longDescription}`);
    console.log(`DESCRIPTION: ${p.description}`);
    
    console.log('\n--- PRICING ---');
    if (p.pricing) {
      console.log(`  Model: ${p.pricing.pricingModel}`);
      if (p.pricing.withAccessories) {
        const wa = p.pricing.withAccessories;
        console.log(`  With Acc: Single=${wa.single}, Diwan=${wa.diwan}, Double=${wa.double}, Queen=${wa.queen}, King=${wa.king}`);
      }
      if (p.pricing.withoutAccessories) {
        const wo = p.pricing.withoutAccessories;
        console.log(`  Without Acc: Single=${wo.single}, Diwan=${wo.diwan}, Double=${wo.double}, Queen=${wo.queen}, King=${wo.king}`);
      }
      if (p.pricing.mrp) {
        const mrp = p.pricing.mrp;
        console.log(`  MRP: Single=${mrp.single}, Diwan=${mrp.diwan}, Double=${mrp.double}, Queen=${mrp.queen}, King=${mrp.king}`);
      }
    }
    
    console.log('\n--- INTERNAL ARCHITECTURE ---');
    if (p.internalArchitecture?.length) {
      for (const layer of p.internalArchitecture) {
        console.log(`  ${layer.thickness}" ${layer.material} - ${layer.name}: ${layer.description} [${layer.certification}]`);
      }
    } else {
      console.log('  (none)');
    }
    
    console.log('\n--- COMPONENTS ---');
    if (p.components?.length) {
      for (const c of p.components) {
        console.log(`  ${c.name} [${c.badge}]: ${c.description}`);
      }
    } else {
      console.log('  (none)');
    }
    
    console.log('\n--- SIZES ---');
    if (p.sizes?.length) {
      for (const s of p.sizes) {
        console.log(`  ${s.label} (${s.dimensions}) [${s.category}]`);
      }
    } else {
      console.log('  (none)');
    }
    
    console.log('\n--- FEATURES ---');
    console.log(`  ${JSON.stringify(p.features)}`);
    
    console.log('\n--- SPECIFICATIONS ---');
    console.log(`  ${JSON.stringify(p.specifications)}`);
  }
  
  console.log(`\n\nTotal products: ${products.length}`);
}

main().catch(err => { console.error(err); process.exit(1); });
