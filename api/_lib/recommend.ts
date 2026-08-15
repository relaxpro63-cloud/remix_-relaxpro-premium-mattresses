import {
  type CatalogProduct,
  type CatalogSize,
  type Tier,
  CATALOG_SIZES,
  priceFor,
  lowestPrice,
} from './catalog.js';

export const WEIGHTS = {
  budget: 30,
  sleepingPosition: 20,
  firmness: 20,
  material: 15,
  size: 10,
  features: 5,
} as const;

export type SleepingPosition = 'side' | 'back' | 'stomach' | 'combination';

export interface Preferences {
  minPrice?: number;
  maxPrice?: number;
  size?: CatalogSize;
  firmness?: string;
  material?: string;
  sleepingPosition?: SleepingPosition;
  tier?: Tier;
  includeAccessories?: boolean;
  fabricOption?: '300GSM' | '450GSM';
}

export interface ScoredProduct {
  slug: string;
  score: number;
  reasons: string[];
  price: number | null;
  size: CatalogSize | null;
}

/** Firmness as a 1 (softest) to 5 (firmest) scale. */
const FIRMNESS_SCALE: Record<string, number> = {
  plush: 1,
  'soft-medium': 2,
  'medium-soft': 2,
  medium: 3,
  'medium-firm': 4,
  firm: 5,
};

/** Loose customer words mapped onto canonical comfort levels. */
const FIRMNESS_ALIASES: Record<string, string> = {
  soft: 'medium-soft',
  plush: 'plush',
  'very soft': 'plush',
  medium: 'medium',
  'medium soft': 'medium-soft',
  'medium firm': 'medium-firm',
  firm: 'firm',
  hard: 'firm',
  'extra firm': 'firm',
};

/** Ideal firmness point per sleeping position, on the same 1-5 scale. */
const POSITION_TARGET: Record<SleepingPosition, number> = {
  side: 2,
  combination: 3,
  back: 4,
  stomach: 5,
};

const SIZE_LABEL: Record<CatalogSize, string> = {
  single: 'Single',
  double: 'Double',
  queen: 'Queen',
  king: 'King',
  diwan: 'Diwan',
};

function firmnessValue(level: string | null | undefined): number | null {
  if (!level) return null;
  const key = level.trim().toLowerCase();
  const canonical = FIRMNESS_SCALE[key] !== undefined ? key : FIRMNESS_ALIASES[key];
  const value = FIRMNESS_SCALE[canonical ?? key];
  return value ?? null;
}

/** 1.0 at an exact match, decaying to 0 across the 4-step scale. */
function proximity(a: number, b: number): number {
  return Math.max(0, 1 - Math.abs(a - b) / 4);
}

function budgetScore(price: number, maxPrice: number): number {
  const ratio = price / maxPrice;
  if (ratio >= 0.6) return 1;
  return 0.6 + (ratio / 0.6) * 0.4;
}

