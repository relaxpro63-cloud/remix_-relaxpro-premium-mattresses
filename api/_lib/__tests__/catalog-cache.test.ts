import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCatalog, invalidateCatalog, __setCatalogFetcher } from '../catalog';

const rawProduct = {
  name: 'Vilasa',
  slug: 'vilasa',
  inStock: true,
  pricingModel: 'with_without_accessories',
  layers: [{ material: 'latex', thickness: 4 }],
  pricing: { withoutAccessories: { queen: 41000 } },
};

describe('getCatalog', () => {
  beforeEach(() => invalidateCatalog());

  it('normalizes what the fetcher returns', async () => {
    __setCatalogFetcher(async () => [rawProduct]);
    const catalog = await getCatalog();
    expect(catalog).toHaveLength(1);
    expect(catalog[0].slug).toBe('vilasa');
    expect(catalog[0].url).toBe('/mattresses/vilasa');
  });

  it('drops products that fail normalization', async () => {
    __setCatalogFetcher(async () => [rawProduct, { name: 'No slug' }, { ...rawProduct, inStock: false }]);
    expect(await getCatalog()).toHaveLength(1);
  });

  it('serves the second call from cache without refetching', async () => {
    const fetcher = vi.fn(async () => [rawProduct]);
    __setCatalogFetcher(fetcher);
    await getCatalog();
    await getCatalog();
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it('refetches after invalidation', async () => {
    const fetcher = vi.fn(async () => [rawProduct]);
    __setCatalogFetcher(fetcher);
    await getCatalog();
    invalidateCatalog();
    await getCatalog();
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('serves the stale cache when a refetch fails', async () => {
    let call = 0;
    const fetcher = vi.fn(async () => {
      call += 1;
      if (call === 1) return [rawProduct];
      throw new Error('sanity down');
    });
    __setCatalogFetcher(fetcher);
    const first = await getCatalog();
    invalidateCatalog();
    const second = await getCatalog();
    expect(second).toEqual(first);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('rethrows when a fetch fails and no cache exists', async () => {
    __setCatalogFetcher(async () => {
      throw new Error('sanity down');
    });
    await expect(getCatalog()).rejects.toThrow('sanity down');
  });

  it('preserves stale cache when fetcher returns non-array', async () => {
    let call = 0;
    const fetcher = vi.fn(async () => {
      call += 1;
      if (call === 1) return [rawProduct];
      return null;
    }) as any;
    __setCatalogFetcher(fetcher);
    const first = await getCatalog();
    invalidateCatalog();
    const second = await getCatalog();
    expect(second).toEqual(first);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});
