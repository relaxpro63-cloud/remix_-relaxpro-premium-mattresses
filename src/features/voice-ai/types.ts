import type { LanguageKey } from './lib/languages';

export type CatalogSize = 'single' | 'double' | 'queen' | 'king' | 'diwan';

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
  price: number | null;
  size: CatalogSize | null;
  score: number;
  reasons: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponseBody {
  message: string;
  products: RecommendedProduct[];
  intent: string;
  language: LanguageKey;
}
