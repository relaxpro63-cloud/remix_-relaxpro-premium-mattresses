import { describe, it, expect, beforeEach } from 'vitest';
import { TOOL_SCHEMAS, runTool } from '../tools';
import { __setCatalogFetcher, invalidateCatalog } from '../catalog';

const latex = {
  name: 'Vilasa',
  slug: 'vilasa',
  inStock: true,
  tier: 'luxury',
  comfortLevel: 'medium-firm',
  totalThickness: 8,
  warranty: 10,
  pricingModel: 'with_without_accessories',
  layers: [{ material: 'latex', thickness: 4 }],
  certifications: ['GOLS'],
  pricing: { withoutAccessories: { queen: 19000, king: 24000 } },
};

const foam = {
  name: 'Ortho Plus',
  slug: 'ortho-plus',
  inStock: true,
  tier: 'comfort',
  comfortLevel: 'firm',
  pricingModel: 'fabric_options',
  layers: [{ material: 'rebonded_foam', thickness: 6 }],
  pricing: { fabric300Gsm: { queen: 14000, king: 17000 } },
};

beforeEach(() => {
  invalidateCatalog();
  __setCatalogFetcher(async () => [latex, foam]);
});

describe('TOOL_SCHEMAS', () => {
  it('exposes the five tools in OpenAI function-calling shape', () => {
    const names = TOOL_SCHEMAS.map((t) => t.function.name);
    expect(names).toEqual([
      'search_products',
      'get_product',
      'compare_products',
      'capture_lead',
      'escalate_to_human',
    ]);
    for (const tool of TOOL_SCHEMAS) {
      expect(tool.type).toBe('function');
      expect(tool.function.parameters.type).toBe('object');
      expect(tool.function.description.length).toBeGreaterThan(30);
    }
  });
});

describe('runTool — search_products', () => {
  it('returns scored products within budget', async () => {
    const result = await runTool(
      'search_products',
      JSON.stringify({ maxPrice: 20000, size: 'queen' }),
    );
    expect(result.ok).toBe(true);
    expect(result.products.map((p) => p.slug).sort()).toEqual(['ortho-plus', 'vilasa']);
    expect(result.products.every((p) => p.price! <= 20000)).toBe(true);
  });

  it('caps the result at three products', async () => {
    const many = Array.from({ length: 8 }, (_, i) => ({ ...latex, slug: `p${i}` }));
    __setCatalogFetcher(async () => many);
    const result = await runTool('search_products', JSON.stringify({ size: 'queen' }));
    expect(result.products).toHaveLength(3);
  });

  it('returns an explicit empty result rather than a near miss', async () => {
    const result = await runTool('search_products', JSON.stringify({ maxPrice: 500 }));
    expect(result.ok).toBe(true);
    expect(result.products).toEqual([]);
    expect(result.data.found).toBe(0);
  });

  it('rejects an unknown size with a repairable error', async () => {
    const result = await runTool('search_products', JSON.stringify({ size: '72x36' }));
    expect(result.ok).toBe(false);
    expect(result.data.error).toMatch(/size/i);
  });

  it('rejects malformed JSON with a repairable error', async () => {
    const result = await runTool('search_products', '{not json');
    expect(result.ok).toBe(false);
    expect(result.data.error).toMatch(/JSON/i);
  });
});

describe('runTool — get_product', () => {
  it('returns the resolved price for the requested configuration', async () => {
    const result = await runTool(
      'get_product',
      JSON.stringify({ slug: 'vilasa', size: 'king' }),
    );
    expect(result.ok).toBe(true);
    expect(result.data.price).toBe(24000);
    expect(result.data.warrantyYears).toBe(10);
  });

  it('returns null rather than omitting a field the CMS does not have', async () => {
    const result = await runTool('get_product', JSON.stringify({ slug: 'ortho-plus' }));
    expect(result.ok).toBe(true);
    expect(result.data).toHaveProperty('warrantyYears', null);
  });

  it('reports an unknown slug without inventing a product', async () => {
    const result = await runTool('get_product', JSON.stringify({ slug: 'nonexistent' }));
    expect(result.ok).toBe(false);
    expect(result.data.error).toMatch(/not found/i);
  });
});

describe('runTool — compare_products', () => {
  it('returns comparable fields for two products', async () => {
    const result = await runTool(
      'compare_products',
      JSON.stringify({ slugs: ['vilasa', 'ortho-plus'] }),
    );
    expect(result.ok).toBe(true);
    expect(result.data.products).toHaveLength(2);
  });

  it('rejects a single-slug comparison', async () => {
    const result = await runTool('compare_products', JSON.stringify({ slugs: ['vilasa'] }));
    expect(result.ok).toBe(false);
  });
});

describe('runTool — escalate_to_human', () => {
  it('returns a wa.me url with the configured number', async () => {
    const result = await runTool('escalate_to_human', JSON.stringify({ context: 'queen latex' }));
    expect(result.ok).toBe(true);
    expect(result.data.whatsappUrl).toMatch(/^https:\/\/wa\.me\/919281424494\?text=/);
    expect(decodeURIComponent(result.data.whatsappUrl)).toContain('queen latex');
  });
});

describe('runTool — unknown tool', () => {
  it('fails safely', async () => {
    const result = await runTool('drop_database', '{}');
    expect(result.ok).toBe(false);
    expect(result.data.error).toMatch(/unknown tool/i);
  });
});