export function scoreProducts(
  products: CatalogProduct[],
  prefs: Preferences,
): ScoredProduct[] {
  const priceOpts = {
    includeAccessories: prefs.includeAccessories,
    fabricOption: prefs.fabricOption,
  };

  const scored: ScoredProduct[] = [];

  for (const product of products) {
    if (prefs.tier && product.tier !== prefs.tier) continue;

    // Resolve the price we will judge and display.
    const price = prefs.size
      ? priceFor(product, prefs.size, priceOpts)
      : lowestPrice(product);

    if (prefs.size && price === null) continue; // size not offered
    if (price === null) continue; // nothing priced at all
    if (prefs.maxPrice !== undefined && price > prefs.maxPrice) continue;
    if (prefs.minPrice !== undefined && price < prefs.minPrice) continue;

    const reasons: string[] = [];
    let total = 0;

    // Budget
    if (prefs.maxPrice !== undefined) {
      total += WEIGHTS.budget * budgetScore(price, prefs.maxPrice);
      reasons.push('Within your budget');
    } else {
      total += WEIGHTS.budget;
    }

    // Size
    if (prefs.size) {
      total += WEIGHTS.size;
      reasons.push(`Available in ${SIZE_LABEL[prefs.size]} size`);
    } else {
      total += WEIGHTS.size;
    }

    const productFirmness = firmnessValue(product.comfortLevel);

    // Firmness
    if (prefs.firmness) {
      const wanted = firmnessValue(prefs.firmness);
      if (wanted !== null && productFirmness !== null) {
        const s = proximity(productFirmness, wanted);
        total += WEIGHTS.firmness * s;
        if (s >= 0.99) reasons.push('Matches your preferred firmness');
        else if (s >= 0.75) reasons.push('Close to your preferred firmness');
      } else {
        total += WEIGHTS.firmness;
      }
    } else {
      total += WEIGHTS.firmness;
    }

    // Sleeping position
    if (prefs.sleepingPosition) {
      const target = POSITION_TARGET[prefs.sleepingPosition];
      if (productFirmness !== null) {
        const s = proximity(productFirmness, target);
        total += WEIGHTS.sleepingPosition * s;
        if (s >= 0.75) reasons.push(`Suits ${prefs.sleepingPosition} sleepers`);
      } else {
        total += WEIGHTS.sleepingPosition;
      }
    } else {
      total += WEIGHTS.sleepingPosition;
    }

    // Material
    if (prefs.material) {
      const wanted = prefs.material.trim().toLowerCase();
      const matched = product.materials.some((m) => m.toLowerCase().includes(wanted));
      total += WEIGHTS.material * (matched ? 1 : 0);
      if (matched) reasons.push(`Built with ${prefs.material.replace(/_/g, ' ')}`);
    } else {
      total += WEIGHTS.material;
    }

    // Features — certifications are the meaningful differentiator for this brand.
    if (product.certifications.length > 0) {
      total += WEIGHTS.features;
      reasons.push(`${product.certifications.join(', ')} certified`);
    } else {
      total += WEIGHTS.features * 0.5;
    }

    scored.push({
      slug: product.slug,
      score: Math.round(Math.min(100, Math.max(0, total))),
      reasons,
      price,
      size: prefs.size ?? null,
    });
  }

  return scored.sort((a, b) => b.score - a.score);
}

type QueryValue = string | string[] | undefined;

function first(v: QueryValue): string | undefined {
  const value = Array.isArray(v) ? v[0] : v;
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function positiveNumber(v: QueryValue): number | undefined {
  const raw = first(v);
  if (raw === undefined) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

const TIERS: Tier[] = ['comfort', 'premium', 'luxury'];
const POSITIONS: SleepingPosition[] = ['side', 'back', 'stomach', 'combination'];

export function parseFilters(query: Record<string, QueryValue>): Preferences {
  const prefs: Preferences = {};

  const maxPrice = positiveNumber(query.maxPrice);
  if (maxPrice !== undefined) prefs.maxPrice = maxPrice;

  const minPrice = positiveNumber(query.minPrice);
  if (minPrice !== undefined) prefs.minPrice = minPrice;

  const size = first(query.size)?.toLowerCase();
  if (size && (CATALOG_SIZES as readonly string[]).includes(size)) {
    prefs.size = size as CatalogSize;
  }

  const tier = first(query.tier)?.toLowerCase();
  if (tier && (TIERS as string[]).includes(tier)) prefs.tier = tier as Tier;

  const position = first(query.sleepingPosition)?.toLowerCase();
  if (position && (POSITIONS as string[]).includes(position)) {
    prefs.sleepingPosition = position as SleepingPosition;
  }

  const firmness = first(query.firmness);
  if (firmness) prefs.firmness = firmness.toLowerCase();

  const material = first(query.material);
  if (material) prefs.material = material.toLowerCase();

  if (first(query.includeAccessories) === 'true') prefs.includeAccessories = true;

  const fabric = first(query.fabricOption)?.toUpperCase();
  if (fabric === '300GSM' || fabric === '450GSM') prefs.fabricOption = fabric;

  return prefs;
}
