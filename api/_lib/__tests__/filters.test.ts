import { describe, it, expect } from 'vitest';
import { parseFilters } from '../recommend';

describe('parseFilters', () => {
  it('parses numeric price bounds', () => {
    expect(parseFilters({ maxPrice: '20000', minPrice: '5000' })).toMatchObject({
      maxPrice: 20000,
      minPrice: 5000,
    });
  });

  it('ignores non-numeric price values', () => {
    expect(parseFilters({ maxPrice: 'cheap' }).maxPrice).toBeUndefined();
  });

  it('ignores a negative budget', () => {
    expect(parseFilters({ maxPrice: '-1' }).maxPrice).toBeUndefined();
  });

  it('lowercases and accepts a canonical size', () => {
    expect(parseFilters({ size: 'Queen' }).size).toBe('queen');
  });

  it('rejects a size the CMS never prices', () => {
    expect(parseFilters({ size: '72x36' }).size).toBeUndefined();
  });

  it('accepts a valid tier and rejects an invalid one', () => {
    expect(parseFilters({ tier: 'luxury' }).tier).toBe('luxury');
    expect(parseFilters({ tier: 'platinum' }).tier).toBeUndefined();
  });

  it('accepts a valid sleeping position', () => {
    expect(parseFilters({ sleepingPosition: 'SIDE' }).sleepingPosition).toBe('side');
    expect(parseFilters({ sleepingPosition: 'floating' }).sleepingPosition).toBeUndefined();
  });

  it('takes the first value when a query param repeats', () => {
    expect(parseFilters({ size: ['queen', 'king'] }).size).toBe('queen');
  });

  it('returns an empty object for an empty query', () => {
    expect(parseFilters({})).toEqual({});
  });
});
