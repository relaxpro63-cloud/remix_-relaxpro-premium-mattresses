import type { CatalogProduct, CatalogSize } from './catalog.js';
import type { ScoredProduct } from './recommend.js';
import { availableSizes } from './catalog.js';

export interface RecommendedProduct {
  slug: string;
  name: string;
  url: string;
  tagline: string | null;
  imageUrl: string | null;
  tier: string | null;
  comfortLevel: string | null;
  totalThickness: number | null;
  materials: string[];
  certifications: string[];
  warrantyYears: number | null;
  availableSizes: CatalogSize[];
  /** Resolved for the requested configuration. null means "not priced for this size". */
  price: number | null;
  size: CatalogSize | null;
  /** 0-100, produced by the scorer — never by the model. */
  score: number;
  reasons: string[];
}

export function toRecommendedProduct(
  product: CatalogProduct,
  scored: ScoredProduct,
): RecommendedProduct {
  return {
    slug: product.slug,
    name: product.name,
    url: product.url,
    tagline: product.tagline,
    imageUrl: product.imageUrl,
    tier: product.tier,
    comfortLevel: product.comfortLevel,
    totalThickness: product.totalThickness,
    materials: product.materials,
    certifications: product.certifications,
    warrantyYears: product.warrantyYears,
    availableSizes: availableSizes(product),
    price: scored.price,
    size: scored.size,
    score: scored.score,
    reasons: scored.reasons,
  };
}

export type LanguageKey = 'tenglish' | 'english' | 'telugu' | 'hindi';

export interface ChatRequestBody {
  sessionId: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
  language: LanguageKey;
}

export interface ChatResponseBody {
  message: string;
  products: RecommendedProduct[];
  intent: string;
  language: LanguageKey;
}
