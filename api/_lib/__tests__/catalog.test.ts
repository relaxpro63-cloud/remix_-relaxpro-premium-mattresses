import { describe, it, expect } from 'vitest';
import {
  normalizeProduct,
  priceFor,
  lowestPrice,
  availableSizes,
  CATALOG_SIZES,
} from '../catalog';

const accessoriesRaw = {
  name: 'Vilasa',
  slug: 'vilasa',
  tagline: 'Seven-zone natural latex',
  tier: 'luxury',
  comfortLevel: 'medium-firm',
  comfortRating: 4,
  totalThickness: 8,
  inStock: true,
  warranty: 10,
  pricingModel: 'with_without_accessories',
  layers: [
    { material: 'latex', thickness: 3 },
    { material: 'rebonded_foam', thickness: 5 },
  ],
  certifications: ['GOLS', 'OEKO-TEX'],
  pricing: {
    withAccessories: { king: 54000, queen: 46000, double: 38000, single: 22000, diwan: 0 },
    withoutAccessories: { king: 49000, queen: 41000, double: 34000, single: 19000 },
  },
};

const fabricRaw = {
  name: 'Ortho Plus',
  slug: 'ortho-plus',
  tier: 'comfort',
  comfortLevel: 'firm',
  inStock: true,
  pricingModel: 'fabric_options',
  layers: [{ material: 'rebonded_foam', thickness: 6 }],
  pricing: {
    fabric300Gsm: { king: 18000, queen: 15000, single: 9000 },
    fabric450Gsm: { king: 21000, queen: 17500, single: 10500 },
  },
};

describe('normalizeProduct', () => {
  it('strips zero prices, which mean "not defined in the CMS", not "free"', () => {
    const p = normalizeProduct(accessoriesRaw)!;
    expect(p.prices.withAccessories.diwan).toBeUndefined();
    expect(p.prices.withAccessories.king).toBe(54000);
  });

  it('never produces a price for the 18 dimension sizes absent from the CMS schema', () => {
    const p = normalizeProduct(accessoriesRaw)!;
    for (const table of Object.values(p.prices)) {
      for (const key of Object.keys(table)) {
        expect(CATALOG_SIZES).toContain(key);
      }
    }
  });

  it('derives a deduped material list from layers', () => {
    const p = normalizeProduct(accessoriesRaw)!;
    expect(p.materials).toEqual(['latex', 'rebonded_foam']);
  });

  it('returns null for an out-of-stock product', () => {
    expect(normalizeProduct({ ...accessoriesRaw, inStock: false })).toBeNull();
  });

  it('returns null when the product has no slug', () => {
    expect(normalizeProduct({ ...accessoriesRaw, slug: undefined })).toBeNull();
  });

  it('builds the product detail url from the slug', () => {
    expect(normalizeProduct(accessoriesRaw)!.url).toBe('/mattresses/vilasa');
  });
});

describe('priceFor — with_without_accessories', () => {
  const p = normalizeProduct(accessoriesRaw)!;

  it('defaults to the base price without accessories', () => {
    expect(priceFor(p, 'queen')).toBe(41000);
  });

  it('returns the accessory-inclusive price when asked', () => {
    expect(priceFor(p, 'queen', { includeAccessories: true })).toBe(46000);
  });

  it('returns null for a size the CMS does not price', () => {
    expect(priceFor(p, 'diwan', { includeAccessories: true })).toBeNull();
  });

  it('ignores an irrelevant fabricOption', () => {
    expect(priceFor(p, 'king', { fabricOption: '450GSM' })).toBe(49000);
  });
});

describe('priceFor — fabric_options', () => {
  const p = normalizeProduct(fabricRaw)!;

  it('defaults to 300 GSM', () => {
    expect(priceFor(p, 'queen')).toBe(15000);
  });

  it('returns the 450 GSM price when asked', () => {
    expect(priceFor(p, 'queen', { fabricOption: '450GSM' })).toBe(17500);
  });

  it('returns null for a size absent from both fabric tables', () => {
    expect(priceFor(p, 'double')).toBeNull();
  });
});

describe('lowestPrice', () => {
  it('returns the cheapest configuration for a given size', () => {
    expect(lowestPrice(normalizeProduct(accessoriesRaw)!, 'queen')).toBe(41000);
    expect(lowestPrice(normalizeProduct(fabricRaw)!, 'queen')).toBe(15000);
  });

  it('returns the cheapest across all sizes when no size is given', () => {
    expect(lowestPrice(normalizeProduct(accessoriesRaw)!)).toBe(19000);
  });

  it('returns null when nothing is priced', () => {
    const bare = normalizeProduct({ ...fabricRaw, pricing: {} })!;
    expect(lowestPrice(bare)).toBeNull();
  });
});

describe('availableSizes', () => {
  it('lists only sizes with a real price, in canonical order', () => {
    expect(availableSizes(normalizeProduct(accessoriesRaw)!)).toEqual([
      'single', 'double', 'queen', 'king',
    ]);
    expect(availableSizes(normalizeProduct(fabricRaw)!)).toEqual([
      'single', 'queen', 'king',
    ]);
  });
});
