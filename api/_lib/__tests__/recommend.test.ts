import { describe, it, expect } from 'vitest';
import { scoreProducts, WEIGHTS } from '../recommend';
import { normalizeProduct, type CatalogProduct } from '../catalog';

function make(overrides: Record<string, unknown>): CatalogProduct {
  return normalizeProduct({
    name: 'Test',
    slug: 'test',
    inStock: true,
    pricingModel: 'with_without_accessories',
    comfortLevel: 'medium',
    layers: [{ material: 'latex', thickness: 4 }],
    certifications: ['GOLS'],
    pricing: { withoutAccessories: { queen: 20000, king: 25000, single: 12000 } },
    ...overrides,
  })!;
}

describe('WEIGHTS', () => {
  it('sums to 100 so the score reads as a percentage', () => {
    const total = Object.values(WEIGHTS).reduce((a, b) => a + b, 0);
    expect(total).toBe(100);
  });
});

describe('scoreProducts', () => {
  it('scores 100 when no preferences are given and the product is certified', () => {
    const [result] = scoreProducts([make({})], {});
    expect(result.score).toBe(100);
  });

  it('excludes products with no price for the requested size', () => {
    const noQueen = make({
      slug: 'no-queen',
      pricing: { withoutAccessories: { king: 25000 } },
    });
    expect(scoreProducts([noQueen], { size: 'queen' })).toEqual([]);
  });

  it('excludes products above the stated budget', () => {
    expect(scoreProducts([make({})], { size: 'queen', maxPrice: 15000 })).toEqual([]);
  });

  it('keeps a product exactly at budget', () => {
    const results = scoreProducts([make({})], { size: 'queen', maxPrice: 20000 });
    expect(results).toHaveLength(1);
  });

  it('rewards using the budget well over undershooting it', () => {
    const cheap = make({ slug: 'cheap', pricing: { withoutAccessories: { queen: 6000 } } });
    const wellMatched = make({ slug: 'matched', pricing: { withoutAccessories: { queen: 19000 } } });
    const [top] = scoreProducts([cheap, wellMatched], { size: 'queen', maxPrice: 20000 });
    expect(top.slug).toBe('matched');
  });

  it('ranks an exact firmness match above a distant one', () => {
    const firm = make({ slug: 'firm', comfortLevel: 'firm' });
    const plush = make({ slug: 'plush', comfortLevel: 'plush' });
    const [top] = scoreProducts([plush, firm], { firmness: 'firm' });
    expect(top.slug).toBe('firm');
  });

  it('accepts loose firmness words like "soft"', () => {
    const soft = make({ slug: 'soft', comfortLevel: 'medium-soft' });
    const firm = make({ slug: 'firm', comfortLevel: 'firm' });
    const [top] = scoreProducts([firm, soft], { firmness: 'soft' });
    expect(top.slug).toBe('soft');
  });

  it('ranks a matching material above a non-matching one', () => {
    const latex = make({ slug: 'latex' });
    const foam = make({ slug: 'foam', layers: [{ material: 'rebonded_foam', thickness: 6 }] });
    const [top] = scoreProducts([foam, latex], { material: 'latex' });
    expect(top.slug).toBe('latex');
  });

  it('prefers softer mattresses for side sleepers', () => {
    const firm = make({ slug: 'firm', comfortLevel: 'firm' });
    const soft = make({ slug: 'soft', comfortLevel: 'medium-soft' });
    const [top] = scoreProducts([firm, soft], { sleepingPosition: 'side' });
    expect(top.slug).toBe('soft');
  });

  it('prefers firmer mattresses for stomach sleepers', () => {
    const firm = make({ slug: 'firm', comfortLevel: 'firm' });
    const soft = make({ slug: 'soft', comfortLevel: 'medium-soft' });
    const [top] = scoreProducts([soft, firm], { sleepingPosition: 'stomach' });
    expect(top.slug).toBe('firm');
  });

  it('filters by tier when one is requested', () => {
    const luxury = make({ slug: 'luxury', tier: 'luxury' });
    const comfort = make({ slug: 'comfort', tier: 'comfort' });
    const results = scoreProducts([luxury, comfort], { tier: 'luxury' });
    expect(results.map((r) => r.slug)).toEqual(['luxury']);
  });

  it('generates a reason only for preferences the customer stated', () => {
    const [result] = scoreProducts([make({})], { size: 'queen', maxPrice: 25000 });
    expect(result.reasons).toContain('Within your budget');
    expect(result.reasons).toContain('Available in Queen size');
    expect(result.reasons.some((r) => r.includes('firmness'))).toBe(false);
  });

  it('returns results sorted by descending score', () => {
    const a = make({ slug: 'a', comfortLevel: 'firm' });
    const b = make({ slug: 'b', comfortLevel: 'plush' });
    const results = scoreProducts([b, a], { firmness: 'firm' });
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
  });

  it('returns integer scores between 0 and 100', () => {
    const results = scoreProducts([make({})], { firmness: 'firm', material: 'rebonded_foam' });
    for (const r of results) {
      expect(Number.isInteger(r.score)).toBe(true);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });
});
