import { sanityClient } from './sanity';

export const CATALOG_SIZES = ['single', 'double', 'queen', 'king', 'diwan'] as const;
export type CatalogSize = (typeof CATALOG_SIZES)[number];

export type PricingModel = 'with_without_accessories' | 'fabric_options';
export type Tier = 'comfort' | 'premium' | 'luxury';

export type SizePriceMap = Partial<Record<CatalogSize, number>>;

export interface PriceTable {
  withAccessories: SizePriceMap;
  withoutAccessories: SizePriceMap;
  fabric300Gsm: SizePriceMap;
  fabric450Gsm: SizePriceMap;
}

export interface PriceOptions {
  /** Defaults to false — the honest "from" price. */
  includeAccessories?: boolean;
  /** Defaults to '300GSM'. */
  fabricOption?: '300GSM' | '450GSM';
}

export interface CatalogProduct {
  slug: string;
  name: string;
  url: string;
  tagline: string | null;
  keyBenefit: string | null;
  description: string | null;
  tier: Tier | null;
  comfortLevel: string | null;
  comfortRating: number | null;
  totalThickness: number | null;
  materials: string[];
  certifications: string[];
  accessories: string[];
  features: string[];
  fabricGsm: number | null;
  fabricType: string | null;
  warrantyYears: number | null;
  rating: number | null;
  reviewCount: number | null;
  isBestseller: boolean;
  categoryName: string | null;
  imageUrl: string | null;
  pricingModel: PricingModel | null;
  prices: PriceTable;
}

const EMPTY_TABLE = (): PriceTable => ({
  withAccessories: {},
  withoutAccessories: {},
  fabric300Gsm: {},
  fabric450Gsm: {},
});

/**
 * Keeps only canonical sizes with a finite, positive price.
 * A 0 in Sanity means "not defined", never "free".
 */
function normalizeSizeMap(raw: unknown): SizePriceMap {
  const out: SizePriceMap = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const size of CATALOG_SIZES) {
    const value = (raw as Record<string, unknown>)[size];
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      out[size] = value;
    }
  }
  return out;
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function strArray(v: unknown): string[] {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x.trim()) : [];
}

export function normalizeProduct(raw: any): CatalogProduct | null {
  const slug = str(raw?.slug);
  const name = str(raw?.name);
  if (!slug || !name) return null;
  if (raw?.inStock === false) return null;

  const layers: any[] = Array.isArray(raw?.layers) ? raw.layers : [];
  const materials = [
    ...new Set(layers.map((l: any) => str(l?.material)).filter((m: string | null): m is string => !!m)),
  ];

  const pricing = raw?.pricing ?? {};

  return {
    slug,
    name,
    url: `/mattresses/${slug}`,
    tagline: str(raw?.tagline),
    keyBenefit: str(raw?.keyBenefit),
    description: str(raw?.description) ?? str(raw?.shortDescription),
    tier: (['comfort', 'premium', 'luxury'] as const).includes(raw?.tier) ? raw.tier : null,
    comfortLevel: str(raw?.comfortLevel),
    comfortRating: num(raw?.comfortRating),
    totalThickness: num(raw?.totalThickness),
    materials,
    certifications: strArray(raw?.certifications),
    accessories: strArray(raw?.accessories),
    features: strArray(raw?.features),
    fabricGsm: num(raw?.fabricGsm),
    fabricType: str(raw?.fabricType),
    warrantyYears: num(raw?.warranty),
    rating: num(raw?.rating),
    reviewCount: num(raw?.reviewCount),
    isBestseller: raw?.isBestseller === true,
    categoryName: str(raw?.category?.name),
    imageUrl: str(raw?.image?.asset?.url) ?? str(raw?.images?.[0]?.asset?.url),
    pricingModel:
      raw?.pricingModel === 'with_without_accessories' || raw?.pricingModel === 'fabric_options'
        ? raw.pricingModel
        : null,
    prices: {
      ...EMPTY_TABLE(),
      withAccessories: normalizeSizeMap(pricing.withAccessories),
      withoutAccessories: normalizeSizeMap(pricing.withoutAccessories),
      fabric300Gsm: normalizeSizeMap(pricing.fabric300Gsm),
      fabric450Gsm: normalizeSizeMap(pricing.fabric450Gsm),
    },
  };
}

export function priceFor(
  product: CatalogProduct,
  size: CatalogSize,
  opts: PriceOptions = {},
): number | null {
  const { prices, pricingModel } = product;
  const table =
    pricingModel === 'fabric_options'
      ? opts.fabricOption === '450GSM'
        ? prices.fabric450Gsm
        : prices.fabric300Gsm
      : opts.includeAccessories === true
        ? prices.withAccessories
        : prices.withoutAccessories;

  return table[size] ?? null;
}

export function lowestPrice(product: CatalogProduct, size?: CatalogSize): number | null {
  const tables = Object.values(product.prices);
  const candidates: number[] = [];
  for (const table of tables) {
    if (size) {
      const v = table[size];
      if (typeof v === 'number') candidates.push(v);
    } else {
      candidates.push(...(Object.values(table) as number[]));
    }
  }
  return candidates.length ? Math.min(...candidates) : null;
}

export function availableSizes(product: CatalogProduct): CatalogSize[] {
  return CATALOG_SIZES.filter((size) =>
    Object.values(product.prices).some((table) => typeof table[size] === 'number'),
  );
}

const CATALOG_QUERY = `*[_type == "product" && inStock == true] | order(sortOrder asc){
  name, "slug": slug.current, tagline, keyBenefit, description, shortDescription,
  tier, comfortLevel, comfortRating, totalThickness, warranty,
  layers[]{ material, thickness },
  fabricGsm, fabricType, certifications, accessories, features,
  pricingModel, pricing,
  rating, reviewCount, isBestseller, inStock,
  category->{ name },
  image{ asset->{ url } },
  images[]{ asset->{ url } }
}`;

const CACHE_TTL_MS = 5 * 60 * 1000;

type CatalogFetcher = () => Promise<any[]>;

let fetcher: CatalogFetcher = () => sanityClient.fetch(CATALOG_QUERY);
let cache: { products: CatalogProduct[]; expiresAt: number } | null = null;

/** Test seam. Not used in production code paths. */
export function __setCatalogFetcher(fn: CatalogFetcher): void {
  fetcher = fn;
  cache = null;
}

export function invalidateCatalog(): void {
  if (cache) cache = { ...cache, expiresAt: 0 };
}

export async function getCatalog(): Promise<CatalogProduct[]> {
  if (cache && cache.expiresAt > Date.now()) return cache.products;

  try {
    const raw = await fetcher();
    // Treat non-array responses as errors so they fall through to stale-cache preservation.
    // Empty arrays are valid (all products could be out of stock).
    if (!Array.isArray(raw)) {
      throw new Error('Fetcher returned non-array response');
    }
    const products = raw
      .map(normalizeProduct)
      .filter((p): p is CatalogProduct => p !== null);
    cache = { products, expiresAt: Date.now() + CACHE_TTL_MS };
    return products;
  } catch (err) {
    // A stale catalog beats no catalog — the assistant stays useful during a
    // Sanity outage rather than telling every visitor it is broken.
    if (cache) return cache.products;
    throw err;
  }
}

export function findProduct(products: CatalogProduct[], slug: string): CatalogProduct | null {
  return products.find((p) => p.slug === slug) ?? null;
}
