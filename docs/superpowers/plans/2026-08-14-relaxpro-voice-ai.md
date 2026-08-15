# RelaxPro AI Voice Assistant — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a voice-and-text sales assistant to the RelaxPro site that answers in Telugu/Tenglish/English, recommends real mattresses from the Sanity catalog, and captures leads into the existing Google Sheet.

**Architecture:** Vercel serverless functions in the existing repo call Groq (`llama-3.3-70b-versatile`) with tool calling. Product filtering, pricing, and match scoring run as deterministic server code — the model never produces a number. A lazy-loaded React widget uses the browser's Web Speech API for microphone and speech, degrading to a text chat where unsupported.

**Tech Stack:** Vercel Node functions, `groq-sdk`, `zod`, `@sanity/client`, React 19, Tailwind v4, `motion`, Vitest.

**Spec:** `docs/superpowers/specs/2026-08-14-relaxpro-voice-ai-design.md`

## Global Constraints

- **Never emit a price, size, thickness, warranty, or stock value that did not come from a tool result.** Model-authored numbers are a defect.
- A price of `0` or a missing key in Sanity means **"not available"**, never "free". `MattressSize` in `src/types.ts` has 18 dimension sizes (`72x36`…`78x72`) absent from the Sanity `product.pricing` schema; they must never be offered.
- Node `>=20.0.0` (existing `engines` field).
- Repo is on branch `main`. **Branch before the first commit.**
- `GROQ_API_KEY` lives only in Vercel environment variables. Never in a committed file. `.env.example` gets the name with an empty value — note `.env.example` is *not* gitignored.
- WhatsApp number comes from `WHATSAPP_NUMBER` / `buildWhatsAppUrl` in `src/lib/site.ts`. Do not introduce a second copy.
- Default language is **Tenglish**. Hindi is wired but `enabled: false`.
- Existing user-facing error strings are fixed copy — reproduce them exactly (see Task 7 and Task 12).
- The site must function normally when `/api/chat` is unavailable.

---

## File Structure

**New — backend**

| File | Responsibility |
|---|---|
| `api/tsconfig.json` | Separate TS config; the app's root `tsconfig.json` sets `noEmit` and `allowImportingTsExtensions`, which break function builds |
| `api/_lib/catalog.ts` | Sanity fetch, product normalization, `priceFor()` — the single source of price truth |
| `api/_lib/recommend.ts` | Pure weighted scorer. No I/O |
| `api/_lib/llm.ts` | Groq client behind a narrow interface — the only file that knows the vendor |
| `api/_lib/prompt.ts` | System prompt assembly, per-language blocks |
| `api/_lib/tools.ts` | Tool schemas, Zod validators, handlers |
| `api/_lib/ratelimit.ts` | Per-IP limiter and daily request cap |
| `api/_lib/types.ts` | Shared wire types (`RecommendedProduct`, `ChatRequest`, `ChatResponse`) |
| `api/products.ts` | `GET /api/products` |
| `api/chat.ts` | `POST /api/chat` |
| `api/lead.ts` | `POST /api/lead` |

**New — frontend, all under `src/features/voice-ai/`**

| File | Responsibility |
|---|---|
| `lib/languages.ts` | Language table + `pickVoice()` — single source of language truth |
| `lib/api.ts` | `postChat()`, typed fetch wrapper |
| `types.ts` | `ChatMessage`, re-exported wire types |
| `hooks/useVoiceRecognition.ts` | Mic lifecycle, support detection, error mapping |
| `hooks/useSpeechSynthesis.ts` | TTS, voice selection, enable toggle |
| `hooks/useChat.ts` | Session id, history, request lifecycle |
| `components/MessageBubble.tsx` | One message |
| `components/MessageList.tsx` | Scroll container, `aria-live` |
| `components/ProductRecommendationCard.tsx` | Card built from tool data |
| `components/QuickActions.tsx` | Six preset prompts |
| `components/LanguagePicker.tsx` | Tenglish / English / Telugu |
| `components/MicButton.tsx` | Idle / listening / processing |
| `components/LeadCaptureForm.tsx` | Name, phone, contact preference |
| `VoiceAssistant.tsx` | Shell — FAB, desktop panel, mobile sheet |

**Modified**

| File | Change |
|---|---|
| `vercel.json` | Rewrite must exclude `/api/*` |
| `package.json` | Add `groq-sdk`, `zod`; dev `vitest`, `jsdom`, `@testing-library/react`, `@vercel/node`; `test` script |
| `.env.example` | Add `GROQ_API_KEY`, `AI_DAILY_REQUEST_CAP` |
| `src/App.tsx` | Mount `VoiceAssistant`, remove `WhatsAppFAB` |
| `google-apps-script.gs` | Add `AI Summary` column |

---

## Task 1: Catalog normalization and price resolution

The highest-risk logic in the feature. Everything downstream trusts `priceFor()`.

**Files:**
- Create: `api/tsconfig.json`
- Create: `api/_lib/catalog.ts`
- Create: `api/_lib/__tests__/catalog.test.ts`
- Create: `vitest.config.ts`
- Modify: `package.json`
- Modify: `vercel.json`
- Modify: `.env.example`

**Interfaces:**
- Consumes: nothing.
- Produces: `CatalogSize`, `CATALOG_SIZES`, `CatalogProduct`, `PriceTable`, `PriceOptions`, `normalizeProduct(raw): CatalogProduct | null`, `priceFor(p, size, opts?): number | null`, `lowestPrice(p, size?): number | null`, `availableSizes(p): CatalogSize[]`.

- [ ] **Step 1: Create the branch**

```bash
git checkout -b feat/voice-ai
```

- [ ] **Step 2: Install dependencies**

```bash
npm install groq-sdk zod
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @vercel/node
```

- [ ] **Step 3: Add the test script to `package.json`**

In the `"scripts"` block, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
    exclude: ['node_modules', 'dist', 'relaxpro-studio', 'relaxpro-sanity', 'relaxpro-next'],
  },
});
```

- [ ] **Step 5: Create `api/tsconfig.json`**

The root `tsconfig.json` sets `"noEmit": true` and `"allowImportingTsExtensions": true`, which prevent Vercel from building the functions. The `api/` tree needs its own.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "types": ["node"],
    "noEmit": true
  },
  "include": ["./**/*.ts"]
}
```

- [ ] **Step 6: Fix the SPA catch-all in `vercel.json`**

The current rewrite sends every path to `index.html`, which would swallow `/api/*`. Replace the `rewrites` array with:

```json
"rewrites": [
  {
    "source": "/((?!api/).*)",
    "destination": "/index.html"
  }
]
```

Leave `redirects` and `headers` untouched.

- [ ] **Step 7: Add env var names to `.env.example`**

Append:

```
# Groq API key for the RelaxPro AI assistant (server-side only, never exposed to the browser).
# Set this in the Vercel dashboard, not in a committed file.
GROQ_API_KEY=""

# Safety valve: max /api/chat requests served per UTC day before the assistant
# returns its connection-failure message instead of calling Groq.
AI_DAILY_REQUEST_CAP="2000"
```

- [ ] **Step 8: Write the failing tests**

Create `api/_lib/__tests__/catalog.test.ts`:

```ts
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
```

- [ ] **Step 9: Run the tests to verify they fail**

Run: `npm test -- catalog`
Expected: FAIL — `Failed to resolve import "../catalog"`.

- [ ] **Step 10: Implement `api/_lib/catalog.ts`**

Write only the pure part now; the Sanity fetch arrives in Task 3.

```ts
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

  const layers = Array.isArray(raw?.layers) ? raw.layers : [];
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
      candidates.push(...Object.values(table));
    }
  }
  return candidates.length ? Math.min(...candidates) : null;
}

export function availableSizes(product: CatalogProduct): CatalogSize[] {
  return CATALOG_SIZES.filter((size) =>
    Object.values(product.prices).some((table) => typeof table[size] === 'number'),
  );
}
```

- [ ] **Step 11: Run the tests to verify they pass**

Run: `npm test -- catalog`
Expected: PASS, 16 tests.

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json vitest.config.ts vercel.json .env.example api/tsconfig.json api/_lib/catalog.ts api/_lib/__tests__/catalog.test.ts
git commit -m "feat(ai): catalog normalization and price resolution with tests"
```

---

## Task 2: Recommendation scorer

**Files:**
- Create: `api/_lib/recommend.ts`
- Create: `api/_lib/__tests__/recommend.test.ts`

**Interfaces:**
- Consumes: `CatalogProduct`, `CatalogSize`, `priceFor`, `lowestPrice` from `./catalog`.
- Produces: `Preferences`, `ScoredProduct`, `WEIGHTS`, `scoreProducts(products, prefs): ScoredProduct[]`.

**Design notes for the implementer:**

Weights come from the spec and sum to 100: budget 30, sleeping position 20, firmness 20, material 15, size 10, features 5.

A signal the customer did **not** specify scores a neutral `1.0` (full weight). Without this, a customer who states only a budget could never exceed 30% and the number on the card would be meaningless. Reasons are generated only for signals the customer *did* specify and that matched.

- [ ] **Step 1: Write the failing tests**

Create `api/_lib/__tests__/recommend.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- recommend`
Expected: FAIL — `Failed to resolve import "../recommend"`.

- [ ] **Step 3: Implement `api/_lib/recommend.ts`**

```ts
import {
  type CatalogProduct,
  type CatalogSize,
  type Tier,
  priceFor,
  lowestPrice,
} from './catalog';

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
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- recommend`
Expected: PASS, 14 tests.

- [ ] **Step 5: Commit**

```bash
git add api/_lib/recommend.ts api/_lib/__tests__/recommend.test.ts
git commit -m "feat(ai): deterministic weighted recommendation scorer"
```

---

## Task 3: Sanity catalog fetch and cache

**Files:**
- Create: `api/_lib/sanity.ts`
- Modify: `api/_lib/catalog.ts` (append the fetch layer)
- Create: `api/_lib/__tests__/catalog-cache.test.ts`

**Interfaces:**
- Consumes: `normalizeProduct` from `./catalog`.
- Produces: `sanityClient` from `./sanity`; `getCatalog(): Promise<CatalogProduct[]>`, `invalidateCatalog(): void`, `__setCatalogFetcher(fn)` from `./catalog`.

`__setCatalogFetcher` exists so the cache can be tested without network access. It is the only test seam in production code and is prefixed to mark it as such.

- [ ] **Step 1: Create `api/_lib/sanity.ts`**

Mirrors the front-end client in `src/lib/sanity.ts`, minus the dev CORS proxy — serverless has no CORS problem.

```ts
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'de6mndac',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});
```

- [ ] **Step 2: Write the failing tests**

Create `api/_lib/__tests__/catalog-cache.test.ts`:

```ts
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
    __setCatalogFetcher(async () => {
      call += 1;
      if (call === 1) return [rawProduct];
      throw new Error('sanity down');
    });
    const first = await getCatalog();
    invalidateCatalog();
    const second = await getCatalog();
    expect(second).toEqual(first);
  });

  it('rethrows when a fetch fails and no cache exists', async () => {
    __setCatalogFetcher(async () => {
      throw new Error('sanity down');
    });
    await expect(getCatalog()).rejects.toThrow('sanity down');
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test -- catalog-cache`
Expected: FAIL — `getCatalog is not a function`.

- [ ] **Step 4: Append the fetch layer to `api/_lib/catalog.ts`**

Add at the end of the file:

```ts
import { sanityClient } from './sanity';

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
    const products = (Array.isArray(raw) ? raw : [])
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
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test`
Expected: PASS — all three test files, 36 tests.

- [ ] **Step 6: Commit**

```bash
git add api/_lib/sanity.ts api/_lib/catalog.ts api/_lib/__tests__/catalog-cache.test.ts
git commit -m "feat(ai): sanity catalog fetch with stale-on-error cache"
```

---

## Task 4: `GET /api/products`

**Files:**
- Create: `api/_lib/types.ts`
- Create: `api/products.ts`
- Create: `api/_lib/__tests__/filters.test.ts`
- Modify: `api/_lib/recommend.ts` (add `parseFilters`)

**Interfaces:**
- Consumes: `getCatalog`, `CatalogProduct`, `priceFor`, `availableSizes`, `lowestPrice`; `scoreProducts`, `Preferences`.
- Produces: `RecommendedProduct`, `toRecommendedProduct(product, scored)` from `./_lib/types`; `parseFilters(query): Preferences` from `./_lib/recommend`.

- [ ] **Step 1: Create `api/_lib/types.ts`**

The wire shape shared by `/api/products`, `/api/chat`, and the widget.

```ts
import type { CatalogProduct, CatalogSize } from './catalog';
import type { ScoredProduct } from './recommend';
import { availableSizes } from './catalog';

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
```

- [ ] **Step 2: Write the failing test**

Create `api/_lib/__tests__/filters.test.ts`:

```ts
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
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm test -- filters`
Expected: FAIL — `parseFilters is not a function`.

- [ ] **Step 4: Add `parseFilters` to `api/_lib/recommend.ts`**

Append to the file:

```ts
import { CATALOG_SIZES } from './catalog';

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
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm test -- filters`
Expected: PASS, 9 tests.

- [ ] **Step 6: Create `api/products.ts`**

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCatalog, findProduct } from './_lib/catalog';
import { parseFilters, scoreProducts } from './_lib/recommend';
import { toRecommendedProduct } from './_lib/types';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const catalog = await getCatalog();
    const prefs = parseFilters(req.query as Record<string, string | string[] | undefined>);
    const scored = scoreProducts(catalog, prefs);

    const products = scored
      .map((s) => {
        const product = findProduct(catalog, s.slug);
        return product ? toRecommendedProduct(product, s) : null;
      })
      .filter((p) => p !== null);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ products, count: products.length });
  } catch {
    return res.status(503).json({ error: 'Catalog unavailable', products: [], count: 0 });
  }
}
```

- [ ] **Step 7: Verify the endpoint manually**

```bash
npx vercel dev --listen 3000
```

In a second terminal:

```bash
curl -s "http://localhost:3000/api/products?maxPrice=20000&size=queen" | head -c 600
```

Expected: JSON with a `products` array. Every entry has a numeric `price` at or below 20000 and `"size": "queen"`. Confirm no entry has `"price": 0`.

- [ ] **Step 8: Commit**

```bash
git add api/_lib/types.ts api/_lib/recommend.ts api/products.ts api/_lib/__tests__/filters.test.ts
git commit -m "feat(ai): GET /api/products with validated filters"
```

---

## Task 5: Groq client and system prompt

**Files:**
- Create: `api/_lib/llm.ts`
- Create: `api/_lib/prompt.ts`
- Create: `api/_lib/__tests__/prompt.test.ts`

**Interfaces:**
- Consumes: `LanguageKey` from `./types`.
- Produces: `chatCompletion(params): Promise<ChatCompletionResult>`, `LlmMessage`, `LlmToolCall`, `MODEL_ID` from `./llm`; `buildSystemPrompt(language): string` from `./prompt`.

- [ ] **Step 1: Create `api/_lib/llm.ts`**

The only file that names the vendor. If Telugu quality forces a second provider later (see spec §4), the change is contained here.

```ts
import Groq from 'groq-sdk';

export const MODEL_ID = 'llama-3.3-70b-versatile';

export interface LlmToolCall {
  id: string;
  name: string;
  /** Raw JSON string as produced by the model. Always validate before use. */
  argumentsJson: string;
}

export type LlmMessage =
  | { role: 'system' | 'user'; content: string }
  | { role: 'assistant'; content: string | null; tool_calls?: any[] }
  | { role: 'tool'; tool_call_id: string; content: string };

export interface ChatCompletionResult {
  content: string;
  toolCalls: LlmToolCall[];
  /** The raw assistant message, to be pushed back into the conversation verbatim. */
  raw: any;
}

let client: Groq | null = null;

function getClient(): Groq {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('GROQ_API_KEY is not set');
    client = new Groq({ apiKey });
  }
  return client;
}

export async function chatCompletion(params: {
  messages: LlmMessage[];
  tools?: any[];
}): Promise<ChatCompletionResult> {
  const completion = await getClient().chat.completions.create({
    model: MODEL_ID,
    messages: params.messages as any,
    tools: params.tools,
    tool_choice: params.tools?.length ? 'auto' : undefined,
    temperature: 0.5,
    max_completion_tokens: 1024,
  });

  const message = completion.choices[0]?.message;
  const toolCalls: LlmToolCall[] = (message?.tool_calls ?? []).map((c: any) => ({
    id: c.id,
    name: c.function.name,
    argumentsJson: c.function.arguments ?? '{}',
  }));

  return {
    content: message?.content ?? '',
    toolCalls,
    raw: message,
  };
}
```

- [ ] **Step 2: Write the failing tests**

Create `api/_lib/__tests__/prompt.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildSystemPrompt } from '../prompt';

describe('buildSystemPrompt', () => {
  it('always states the identity', () => {
    expect(buildSystemPrompt('english')).toContain('You are RelaxPro AI');
  });

  it('always carries the anti-invention rule', () => {
    for (const lang of ['english', 'tenglish', 'telugu', 'hindi'] as const) {
      expect(buildSystemPrompt(lang)).toMatch(/Never invent product specifications/);
    }
  });

  it('always carries the medical boundary', () => {
    expect(buildSystemPrompt('tenglish')).toMatch(/not a doctor/i);
  });

  it('always forbids asking for a phone number before buying intent', () => {
    expect(buildSystemPrompt('english')).toMatch(/do not ask for a phone number/i);
  });

  it('instructs Tenglish replies for the tenglish language', () => {
    const prompt = buildSystemPrompt('tenglish');
    expect(prompt).toMatch(/conversational Tenglish/);
    expect(prompt).toContain('Naaku');
  });

  it('instructs plain Indian English for the english language', () => {
    expect(buildSystemPrompt('english')).toMatch(/Reply in clear, simple English/);
  });

  it('instructs Telugu script for the telugu language', () => {
    expect(buildSystemPrompt('telugu')).toMatch(/Telugu script/);
  });

  it('instructs Hindi for the hindi language', () => {
    expect(buildSystemPrompt('hindi')).toMatch(/Hindi/);
  });

  it('produces a different language block per language', () => {
    const seen = new Set(
      (['english', 'tenglish', 'telugu', 'hindi'] as const).map(buildSystemPrompt),
    );
    expect(seen.size).toBe(4);
  });
});
```

- [ ] **Step 3: Run the tests to verify they fail**

Run: `npm test -- prompt`
Expected: FAIL — `Failed to resolve import "../prompt"`.

- [ ] **Step 4: Implement `api/_lib/prompt.ts`**

The base text is the spec's system prompt, verbatim.

```ts
import type { LanguageKey } from './types';

const BASE = `You are RelaxPro AI, the official virtual mattress shopping assistant for RelaxPro.

Your job is to help customers understand RelaxPro mattresses and choose products based only on verified RelaxPro product information supplied to you.

Customers may speak English, Telugu, Tenglish, Hindi, or mixed language. If the customer uses Tenglish, respond naturally in conversational Tenglish. Do not use overly formal Telugu unless the customer requests it.

You are a sales assistant, not a doctor. Never make medical diagnoses or medical guarantees. Never say that a mattress will cure back pain, neck pain, arthritis, or any disease. If a customer asks for medical advice, say that mattress choice can depend on individual circumstances and recommend consulting a qualified healthcare professional for medical concerns.

Never invent product specifications, prices, sizes, stock, warranty, delivery times, discounts, or offers. Only use the product information provided by the application. If information is missing, say that you do not have the information and recommend contacting a RelaxPro expert.

Ask short clarification questions when necessary. When recommending a mattress, explain briefly why it matches the customer's stated preferences.

Prioritize: customer requirements, budget, mattress size, sleeping position, firmness preference, material preference, verified product data.

Always remain friendly, concise, and helpful. If the customer wants to buy or speak with a human, offer WhatsApp or lead capture. Do not pressure the customer to purchase.`;

const OPERATIONAL = `## How you must operate

- Call search_products before recommending anything. Never name a product or a price from memory.
- Every price, size, thickness, and warranty figure you state must come from a tool result in this conversation. If a tool returned null for a field, say you do not have that information and suggest contacting the RelaxPro team.
- The application displays product cards itself from the tool data. Do not repeat full specification lists in your text — mention the product by name and say in one line why it fits.
- Do not ask for a phone number, name, or contact details until the customer shows buying intent (for example "I want to buy", "can someone call me", "WhatsApp me"). Help first.
- Keep replies to two or three short sentences unless the customer asks for detail.
- Prices are in Indian Rupees. Write them as ₹20,000.
- Only offer these sizes: Single, Double, Queen, King, Diwan. No other size exists.`;

const LANGUAGE_BLOCKS: Record<LanguageKey, string> = {
  tenglish: `## Language

Reply in natural conversational Tenglish — Telugu spoken with English words, written in Latin script. This is how people actually talk in Hyderabad. Do not write Telugu script and do not switch to formal Telugu.

Example of the register expected:
Customer: "Naaku soft mattress kavali."
You: "Sure! Mee kosam soft feel unna mattresses chustanu. Mee budget entha?"`,

  english: `## Language

Reply in clear, simple English suited to an Indian customer. Short sentences. No jargon.`,

  telugu: `## Language

Reply in Telugu script. Keep the sentences short and conversational, not formal or literary. Product names, sizes, and English technical terms stay in English.`,

  hindi: `## Language

Reply in Hindi (Devanagari script). Keep the sentences short and conversational. Product names, sizes, and English technical terms stay in English.`,
};

export function buildSystemPrompt(language: LanguageKey): string {
  return `${BASE}\n\n${OPERATIONAL}\n\n${LANGUAGE_BLOCKS[language] ?? LANGUAGE_BLOCKS.tenglish}`;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run: `npm test -- prompt`
Expected: PASS, 9 tests.

- [ ] **Step 6: Commit**

```bash
git add api/_lib/llm.ts api/_lib/prompt.ts api/_lib/__tests__/prompt.test.ts
git commit -m "feat(ai): groq client and language-aware system prompt"
```

---

## Task 6: Tool schemas, validation, and handlers

Llama's tool-calling is less reliable than a frontier model's. Every argument object is validated with Zod before it reaches pricing code, and a malformed call gets one structured repair message rather than a crash.

**Files:**
- Create: `api/_lib/tools.ts`
- Create: `api/_lib/__tests__/tools.test.ts`

**Interfaces:**
- Consumes: `getCatalog`, `findProduct`, `priceFor`, `availableSizes` from `./catalog`; `scoreProducts` from `./recommend`; `toRecommendedProduct`, `RecommendedProduct` from `./types`; `buildWhatsAppUrl` equivalent (reimplemented server-side, see step 3).
- Produces: `TOOL_SCHEMAS`, `ToolResult`, `runTool(name, argumentsJson): Promise<ToolResult>`.

- [ ] **Step 1: Write the failing tests**

Create `api/_lib/__tests__/tools.test.ts`:

```ts
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
    expect(result.data.whatsappUrl).toMatch(/^https:\/\/wa\.me\/918686624494\?text=/);
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
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- tools`
Expected: FAIL — `Failed to resolve import "../tools"`.

- [ ] **Step 3: Implement `api/_lib/tools.ts`**

```ts
import { z } from 'zod';
import {
  getCatalog,
  findProduct,
  priceFor,
  availableSizes,
  lowestPrice,
  CATALOG_SIZES,
} from './catalog';
import { scoreProducts, type Preferences } from './recommend';
import { toRecommendedProduct, type RecommendedProduct } from './types';

/**
 * Server-side copy of the WhatsApp number. Kept in sync with
 * src/lib/site.ts, which remains the browser's single source.
 */
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '918686624494';

const MAX_RESULTS = 3;

export interface ToolResult {
  ok: boolean;
  /** Serialized back to the model as the tool result. */
  data: any;
  /** Structured products for the UI. Never parsed out of model text. */
  products: RecommendedProduct[];
  intent: string;
}

// z.enum needs a mutable [string, ...string[]]; CATALOG_SIZES is a readonly tuple.
const sizeSchema = z.enum([...CATALOG_SIZES] as [string, ...string[]]);

const searchSchema = z.object({
  maxPrice: z.number().positive().optional(),
  minPrice: z.number().positive().optional(),
  size: sizeSchema.optional(),
  firmness: z.string().min(1).optional(),
  material: z.string().min(1).optional(),
  sleepingPosition: z.enum(['side', 'back', 'stomach', 'combination']).optional(),
  tier: z.enum(['comfort', 'premium', 'luxury']).optional(),
  includeAccessories: z.boolean().optional(),
  fabricOption: z.enum(['300GSM', '450GSM']).optional(),
});

const getProductSchema = z.object({
  slug: z.string().min(1),
  size: sizeSchema.optional(),
  includeAccessories: z.boolean().optional(),
  fabricOption: z.enum(['300GSM', '450GSM']).optional(),
});

const compareSchema = z.object({
  slugs: z.array(z.string().min(1)).min(2).max(3),
  size: sizeSchema.optional(),
});

const captureLeadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'phone must be a 10-digit Indian mobile number'),
  preferredContact: z.enum(['whatsapp', 'call']).default('whatsapp'),
  city: z.string().optional(),
  notes: z.string().optional(),
  summary: z.string().optional(),
});

const escalateSchema = z.object({
  context: z.string().optional(),
});

const SIZE_LIST = CATALOG_SIZES.join(', ');

export const TOOL_SCHEMAS = [
  {
    type: 'function' as const,
    function: {
      name: 'search_products',
      description:
        `Search the real RelaxPro mattress catalogue and return up to ${MAX_RESULTS} scored matches with prices. Call this before recommending any mattress or stating any price. Returns an empty list when nothing matches — do not substitute a near miss.`,
      parameters: {
        type: 'object',
        properties: {
          maxPrice: { type: 'number', description: 'Maximum budget in Indian Rupees.' },
          minPrice: { type: 'number', description: 'Minimum budget in Indian Rupees.' },
          size: { type: 'string', enum: [...CATALOG_SIZES], description: `Mattress size. Only these exist: ${SIZE_LIST}.` },
          firmness: { type: 'string', description: 'e.g. soft, medium, medium-firm, firm.' },
          material: { type: 'string', description: 'e.g. latex, hr_foam, rebonded_foam.' },
          sleepingPosition: { type: 'string', enum: ['side', 'back', 'stomach', 'combination'] },
          tier: { type: 'string', enum: ['comfort', 'premium', 'luxury'] },
          includeAccessories: { type: 'boolean', description: 'Price with bundled accessories.' },
          fabricOption: { type: 'string', enum: ['300GSM', '450GSM'] },
        },
        required: [],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_product',
      description:
        'Fetch full verified detail for one mattress by slug, including the exact price for a given size and option. Fields the CMS does not hold are returned as null — say you do not have them rather than guessing.',
      parameters: {
        type: 'object',
        properties: {
          slug: { type: 'string', description: 'Product slug, e.g. vilasa.' },
          size: { type: 'string', enum: [...CATALOG_SIZES] },
          includeAccessories: { type: 'boolean' },
          fabricOption: { type: 'string', enum: ['300GSM', '450GSM'] },
        },
        required: ['slug'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'compare_products',
      description:
        'Compare two or three RelaxPro mattresses side by side on price, comfort level, thickness, materials, and certifications.',
      parameters: {
        type: 'object',
        properties: {
          slugs: { type: 'array', items: { type: 'string' }, description: 'Two or three product slugs.' },
          size: { type: 'string', enum: [...CATALOG_SIZES] },
        },
        required: ['slugs'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'capture_lead',
      description:
        'Record the customer contact details so a RelaxPro expert can follow up. Call this ONLY after the customer has shown buying intent and has given their name and phone number. Never ask for these details before that.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string', description: '10-digit Indian mobile number.' },
          preferredContact: { type: 'string', enum: ['whatsapp', 'call'] },
          city: { type: 'string' },
          notes: { type: 'string' },
          summary: {
            type: 'string',
            description: 'One line for the sales team: budget, size, firmness, products discussed.',
          },
        },
        required: ['name', 'phone'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'escalate_to_human',
      description:
        'Hand the conversation to a human RelaxPro expert on WhatsApp. Returns a link the application will show. Use when the customer asks for a person or when you cannot help.',
      parameters: {
        type: 'object',
        properties: {
          context: { type: 'string', description: 'Short summary of what the customer wants.' },
        },
        required: [],
      },
    },
  },
];

function fail(error: string, intent = 'error'): ToolResult {
  return { ok: false, data: { error }, products: [], intent };
}

function parseArgs<T>(schema: z.ZodType<T>, argumentsJson: string): { ok: true; value: T } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(argumentsJson || '{}');
  } catch {
    return { ok: false, error: 'Arguments were not valid JSON. Call the tool again with a valid JSON object.' };
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    const detail = result.error.issues
      .map((i) => `${i.path.join('.') || 'argument'}: ${i.message}`)
      .join('; ');
    return { ok: false, error: `Invalid arguments — ${detail}. Correct them and call the tool again.` };
  }
  return { ok: true, value: result.data };
}

async function handleSearch(argumentsJson: string): Promise<ToolResult> {
  const parsed = parseArgs(searchSchema, argumentsJson);
  if (!parsed.ok) return fail(parsed.error, 'product_search');

  const catalog = await getCatalog();
  const scored = scoreProducts(catalog, parsed.value as Preferences).slice(0, MAX_RESULTS);

  const products = scored
    .map((s) => {
      const product = findProduct(catalog, s.slug);
      return product ? toRecommendedProduct(product, s) : null;
    })
    .filter((p): p is RecommendedProduct => p !== null);

  return {
    ok: true,
    products,
    intent: 'product_search',
    data: {
      found: products.length,
      products: products.map((p) => ({
        slug: p.slug,
        name: p.name,
        price: p.price,
        size: p.size,
        comfortLevel: p.comfortLevel,
        totalThickness: p.totalThickness,
        materials: p.materials,
        certifications: p.certifications,
        matchScore: p.score,
        reasons: p.reasons,
      })),
      note:
        products.length === 0
          ? 'No RelaxPro mattress matches these requirements. Reply with exactly this sentence, translated into the conversation language: "I don\'t have enough information to recommend a product right now. Please contact our RelaxPro team." Then offer to adjust the budget or size. Do not name any product.'
          : 'The application is already displaying these as cards. Do not repeat the full specifications.',
    },
  };
}

async function handleGetProduct(argumentsJson: string): Promise<ToolResult> {
  const parsed = parseArgs(getProductSchema, argumentsJson);
  if (!parsed.ok) return fail(parsed.error, 'product_detail');

  const { slug, size, includeAccessories, fabricOption } = parsed.value;
  const catalog = await getCatalog();
  const product = findProduct(catalog, slug);
  if (!product) {
    return fail(
      `Product "${slug}" not found in the RelaxPro catalogue. Do not describe it. Use search_products to find real products.`,
      'product_detail',
    );
  }

  const price = size
    ? priceFor(product, size, { includeAccessories, fabricOption })
    : lowestPrice(product);

  return {
    ok: true,
    products: [],
    intent: 'product_detail',
    data: {
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      keyBenefit: product.keyBenefit,
      description: product.description,
      tier: product.tier,
      comfortLevel: product.comfortLevel,
      comfortRating: product.comfortRating,
      totalThickness: product.totalThickness,
      materials: product.materials,
      certifications: product.certifications,
      accessories: product.accessories,
      features: product.features,
      fabricGsm: product.fabricGsm,
      fabricType: product.fabricType,
      warrantyYears: product.warrantyYears,
      rating: product.rating,
      reviewCount: product.reviewCount,
      availableSizes: availableSizes(product),
      price,
      size: size ?? null,
      url: product.url,
      note: 'Any field that is null is genuinely absent from the RelaxPro CMS. Say you do not have it and suggest contacting the RelaxPro team.',
    },
  };
}

async function handleCompare(argumentsJson: string): Promise<ToolResult> {
  const parsed = parseArgs(compareSchema, argumentsJson);
  if (!parsed.ok) return fail(parsed.error, 'comparison');

  const { slugs, size } = parsed.value;
  const catalog = await getCatalog();

  const rows = slugs.map((slug) => {
    const product = findProduct(catalog, slug);
    if (!product) return { slug, error: 'not found in the RelaxPro catalogue' };
    return {
      slug: product.slug,
      name: product.name,
      price: size ? priceFor(product, size) : lowestPrice(product),
      size: size ?? null,
      comfortLevel: product.comfortLevel,
      totalThickness: product.totalThickness,
      materials: product.materials,
      certifications: product.certifications,
      warrantyYears: product.warrantyYears,
    };
  });

  return {
    ok: true,
    products: [],
    intent: 'comparison',
    data: { products: rows },
  };
}

async function handleEscalate(argumentsJson: string): Promise<ToolResult> {
  const parsed = parseArgs(escalateSchema, argumentsJson);
  if (!parsed.ok) return fail(parsed.error, 'escalation');

  const context = parsed.value.context?.trim();
  const message = context
    ? `Hi RelaxPro, I need help choosing a mattress. ${context}`
    : 'Hi RelaxPro, I need help choosing a mattress.';

  return {
    ok: true,
    products: [],
    intent: 'escalation',
    data: {
      whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      note: 'Tell the customer the WhatsApp link is ready and they can tap it.',
    },
  };
}

/** Lead capture is wired to the Sheet in Task 13. */
async function handleCaptureLead(argumentsJson: string): Promise<ToolResult> {
  const parsed = parseArgs(captureLeadSchema, argumentsJson);
  if (!parsed.ok) return fail(parsed.error, 'lead_capture');
  return {
    ok: true,
    products: [],
    intent: 'lead_capture',
    data: { saved: false, note: 'Lead delivery is not wired yet.' },
  };
}

export async function runTool(name: string, argumentsJson: string): Promise<ToolResult> {
  switch (name) {
    case 'search_products':
      return handleSearch(argumentsJson);
    case 'get_product':
      return handleGetProduct(argumentsJson);
    case 'compare_products':
      return handleCompare(argumentsJson);
    case 'capture_lead':
      return handleCaptureLead(argumentsJson);
    case 'escalate_to_human':
      return handleEscalate(argumentsJson);
    default:
      return fail(`Unknown tool "${name}".`);
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- tools`
Expected: PASS, 13 tests.

- [ ] **Step 5: Commit**

```bash
git add api/_lib/tools.ts api/_lib/__tests__/tools.test.ts
git commit -m "feat(ai): tool schemas with zod validation and handlers"
```

---

## Task 7: `POST /api/chat`

**Files:**
- Create: `api/_lib/ratelimit.ts`
- Create: `api/chat.ts`
- Create: `api/_lib/__tests__/ratelimit.test.ts`

**Interfaces:**
- Consumes: `chatCompletion`, `LlmMessage` from `./llm`; `buildSystemPrompt` from `./prompt`; `TOOL_SCHEMAS`, `runTool` from `./tools`; `ChatRequestBody`, `ChatResponseBody` from `./types`.
- Produces: `checkRateLimit(ip): { allowed: boolean; reason?: string }`, `__resetRateLimit()` from `./ratelimit`.

**Copy that must be exact:**

```
Sorry, I'm having trouble connecting right now. Please try again or contact our RelaxPro expert on WhatsApp.
```

- [ ] **Step 1: Write the failing tests**

Create `api/_lib/__tests__/ratelimit.test.ts`:

```ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, __resetRateLimit, PER_IP_PER_MINUTE } from '../ratelimit';

beforeEach(() => {
  __resetRateLimit();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('checkRateLimit', () => {
  it('allows requests under the per-minute limit', () => {
    for (let i = 0; i < PER_IP_PER_MINUTE; i += 1) {
      expect(checkRateLimit('1.2.3.4').allowed).toBe(true);
    }
  });

  it('blocks the request after the per-minute limit', () => {
    for (let i = 0; i < PER_IP_PER_MINUTE; i += 1) checkRateLimit('1.2.3.4');
    const result = checkRateLimit('1.2.3.4');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('per_ip');
  });

  it('tracks each ip separately', () => {
    for (let i = 0; i < PER_IP_PER_MINUTE; i += 1) checkRateLimit('1.2.3.4');
    expect(checkRateLimit('5.6.7.8').allowed).toBe(true);
  });

  it('lets an ip through again after the window rolls over', () => {
    for (let i = 0; i < PER_IP_PER_MINUTE; i += 1) checkRateLimit('1.2.3.4');
    vi.advanceTimersByTime(61_000);
    expect(checkRateLimit('1.2.3.4').allowed).toBe(true);
  });

  it('blocks everyone once the daily cap is reached', () => {
    __resetRateLimit({ dailyCap: 2 });
    expect(checkRateLimit('a').allowed).toBe(true);
    expect(checkRateLimit('b').allowed).toBe(true);
    const result = checkRateLimit('c');
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe('daily_cap');
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- ratelimit`
Expected: FAIL — `Failed to resolve import "../ratelimit"`.

- [ ] **Step 3: Implement `api/_lib/ratelimit.ts`**

```ts
export const PER_IP_PER_MINUTE = 12;

const WINDOW_MS = 60_000;

interface Bucket {
  count: number;
  resetAt: number;
}

let buckets = new Map<string, Bucket>();
let dailyCount = 0;
let dailyResetAt = 0;
let dailyCapOverride: number | null = null;

function dailyCap(): number {
  if (dailyCapOverride !== null) return dailyCapOverride;
  const raw = Number(process.env.AI_DAILY_REQUEST_CAP);
  return Number.isFinite(raw) && raw > 0 ? raw : 2000;
}

/** Test seam. */
export function __resetRateLimit(opts: { dailyCap?: number } = {}): void {
  buckets = new Map();
  dailyCount = 0;
  dailyResetAt = 0;
  dailyCapOverride = opts.dailyCap ?? null;
}

export function checkRateLimit(ip: string): { allowed: boolean; reason?: 'per_ip' | 'daily_cap' } {
  const now = Date.now();

  if (now >= dailyResetAt) {
    dailyCount = 0;
    dailyResetAt = now + 24 * 60 * 60 * 1000;
  }
  if (dailyCount >= dailyCap()) return { allowed: false, reason: 'daily_cap' };

  const bucket = buckets.get(ip);
  if (!bucket || now >= bucket.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    if (bucket.count >= PER_IP_PER_MINUTE) return { allowed: false, reason: 'per_ip' };
    bucket.count += 1;
  }

  // Bound memory on a long-lived warm instance.
  if (buckets.size > 5000) {
    for (const [key, value] of buckets) {
      if (now >= value.resetAt) buckets.delete(key);
    }
  }

  dailyCount += 1;
  return { allowed: true };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- ratelimit`
Expected: PASS, 5 tests.

- [ ] **Step 5: Implement `api/chat.ts`**

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { chatCompletion, type LlmMessage } from './_lib/llm';
import { buildSystemPrompt } from './_lib/prompt';
import { TOOL_SCHEMAS, runTool } from './_lib/tools';
import { checkRateLimit } from './_lib/ratelimit';
import type { ChatRequestBody, ChatResponseBody, LanguageKey, RecommendedProduct } from './_lib/types';

const CONNECTION_ERROR =
  "Sorry, I'm having trouble connecting right now. Please try again or contact our RelaxPro expert on WhatsApp.";

const MAX_TOOL_ROUNDS = 3;
const MAX_HISTORY = 20;
const MAX_MESSAGE_CHARS = 1000;
const LANGUAGES: LanguageKey[] = ['tenglish', 'english', 'telugu', 'hindi'];

function clientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return value?.split(',')[0]?.trim() || 'unknown';
}

function errorResponse(res: VercelResponse, language: LanguageKey, status = 503) {
  const body: ChatResponseBody = {
    message: CONNECTION_ERROR,
    products: [],
    intent: 'error',
    language,
  };
  return res.status(status).json(body);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Partial<ChatRequestBody>;
  const language: LanguageKey = LANGUAGES.includes(body?.language as LanguageKey)
    ? (body!.language as LanguageKey)
    : 'tenglish';

  if (!Array.isArray(body?.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: 'messages is required' });
  }

  const history = body.messages
    .slice(-MAX_HISTORY)
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_CHARS) }));

  if (history.length === 0) {
    return res.status(400).json({ error: 'messages is required' });
  }

  const limit = checkRateLimit(clientIp(req));
  if (!limit.allowed) return errorResponse(res, language, 429);

  const messages: LlmMessage[] = [
    { role: 'system', content: buildSystemPrompt(language) },
    ...(history as LlmMessage[]),
  ];

  let products: RecommendedProduct[] = [];
  let intent = 'general';

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
      const completion = await chatCompletion({ messages, tools: TOOL_SCHEMAS });

      if (completion.toolCalls.length === 0) {
        const body: ChatResponseBody = {
          message: completion.content || CONNECTION_ERROR,
          products,
          intent,
          language,
        };
        return res.status(200).json(body);
      }

      messages.push(completion.raw as LlmMessage);

      for (const call of completion.toolCalls) {
        const result = await runTool(call.name, call.argumentsJson);
        if (result.products.length > 0) products = result.products;
        if (result.intent !== 'error') intent = result.intent;
        messages.push({
          role: 'tool',
          tool_call_id: call.id,
          content: JSON.stringify(result.data),
        });
      }
    }

    // Tool budget exhausted — ask for a final answer with tools withheld.
    const final = await chatCompletion({ messages });
    const body: ChatResponseBody = {
      message: final.content || CONNECTION_ERROR,
      products,
      intent,
      language,
    };
    return res.status(200).json(body);
  } catch (err) {
    console.error('[api/chat]', err);
    return errorResponse(res, language);
  }
}
```

- [ ] **Step 6: Verify the endpoint manually**

Set the key in your shell (use a freshly rotated key, never the one shared in chat):

```bash
export GROQ_API_KEY="gsk_..."
npx vercel dev --listen 3000
```

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"t1","language":"tenglish","messages":[{"role":"user","content":"Naaku 20000 lopu queen mattress kavali"}]}' | python -m json.tool
```

Expected: `intent` is `product_search`, `products` is a non-empty array, and every `price` is at or below 20000. Confirm the `message` text does not contain a rupee figure absent from `products`.

Now confirm the guard rail:

```bash
curl -s -X POST http://localhost:3000/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"sessionId":"t2","language":"english","messages":[{"role":"user","content":"What is the warranty on the Vilasa mattress?"}]}' | python -m json.tool
```

Expected: either a warranty figure that matches the CMS, or an explicit statement that the information is not available. **Not** an invented number.

- [ ] **Step 7: Commit**

```bash
git add api/_lib/ratelimit.ts api/chat.ts api/_lib/__tests__/ratelimit.test.ts
git commit -m "feat(ai): POST /api/chat with tool loop and rate limiting"
```

---

## Task 8: Language configuration and voice hooks

**Files:**
- Create: `src/features/voice-ai/lib/languages.ts`
- Create: `src/features/voice-ai/hooks/useVoiceRecognition.ts`
- Create: `src/features/voice-ai/hooks/useSpeechSynthesis.ts`
- Create: `src/features/voice-ai/__tests__/languages.test.ts`
- Create: `src/features/voice-ai/__tests__/useVoiceRecognition.test.tsx`

**Interfaces:**
- Consumes: nothing.
- Produces: `LANGUAGES`, `LanguageKey`, `DEFAULT_LANGUAGE`, `enabledLanguages()`, `pickVoice(voices, primary, fallback)` from `lib/languages`; `useVoiceRecognition(langCode)` and `useSpeechSynthesis()` from `hooks/`.

**Copy that must be exact:**

```
Voice input is not supported on this browser. Please type your question.
I couldn't access your microphone. Please check your browser microphone permission.
```

- [ ] **Step 1: Write the failing tests for languages**

Create `src/features/voice-ai/__tests__/languages.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { LANGUAGES, DEFAULT_LANGUAGE, enabledLanguages, pickVoice } from '../lib/languages';

function voice(lang: string, name = lang): SpeechSynthesisVoice {
  return { lang, name, default: false, localService: true, voiceURI: name } as SpeechSynthesisVoice;
}

describe('LANGUAGES', () => {
  it('defaults to Tenglish', () => {
    expect(DEFAULT_LANGUAGE).toBe('tenglish');
    expect(LANGUAGES.tenglish.enabled).toBe(true);
  });

  it('recognises Tenglish with en-IN, because no recogniser emits romanized Telugu', () => {
    expect(LANGUAGES.tenglish.asr).toBe('en-IN');
  });

  it('speaks Tenglish with an en-IN voice, not a Telugu one', () => {
    expect(LANGUAGES.tenglish.tts).toBe('en-IN');
  });

  it('recognises and speaks Telugu with te-IN', () => {
    expect(LANGUAGES.telugu.asr).toBe('te-IN');
    expect(LANGUAGES.telugu.tts).toBe('te-IN');
    expect(LANGUAGES.telugu.ttsFallback).toBe('en-IN');
  });

  it('keeps Hindi wired but disabled', () => {
    expect(LANGUAGES.hindi.asr).toBe('hi-IN');
    expect(LANGUAGES.hindi.enabled).toBe(false);
  });

  it('excludes disabled languages from the picker list', () => {
    const keys = enabledLanguages().map((l) => l.key);
    expect(keys).toEqual(['tenglish', 'english', 'telugu']);
  });
});

describe('pickVoice', () => {
  it('prefers an exact language match', () => {
    const chosen = pickVoice([voice('en-US'), voice('te-IN'), voice('en-IN')], 'te-IN', 'en-IN');
    expect(chosen?.lang).toBe('te-IN');
  });

  it('falls back to a same-prefix voice', () => {
    const chosen = pickVoice([voice('en-US'), voice('te-IN-x-local')], 'te-IN', 'en-IN');
    expect(chosen?.lang).toBe('te-IN-x-local');
  });

  it('falls back to the fallback language when the primary is missing', () => {
    const chosen = pickVoice([voice('en-US'), voice('en-IN')], 'te-IN', 'en-IN');
    expect(chosen?.lang).toBe('en-IN');
  });

  it('falls back to any English voice when nothing else matches', () => {
    const chosen = pickVoice([voice('fr-FR'), voice('en-US')], 'te-IN', 'en-IN');
    expect(chosen?.lang).toBe('en-US');
  });

  it('returns null when there are no voices at all', () => {
    expect(pickVoice([], 'te-IN', 'en-IN')).toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm test -- languages`
Expected: FAIL — `Failed to resolve import "../lib/languages"`.

- [ ] **Step 3: Implement `src/features/voice-ai/lib/languages.ts`**

```ts
export type LanguageKey = 'tenglish' | 'english' | 'telugu' | 'hindi';

export interface LanguageConfig {
  key: LanguageKey;
  label: string;
  /** BCP-47 tag for SpeechRecognition.lang */
  asr: string;
  /** BCP-47 tag for speech synthesis */
  tts: string;
  /** Used when no voice exists for `tts`. */
  ttsFallback?: string;
  enabled: boolean;
}

export const LANGUAGES: Record<LanguageKey, LanguageConfig> = {
  // Tenglish uses en-IN for recognition because no speech recogniser anywhere
  // emits romanized Telugu — te-IN returns Telugu script. The model decodes the
  // approximate English transcript reliably. It speaks with an en-IN voice
  // because Latin-script Tenglish read by a Telugu voice mispronounces badly.
  tenglish: { key: 'tenglish', label: 'Tenglish', asr: 'en-IN', tts: 'en-IN', enabled: true },
  english: { key: 'english', label: 'English', asr: 'en-IN', tts: 'en-IN', enabled: true },
  telugu: { key: 'telugu', label: 'తెలుగు', asr: 'te-IN', tts: 'te-IN', ttsFallback: 'en-IN', enabled: true },
  hindi: { key: 'hindi', label: 'हिन्दी', asr: 'hi-IN', tts: 'hi-IN', ttsFallback: 'en-IN', enabled: false },
};

export const DEFAULT_LANGUAGE: LanguageKey = 'tenglish';

export function enabledLanguages(): LanguageConfig[] {
  return Object.values(LANGUAGES).filter((l) => l.enabled);
}

/** Exact tag, then same prefix, then the fallback tag, then any English voice. */
export function pickVoice(
  voices: SpeechSynthesisVoice[],
  primary: string,
  fallback?: string,
): SpeechSynthesisVoice | null {
  if (voices.length === 0) return null;

  const exact = voices.find((v) => v.lang.toLowerCase() === primary.toLowerCase());
  if (exact) return exact;

  const prefix = primary.split('-')[0].toLowerCase();
  const samePrefix = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
  if (samePrefix) return samePrefix;

  if (fallback) {
    const fb = voices.find((v) => v.lang.toLowerCase() === fallback.toLowerCase());
    if (fb) return fb;
  }

  return voices.find((v) => v.lang.toLowerCase().startsWith('en')) ?? null;
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npm test -- languages`
Expected: PASS, 11 tests.

- [ ] **Step 5: Write the failing test for `useVoiceRecognition`**

Create `src/features/voice-ai/__tests__/useVoiceRecognition.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useVoiceRecognition, UNSUPPORTED_MESSAGE, MIC_DENIED_MESSAGE } from '../hooks/useVoiceRecognition';

class FakeRecognition {
  lang = '';
  continuous = false;
  interimResults = false;
  onresult: ((e: any) => void) | null = null;
  onerror: ((e: any) => void) | null = null;
  onend: (() => void) | null = null;
  onstart: (() => void) | null = null;
  started = false;

  start() {
    this.started = true;
    this.onstart?.();
  }
  stop() {
    this.started = false;
    this.onend?.();
  }
  abort() {
    this.stop();
  }
}

let instance: FakeRecognition;

beforeEach(() => {
  instance = new FakeRecognition();
  (window as any).SpeechRecognition = function () {
    return instance;
  };
});

afterEach(() => {
  delete (window as any).SpeechRecognition;
  delete (window as any).webkitSpeechRecognition;
});

describe('useVoiceRecognition', () => {
  it('reports supported when the API exists', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    expect(result.current.isSupported).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('reports the exact unsupported message when the API is absent', () => {
    delete (window as any).SpeechRecognition;
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    expect(result.current.isSupported).toBe(false);
    expect(result.current.error).toBe(
      'Voice input is not supported on this browser. Please type your question.',
    );
    expect(UNSUPPORTED_MESSAGE).toBe(result.current.error);
  });

  it('applies the requested recognition language', () => {
    const { result } = renderHook(() => useVoiceRecognition('te-IN'));
    act(() => result.current.start());
    expect(instance.lang).toBe('te-IN');
  });

  it('tracks the listening state', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    expect(result.current.isListening).toBe(true);
    act(() => result.current.stop());
    expect(result.current.isListening).toBe(false);
  });

  it('accumulates the final transcript', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    act(() => {
      instance.onresult?.({
        resultIndex: 0,
        results: [Object.assign([{ transcript: 'naaku queen mattress kavali' }], { isFinal: true })],
      });
    });
    expect(result.current.transcript).toBe('naaku queen mattress kavali');
  });

  it('maps a permission error to the exact microphone message', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    act(() => instance.onerror?.({ error: 'not-allowed' }));
    expect(result.current.error).toBe(
      "I couldn't access your microphone. Please check your browser microphone permission.",
    );
    expect(MIC_DENIED_MESSAGE).toBe(result.current.error);
    expect(result.current.isListening).toBe(false);
  });

  it('does not surface a no-speech event as an error', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    act(() => instance.onerror?.({ error: 'no-speech' }));
    expect(result.current.error).toBeNull();
  });

  it('clears the transcript on reset', () => {
    const { result } = renderHook(() => useVoiceRecognition('en-IN'));
    act(() => result.current.start());
    act(() => {
      instance.onresult?.({
        resultIndex: 0,
        results: [Object.assign([{ transcript: 'hello' }], { isFinal: true })],
      });
    });
    act(() => result.current.reset());
    expect(result.current.transcript).toBe('');
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

Run: `npm test -- useVoiceRecognition`
Expected: FAIL — `Failed to resolve import "../hooks/useVoiceRecognition"`.

- [ ] **Step 7: Implement `src/features/voice-ai/hooks/useVoiceRecognition.ts`**

```ts
import { useCallback, useEffect, useRef, useState } from 'react';

export const UNSUPPORTED_MESSAGE =
  'Voice input is not supported on this browser. Please type your question.';
export const MIC_DENIED_MESSAGE =
  "I couldn't access your microphone. Please check your browser microphone permission.";
export const NO_MIC_MESSAGE =
  "I couldn't access your microphone. Please check your browser microphone permission.";
export const NETWORK_MESSAGE =
  "Sorry, I'm having trouble connecting right now. Please try again or contact our RelaxPro expert on WhatsApp.";

function getRecognitionCtor(): any | null {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null;
}

export interface VoiceRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export function useVoiceRecognition(langCode: string): VoiceRecognitionState {
  const [isSupported] = useState(() => getRecognitionCtor() !== null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(isSupported ? null : UNSUPPORTED_MESSAGE);
  const recognitionRef = useRef<any>(null);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    if (isSupported) setError(null);
  }, [isSupported]);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setError(UNSUPPORTED_MESSAGE);
      return;
    }

    recognitionRef.current?.abort?.();

    const recognition = new Ctor();
    recognition.lang = langCode;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0]?.transcript ?? '';
        if (result.isFinal) final += text;
        else interim += text;
      }
      if (final) setTranscript((prev) => (prev ? `${prev} ${final}`.trim() : final.trim()));
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      setIsListening(false);
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          setError(MIC_DENIED_MESSAGE);
          break;
        case 'audio-capture':
          setError(NO_MIC_MESSAGE);
          break;
        case 'network':
          setError(NETWORK_MESSAGE);
          break;
        // 'no-speech' and 'aborted' are normal outcomes, not failures.
        default:
          break;
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError(MIC_DENIED_MESSAGE);
      setIsListening(false);
    }
  }, [langCode]);

  useEffect(() => () => recognitionRef.current?.abort?.(), []);

  return { isSupported, isListening, transcript, interimTranscript, error, start, stop, reset };
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npm test -- useVoiceRecognition`
Expected: PASS, 8 tests.

- [ ] **Step 9: Implement `src/features/voice-ai/hooks/useSpeechSynthesis.ts`**

No unit test — the behaviour worth testing is `pickVoice`, already covered in step 4. This hook is verified manually in Task 12.

```ts
import { useCallback, useEffect, useState } from 'react';
import { pickVoice } from '../lib/languages';

const STORAGE_KEY = 'relaxpro_ai_voice_output';

export interface SpeechSynthesisState {
  isSupported: boolean;
  isSpeaking: boolean;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  speak: (text: string, langCode: string, fallbackLangCode?: string) => void;
  stop: () => void;
}

export function useSpeechSynthesis(): SpeechSynthesisState {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [enabled, setEnabledState] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  });

  // Chrome populates voices asynchronously.
  useEffect(() => {
    if (!isSupported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [isSupported]);

  const setEnabled = useCallback(
    (value: boolean) => {
      setEnabledState(value);
      window.localStorage.setItem(STORAGE_KEY, value ? 'on' : 'off');
      if (!value && isSupported) window.speechSynthesis.cancel();
    },
    [isSupported],
  );

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const speak = useCallback(
    (text: string, langCode: string, fallbackLangCode?: string) => {
      if (!isSupported || !enabled || !text.trim()) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = pickVoice(voices, langCode, fallbackLangCode);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = langCode;
      }
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported, enabled, voices],
  );

  return { isSupported, isSpeaking, enabled, setEnabled, speak, stop };
}
```

- [ ] **Step 10: Run the whole suite**

Run: `npm test`
Expected: PASS — all files.

- [ ] **Step 11: Commit**

```bash
git add src/features/voice-ai/lib/languages.ts src/features/voice-ai/hooks/ src/features/voice-ai/__tests__/
git commit -m "feat(ai): language config and browser voice hooks"
```

---

## Task 9: Chat client and `useChat`

**Files:**
- Create: `src/features/voice-ai/types.ts`
- Create: `src/features/voice-ai/lib/api.ts`
- Create: `src/features/voice-ai/hooks/useChat.ts`

**Interfaces:**
- Consumes: `LanguageKey`, `DEFAULT_LANGUAGE` from `lib/languages`.
- Produces: `ChatMessage`, `RecommendedProduct` from `types`; `postChat(body)` from `lib/api`; `useChat()` returning `{ messages, products, status, error, send, reset, sessionId }`.

- [ ] **Step 1: Create `src/features/voice-ai/types.ts`**

Mirrors `api/_lib/types.ts`. Duplicated deliberately — the app and the functions build separately and share no module graph.

```ts
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
```

- [ ] **Step 2: Create `src/features/voice-ai/lib/api.ts`**

```ts
import type { LanguageKey } from './languages';
import type { ChatMessage, ChatResponseBody } from '../types';

export const CONNECTION_ERROR =
  "Sorry, I'm having trouble connecting right now. Please try again or contact our RelaxPro expert on WhatsApp.";

const TIMEOUT_MS = 25_000;

export async function postChat(params: {
  sessionId: string;
  messages: ChatMessage[];
  language: LanguageKey;
}): Promise<ChatResponseBody> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        sessionId: params.sessionId,
        language: params.language,
        messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    // The server returns the fallback copy in its own error body; use it when present.
    const data = (await response.json().catch(() => null)) as ChatResponseBody | null;
    if (!data || typeof data.message !== 'string') {
      return { message: CONNECTION_ERROR, products: [], intent: 'error', language: params.language };
    }
    return { ...data, products: Array.isArray(data.products) ? data.products : [] };
  } catch {
    return { message: CONNECTION_ERROR, products: [], intent: 'error', language: params.language };
  } finally {
    clearTimeout(timer);
  }
}
```

- [ ] **Step 3: Create `src/features/voice-ai/hooks/useChat.ts`**

```ts
import { useCallback, useRef, useState } from 'react';
import { postChat } from '../lib/api';
import { DEFAULT_LANGUAGE, type LanguageKey } from '../lib/languages';
import type { ChatMessage, RecommendedProduct } from '../types';

const SESSION_KEY = 'relaxpro_ai_session';

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const id =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  window.sessionStorage.setItem(SESSION_KEY, id);
  return id;
}

let messageCounter = 0;
function nextId(): string {
  messageCounter += 1;
  return `m${messageCounter}`;
}

export type ChatStatus = 'idle' | 'sending';

export interface UseChatResult {
  messages: ChatMessage[];
  products: RecommendedProduct[];
  status: ChatStatus;
  intent: string;
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
  send: (text: string) => Promise<string | null>;
  reset: () => void;
  sessionId: string;
}

export function useChat(): UseChatResult {
  const sessionIdRef = useRef<string>(getSessionId());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [products, setProducts] = useState<RecommendedProduct[]>([]);
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [intent, setIntent] = useState('general');
  const [language, setLanguage] = useState<LanguageKey>(DEFAULT_LANGUAGE);

  const send = useCallback(
    async (text: string): Promise<string | null> => {
      const trimmed = text.trim();
      if (!trimmed || status === 'sending') return null;

      const userMessage: ChatMessage = { id: nextId(), role: 'user', content: trimmed };
      const history = [...messages, userMessage];

      setMessages(history);
      setStatus('sending');

      const response = await postChat({
        sessionId: sessionIdRef.current,
        messages: history,
        language,
      });

      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: response.message }]);
      setProducts(response.products);
      setIntent(response.intent);
      setStatus('idle');

      return response.message;
    },
    [messages, status, language],
  );

  const reset = useCallback(() => {
    setMessages([]);
    setProducts([]);
    setIntent('general');
    setStatus('idle');
  }, []);

  return {
    messages,
    products,
    status,
    intent,
    language,
    setLanguage,
    send,
    reset,
    sessionId: sessionIdRef.current,
  };
}
```

- [ ] **Step 4: Verify it type-checks**

Run: `npm run lint`
Expected: no errors (`lint` is `tsc --noEmit`).

- [ ] **Step 5: Commit**

```bash
git add src/features/voice-ai/types.ts src/features/voice-ai/lib/api.ts src/features/voice-ai/hooks/useChat.ts
git commit -m "feat(ai): chat client and useChat hook"
```

---

## Task 10: Widget shell and message list (text-only, end to end)

At the end of this task the assistant works completely as a text chat. Voice is added in Task 12.

**Files:**
- Create: `src/features/voice-ai/components/MessageBubble.tsx`
- Create: `src/features/voice-ai/components/MessageList.tsx`
- Create: `src/features/voice-ai/VoiceAssistant.tsx`

**Interfaces:**
- Consumes: `useChat`; `ChatMessage`, `RecommendedProduct`.
- Produces: default-exported `VoiceAssistant`, `MessageList`, `MessageBubble`.

**Greeting copy:**

```
Namaskaram! 👋 Nenu meeku right mattress choose cheyyadaniki help chestanu.
```

- [ ] **Step 1: Create `src/features/voice-ai/components/MessageBubble.tsx`**

```tsx
import React from 'react';
import { Volume2 } from 'lucide-react';
import type { ChatMessage } from '../types';

interface Props {
  message: ChatMessage;
  onReplay?: (text: string) => void;
}

export default function MessageBubble({ message, onReplay }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={[
          'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-brand-600 text-white rounded-br-sm'
            : 'bg-linen-100 text-graphite-900 rounded-bl-sm',
        ].join(' ')}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        {!isUser && onReplay && (
          <button
            type="button"
            onClick={() => onReplay(message.content)}
            aria-label="Replay this message"
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-graphite-500 hover:text-brand-600 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
            Replay
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/features/voice-ai/components/MessageList.tsx`**

```tsx
import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { ChatMessage } from '../types';

interface Props {
  messages: ChatMessage[];
  isSending: boolean;
  onReplay?: (text: string) => void;
  children?: React.ReactNode;
}

export default function MessageList({ messages, isSending, onReplay, children }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, isSending]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      role="log"
      aria-live="polite"
      aria-label="Conversation with RelaxPro AI"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onReplay={onReplay} />
      ))}

      {children}

      {isSending && (
        <div className="flex justify-start" aria-label="RelaxPro AI is typing">
          <div className="bg-linen-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-1.5 h-1.5 rounded-full bg-graphite-400 animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
```

- [ ] **Step 3: Create `src/features/voice-ai/VoiceAssistant.tsx`**

Text-only for now. `MicButton`, `LanguagePicker`, `QuickActions`, and `ProductRecommendationCard` are wired in Tasks 11 and 12.

```tsx
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MessageSquare, X, Send } from 'lucide-react';
import MessageList from './components/MessageList';
import { useChat } from './hooks/useChat';

export const GREETING =
  'Namaskaram! 👋 Nenu meeku right mattress choose cheyyadaniki help chestanu.';

export default function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const chat = useChat();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await chat.send(text);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Talk to RelaxPro AI"
        className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-700 px-5 py-3.5 text-white shadow-2xl shadow-brand-600/30 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <MessageSquare className="w-5 h-5 shrink-0" aria-hidden="true" />
        <span className="hidden md:inline text-xs font-bold uppercase tracking-widest">
          Talk to RelaxPro AI
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-ink-950/40 md:hidden"
              aria-hidden="true"
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="RelaxPro AI assistant"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed z-50 flex flex-col bg-white shadow-2xl inset-x-0 bottom-0 h-[85vh] rounded-t-3xl md:inset-auto md:bottom-6 md:right-6 md:h-[600px] md:w-[400px] md:rounded-3xl"
            >
              <header className="flex items-center justify-between border-b border-graphite-200 px-4 py-3">
                <div>
                  <p className="font-display text-base font-semibold text-ink-900">RelaxPro AI</p>
                  <p className="text-[11px] uppercase tracking-widest text-graphite-400">
                    Mattress consultant
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close RelaxPro AI"
                  className="rounded-full p-2 text-graphite-500 transition-colors hover:bg-linen-100 hover:text-ink-900"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </header>

              {chat.messages.length === 0 && (
                <div className="px-4 pt-5 pb-2">
                  <p className="text-sm leading-relaxed text-graphite-700">{GREETING}</p>
                </div>
              )}

              <MessageList messages={chat.messages} isSending={chat.status === 'sending'} />

              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 border-t border-graphite-200 px-3 py-3"
              >
                <label htmlFor="relaxpro-ai-input" className="sr-only">
                  Type your question
                </label>
                <input
                  id="relaxpro-ai-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Naaku queen mattress kavali..."
                  autoComplete="off"
                  className="min-h-11 flex-1 rounded-full border border-graphite-200 bg-linen-50 px-4 text-sm text-ink-900 placeholder:text-graphite-400 focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!draft.trim() || chat.status === 'sending'}
                  aria-label="Send message"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 4: Mount it temporarily to verify**

In `src/App.tsx`, add the lazy import beside the other `lazy()` calls:

```tsx
const VoiceAssistant = React.lazy(() => import('./features/voice-ai/VoiceAssistant'));
```

Inside `AppContent`, directly after `<WhatsAppFAB />`, add:

```tsx
<Suspense fallback={null}>
  <VoiceAssistant />
</Suspense>
```

`WhatsAppFAB` is removed in Task 14 — leave it for now so the site stays unchanged if this task is reverted.

- [ ] **Step 5: Verify manually**

```bash
export GROQ_API_KEY="gsk_..."
npx vercel dev --listen 3000
```

Open `http://localhost:3000`, click **Talk to RelaxPro AI**, type `Naaku 20000 lopu queen mattress kavali`, and confirm a Tenglish reply arrives within a few seconds. Then stop the dev server, reload with `npm run dev` (no `/api`), send a message, and confirm the exact fallback string appears rather than a hang.

- [ ] **Step 6: Commit**

```bash
git add src/features/voice-ai/components/MessageBubble.tsx src/features/voice-ai/components/MessageList.tsx src/features/voice-ai/VoiceAssistant.tsx src/App.tsx
git commit -m "feat(ai): assistant shell and message list, text chat working end to end"
```

---

## Task 11: Product cards and quick actions

**Files:**
- Create: `src/features/voice-ai/components/ProductRecommendationCard.tsx`
- Create: `src/features/voice-ai/components/QuickActions.tsx`
- Modify: `src/features/voice-ai/VoiceAssistant.tsx`

**Interfaces:**
- Consumes: `RecommendedProduct`; `SafeImage` from `src/components/ui/SafeImage`.
- Produces: `ProductRecommendationCard`, `QuickActions`, `QUICK_ACTIONS`.

- [ ] **Step 1: Create `src/features/voice-ai/components/ProductRecommendationCard.tsx`**

Every value comes from the `RecommendedProduct` object the tool produced. Nothing is parsed from assistant text.

```tsx
import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import SafeImage from '../../../components/ui/SafeImage';
import type { RecommendedProduct } from '../types';

const SIZE_LABEL: Record<string, string> = {
  single: 'Single',
  double: 'Double',
  queen: 'Queen',
  king: 'King',
  diwan: 'Diwan',
};

function formatPrice(value: number): string {
  return `₹${value.toLocaleString('en-IN')}`;
}

interface Props {
  product: RecommendedProduct;
  onNavigate: (url: string) => void;
  onEnquire: (product: RecommendedProduct) => void;
}

export default function ProductRecommendationCard({ product, onNavigate, onEnquire }: Props) {
  return (
    <article className="w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-graphite-200 bg-white shadow-sm">
      <div className="relative aspect-4/3 bg-linen-100">
        {product.imageUrl && (
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-brand-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {product.score}% Match
        </span>
      </div>

      <div className="space-y-2.5 p-3.5">
        <div>
          <h3 className="font-display text-sm font-semibold leading-snug text-ink-900">
            {product.name}
          </h3>
          {product.tagline && (
            <p className="mt-0.5 line-clamp-1 text-[11px] text-graphite-500">{product.tagline}</p>
          )}
        </div>

        {product.price !== null ? (
          <p className="font-display text-lg font-bold text-brand-700">
            {formatPrice(product.price)}
            {product.size && (
              <span className="ml-1 text-[11px] font-normal text-graphite-500">
                / {SIZE_LABEL[product.size] ?? product.size}
              </span>
            )}
          </p>
        ) : (
          <p className="text-xs text-graphite-500">Price on request</p>
        )}

        <ul className="space-y-1">
          {product.reasons.slice(0, 3).map((reason) => (
            <li key={reason} className="flex items-start gap-1.5 text-[11px] text-graphite-600">
              <Check className="mt-0.5 h-3 w-3 shrink-0 text-eco-500" aria-hidden="true" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-2 pt-0.5">
          <button
            type="button"
            onClick={() => onNavigate(product.url)}
            className="flex-1 rounded-full border border-brand-200 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-brand-700 transition-colors hover:border-brand-600"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onEnquire(product)}
            aria-label={`Enquire about ${product.name}`}
            className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-brand-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-700"
          >
            Enquire
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Create `src/features/voice-ai/components/QuickActions.tsx`**

```tsx
import React from 'react';

export const QUICK_ACTIONS = [
  { label: 'Find My Mattress', prompt: 'Help me find the right mattress.' },
  { label: 'Under ₹20K', prompt: 'Show me the best mattresses under 20000.' },
  { label: 'Compare Mattresses', prompt: 'Compare your mattresses for me.' },
  { label: 'Help Me Choose Size', prompt: 'Help me choose the right mattress size.' },
  { label: 'Latex vs Foam', prompt: 'What is the difference between latex and foam mattresses?' },
  { label: 'Talk to Expert', prompt: 'I would like to talk to a RelaxPro expert.' },
] as const;

interface Props {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export default function QuickActions({ onSelect, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3" aria-label="Suggested questions">
      {QUICK_ACTIONS.map((action) => (
        <button
          key={action.label}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(action.prompt)}
          className="rounded-full border border-graphite-200 bg-linen-50 px-3 py-1.5 text-[11px] font-medium text-graphite-700 transition-colors hover:border-brand-500 hover:text-brand-700 disabled:opacity-40"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Wire both into `VoiceAssistant.tsx`**

Add the imports:

```tsx
import { useNavigate } from 'react-router-dom';
import ProductRecommendationCard from './components/ProductRecommendationCard';
import QuickActions from './components/QuickActions';
import { buildWhatsAppUrl } from '../../lib/site';
import type { RecommendedProduct } from './types';
```

Inside the component, above `handleSubmit`:

```tsx
const navigate = useNavigate();

const handleNavigate = (url: string) => {
  setIsOpen(false);
  navigate(url);
  window.scrollTo({ top: 0, behavior: 'instant' });
};

const handleEnquire = (product: RecommendedProduct) => {
  const price = product.price !== null ? ` (₹${product.price.toLocaleString('en-IN')})` : '';
  window.open(
    buildWhatsAppUrl(`Hi RelaxPro, I am interested in the ${product.name} mattress${price}.`),
    '_blank',
  );
};

const handleQuickAction = async (prompt: string) => {
  await chat.send(prompt);
};
```

Replace the greeting block with the greeting plus quick actions:

```tsx
{chat.messages.length === 0 && (
  <>
    <div className="px-4 pt-5 pb-3">
      <p className="text-sm leading-relaxed text-graphite-700">{GREETING}</p>
    </div>
    <QuickActions onSelect={handleQuickAction} disabled={chat.status === 'sending'} />
  </>
)}
```

Pass the product carousel into `MessageList` as its child, so it renders after the last message:

```tsx
<MessageList messages={chat.messages} isSending={chat.status === 'sending'}>
  {chat.products.length > 0 && chat.status === 'idle' && (
    <div
      className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-1"
      aria-label="Recommended mattresses"
    >
      {chat.products.map((product) => (
        <ProductRecommendationCard
          key={product.slug}
          product={product}
          onNavigate={handleNavigate}
          onEnquire={handleEnquire}
        />
      ))}
    </div>
  )}
</MessageList>
```

- [ ] **Step 4: Verify manually**

Restart `npx vercel dev --listen 3000`. Open the widget, click **Under ₹20K**, and confirm:

- Cards appear with a match percentage, a rupee price, and reason ticks.
- Every price on a card is at or below ₹20,000.
- The cards scroll horizontally with a swipe on a narrow window.
- **View** navigates to `/mattresses/<slug>` and the page loads a real product.
- **Enquire** opens `wa.me/918686624494` with the product name prefilled.

- [ ] **Step 5: Commit**

```bash
git add src/features/voice-ai/components/ProductRecommendationCard.tsx src/features/voice-ai/components/QuickActions.tsx src/features/voice-ai/VoiceAssistant.tsx
git commit -m "feat(ai): product recommendation cards and quick actions"
```

---

## Task 12: Voice input and output

**Files:**
- Create: `src/features/voice-ai/components/MicButton.tsx`
- Create: `src/features/voice-ai/components/LanguagePicker.tsx`
- Modify: `src/features/voice-ai/VoiceAssistant.tsx`

**Interfaces:**
- Consumes: `useVoiceRecognition`, `useSpeechSynthesis`, `LANGUAGES`, `enabledLanguages`.
- Produces: `MicButton`, `LanguagePicker`.

- [ ] **Step 1: Create `src/features/voice-ai/components/MicButton.tsx`**

```tsx
import React from 'react';
import { Mic, Square } from 'lucide-react';

interface Props {
  isListening: boolean;
  disabled?: boolean;
  onStart: () => void;
  onStop: () => void;
}

export default function MicButton({ isListening, disabled, onStart, onStop }: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={isListening ? onStop : onStart}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
      aria-pressed={isListening}
      className={[
        'relative grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors disabled:opacity-40',
        isListening
          ? 'bg-red-500 text-white'
          : 'bg-linen-100 text-graphite-700 hover:bg-linen-200 hover:text-brand-700',
      ].join(' ')}
    >
      {isListening && (
        <span
          className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-30"
          aria-hidden="true"
        />
      )}
      {isListening ? (
        <Square className="relative h-4 w-4 fill-current" aria-hidden="true" />
      ) : (
        <Mic className="relative h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}
```

- [ ] **Step 2: Create `src/features/voice-ai/components/LanguagePicker.tsx`**

```tsx
import React from 'react';
import { enabledLanguages, type LanguageKey } from '../lib/languages';

interface Props {
  value: LanguageKey;
  onChange: (language: LanguageKey) => void;
}

export default function LanguagePicker({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Conversation language"
      className="flex gap-1.5 rounded-full bg-linen-100 p-1"
    >
      {enabledLanguages().map((language) => {
        const selected = language.key === value;
        return (
          <button
            key={language.key}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(language.key)}
            className={[
              'rounded-full px-3 py-1 text-[11px] font-semibold transition-colors',
              selected ? 'bg-brand-600 text-white' : 'text-graphite-600 hover:text-brand-700',
            ].join(' ')}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Wire voice into `VoiceAssistant.tsx`**

Add imports:

```tsx
import { Volume2, VolumeX } from 'lucide-react';
import MicButton from './components/MicButton';
import LanguagePicker from './components/LanguagePicker';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { LANGUAGES } from './lib/languages';
```

Inside the component, after `const chat = useChat();`:

```tsx
const languageConfig = LANGUAGES[chat.language];
const speech = useSpeechSynthesis();
const voice = useVoiceRecognition(languageConfig.asr);

const speakReply = (text: string) => {
  speech.speak(text, languageConfig.tts, languageConfig.ttsFallback);
};

// A finished transcript becomes the draft; the customer confirms before sending,
// so a misheard phrase is corrected rather than sent.
React.useEffect(() => {
  if (voice.transcript) setDraft(voice.transcript);
}, [voice.transcript]);

const handleMicStart = () => {
  speech.stop();
  voice.reset();
  voice.start();
};
```

Update `handleSubmit` and `handleQuickAction` to speak the reply:

```tsx
const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  const text = draft.trim();
  if (!text) return;
  setDraft('');
  voice.reset();
  const reply = await chat.send(text);
  if (reply) speakReply(reply);
};

const handleQuickAction = async (prompt: string) => {
  const reply = await chat.send(prompt);
  if (reply) speakReply(reply);
};
```

Add the language picker and the voice-output toggle to the header, replacing the existing close button row's right side:

```tsx
<div className="flex items-center gap-1.5">
  {speech.isSupported && (
    <button
      type="button"
      onClick={() => speech.setEnabled(!speech.enabled)}
      aria-label={speech.enabled ? 'Turn voice replies off' : 'Turn voice replies on'}
      aria-pressed={speech.enabled}
      className="rounded-full p-2 text-graphite-500 transition-colors hover:bg-linen-100 hover:text-ink-900"
    >
      {speech.enabled ? (
        <Volume2 className="h-5 w-5" aria-hidden="true" />
      ) : (
        <VolumeX className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  )}
  <button
    type="button"
    onClick={() => setIsOpen(false)}
    aria-label="Close RelaxPro AI"
    className="rounded-full p-2 text-graphite-500 transition-colors hover:bg-linen-100 hover:text-ink-900"
  >
    <X className="h-5 w-5" aria-hidden="true" />
  </button>
</div>
```

Add the picker directly under the header:

```tsx
<div className="flex items-center justify-between border-b border-graphite-100 px-4 py-2">
  <LanguagePicker value={chat.language} onChange={chat.setLanguage} />
</div>
```

Add the mic button and the status line to the form. Replace the form's contents with:

```tsx
<div className="border-t border-graphite-200 px-3 py-3">
  {voice.isListening && (
    <p className="mb-2 flex items-center gap-2 px-1 text-[11px] font-medium text-red-500">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" aria-hidden="true" />
      Listening… tap the square to stop
    </p>
  )}
  {voice.error && (
    <p role="alert" className="mb-2 px-1 text-[11px] text-graphite-600">
      {voice.error}
    </p>
  )}

  {/*
    Spec §11: a WhatsApp escape hatch must be reachable from every error state.
    Keeping it permanently in the footer covers the chat-failure, mic-failure,
    unsupported-browser, and no-results cases with one control.
  */}
  <a
    href={buildWhatsAppUrl('Hi RelaxPro, I need help choosing a mattress.')}
    target="_blank"
    rel="noopener noreferrer"
    className="mb-2 block px-1 text-[11px] font-medium text-brand-600 underline-offset-2 hover:underline"
  >
    Talk to a RelaxPro expert on WhatsApp
  </a>

  <form onSubmit={handleSubmit} className="flex items-center gap-2">
    <label htmlFor="relaxpro-ai-input" className="sr-only">
      Type your question
    </label>
    <input
      id="relaxpro-ai-input"
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      placeholder={voice.interimTranscript || 'Naaku queen mattress kavali...'}
      autoComplete="off"
      className="min-h-11 flex-1 rounded-full border border-graphite-200 bg-linen-50 px-4 text-sm text-ink-900 placeholder:text-graphite-400 focus:border-brand-500 focus:outline-none"
    />
    {voice.isSupported && (
      <MicButton
        isListening={voice.isListening}
        disabled={chat.status === 'sending'}
        onStart={handleMicStart}
        onStop={voice.stop}
      />
    )}
    <button
      type="submit"
      disabled={!draft.trim() || chat.status === 'sending'}
      aria-label="Send message"
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
    >
      <Send className="h-4 w-4" aria-hidden="true" />
    </button>
  </form>
</div>
```

Pass `speakReply` to `MessageList` so each assistant message gets a replay control:

```tsx
<MessageList
  messages={chat.messages}
  isSending={chat.status === 'sending'}
  onReplay={speakReply}
>
```

- [ ] **Step 4: Verify on Android Chrome**

Serve on your LAN so a phone can reach it:

```bash
npx vercel dev --listen 0.0.0.0:3000
```

On an Android phone on the same network, open `http://<your-lan-ip>:3000`. Note that Chrome requires a secure context for the microphone — if the mic does not prompt over plain HTTP, deploy a Vercel preview and test against the HTTPS URL instead.

Confirm:
- Tapping the mic prompts for permission, then shows **Listening…**.
- Speaking Tenglish fills the input with an approximate transcript.
- Sending produces a Tenglish reply that is then spoken aloud.
- Switching to **తెలుగు** and speaking Telugu produces a transcript in Telugu script.
- Denying microphone permission shows exactly: *I couldn't access your microphone. Please check your browser microphone permission.*

- [ ] **Step 5: Verify the fallback on desktop Firefox**

Open the same URL in Firefox. Confirm the mic button is **absent**, the text input still works, and the message reads exactly: *Voice input is not supported on this browser. Please type your question.*

- [ ] **Step 6: Commit**

```bash
git add src/features/voice-ai/components/MicButton.tsx src/features/voice-ai/components/LanguagePicker.tsx src/features/voice-ai/VoiceAssistant.tsx
git commit -m "feat(ai): voice input, speech output, and language picker"
```

---

## Task 13: Lead capture

**Files:**
- Create: `api/lead.ts`
- Modify: `api/_lib/tools.ts` (replace the `handleCaptureLead` stub)
- Create: `src/features/voice-ai/components/LeadCaptureForm.tsx`
- Modify: `src/features/voice-ai/VoiceAssistant.tsx`
- Modify: `google-apps-script.gs`

**Interfaces:**
- Consumes: `captureLeadSchema` (already defined in Task 6).
- Produces: `submitLead(payload)` from `api/lead.ts`; `LeadCaptureForm`.

- [ ] **Step 1: Add the `AI Summary` column to `google-apps-script.gs`**

`COLUMN_HEADERS` currently has 14 entries ending in `'Source'`. Append one more so it becomes column O:

```js
const COLUMN_HEADERS = [
  'Timestamp',
  'Order ID',
  'Full Name',
  'Phone',
  'Email',
  'City',
  'Address',
  'Pincode',
  'Contact Time',
  'Product / Service',
  'Size',
  'Price',
  'Notes / Details',
  'Source',
  'AI Summary',
];
```

Then find the `sheet.appendRow(row)` call around line 152 and append the new field to the `row` array, immediately after the `source` value:

```js
  data.aiSummary || '',
```

**Redeploy the Web App after this change** (Deploy → Manage deployments → Edit → New version), otherwise the column is never written.

- [ ] **Step 2: Create `api/lead.ts`**

This reads the real Apps Script response, unlike the browser's `mode: 'no-cors'` call in `src/services/leadService.ts`, which cannot detect failure.

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  pincode?: string;
  contactTime?: string;
  product?: string;
  size?: string;
  price?: string;
  notes?: string;
  source: string;
  aiSummary?: string;
  orderId?: string;
}

const SCRIPT_URL =
  process.env.GOOGLE_SCRIPT_URL || process.env.VITE_PUBLIC_GOOGLE_SCRIPT_URL || '';

export async function submitLead(payload: LeadPayload): Promise<{ ok: boolean; error?: string }> {
  if (!SCRIPT_URL) return { ok: false, error: 'Lead endpoint is not configured' };

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(payload)) {
    params.append(key, value == null ? '' : String(value));
  }
  // The Apps Script doPost parses several shapes defensively; mirror the
  // existing client contract so no script change is needed beyond the column.
  params.append('payload', JSON.stringify(payload));

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      redirect: 'follow',
    });
    if (!response.ok) return { ok: false, error: `Apps Script returned ${response.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as Partial<LeadPayload>;
  if (!body?.name || !body?.phone) {
    return res.status(400).json({ ok: false, error: 'name and phone are required' });
  }

  const result = await submitLead({
    ...body,
    name: body.name,
    phone: body.phone,
    source: body.source || 'RelaxPro AI Assistant',
  });

  return res.status(result.ok ? 200 : 502).json(result);
}
```

- [ ] **Step 3: Replace the `handleCaptureLead` stub in `api/_lib/tools.ts`**

Add the import at the top of the file:

```ts
import { submitLead } from '../lead';
```

Replace the stub body with:

```ts
async function handleCaptureLead(argumentsJson: string): Promise<ToolResult> {
  const parsed = parseArgs(captureLeadSchema, argumentsJson);
  if (!parsed.ok) return fail(parsed.error, 'lead_capture');

  const { name, phone, preferredContact, city, notes, summary } = parsed.value;

  const result = await submitLead({
    name,
    phone,
    city,
    notes,
    contactTime: preferredContact === 'call' ? 'Phone call' : 'WhatsApp',
    aiSummary: summary ?? '',
    source: 'RelaxPro AI Assistant',
  });

  if (!result.ok) {
    return {
      ok: false,
      products: [],
      intent: 'lead_capture',
      data: {
        error:
          'The details could not be saved. Apologise briefly and offer the WhatsApp link instead by calling escalate_to_human.',
      },
    };
  }

  return {
    ok: true,
    products: [],
    intent: 'lead_capture',
    data: {
      saved: true,
      note: `Confirm to ${name} that a RelaxPro expert will contact them on ${preferredContact}. Do not ask for any further details.`,
    },
  };
}
```

- [ ] **Step 4: Create `src/features/voice-ai/components/LeadCaptureForm.tsx`**

Shown when the assistant signals lead intent, so a customer who prefers typing their number into a field can do so.

```tsx
import React, { useState } from 'react';

interface Props {
  onSubmit: (lead: { name: string; phone: string; preferredContact: 'whatsapp' | 'call' }) => void;
  onDismiss: () => void;
  isSubmitting?: boolean;
}

export default function LeadCaptureForm({ onSubmit, onDismiss, isSubmitting }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredContact, setPreferredContact] = useState<'whatsapp' | 'call'>('whatsapp');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2) return setError('Please enter your name.');
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      return setError('Please enter a valid 10-digit mobile number.');
    }
    setError(null);
    onSubmit({ name: name.trim(), phone: phone.trim(), preferredContact });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-1 space-y-2.5 rounded-2xl border border-brand-200 bg-linen-50 p-3.5"
      aria-label="Contact details for a RelaxPro expert"
    >
      <p className="text-xs font-semibold text-ink-900">
        Would you like our RelaxPro expert to contact you?
      </p>

      <label htmlFor="lead-name" className="sr-only">Your name</label>
      <input
        id="lead-name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Your name"
        autoComplete="name"
        className="min-h-11 w-full rounded-full border border-graphite-200 bg-white px-4 text-sm"
      />

      <label htmlFor="lead-phone" className="sr-only">Mobile number</label>
      <input
        id="lead-phone"
        value={phone}
        onChange={(event) => setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder="10-digit mobile number"
        inputMode="numeric"
        autoComplete="tel"
        className="min-h-11 w-full rounded-full border border-graphite-200 bg-white px-4 text-sm"
      />

      <div role="radiogroup" aria-label="Preferred contact method" className="flex gap-2">
        {(['whatsapp', 'call'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={preferredContact === option}
            onClick={() => setPreferredContact(option)}
            className={[
              'flex-1 rounded-full px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors',
              preferredContact === option
                ? 'bg-brand-600 text-white'
                : 'border border-graphite-200 bg-white text-graphite-600',
            ].join(' ')}
          >
            {option === 'whatsapp' ? 'WhatsApp' : 'Phone call'}
          </button>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-[11px] text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-full px-3 py-2 text-[11px] font-medium text-graphite-500"
        >
          Not now
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 rounded-full bg-brand-600 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white disabled:opacity-40"
        >
          {isSubmitting ? 'Sending…' : 'Yes, contact me'}
        </button>
      </div>

      <p className="text-[10px] leading-snug text-graphite-400">
        By submitting this form you agree to be contacted via call, WhatsApp or email.
      </p>
    </form>
  );
}
```

- [ ] **Step 5: Wire the form into `VoiceAssistant.tsx`**

Add the import and state:

```tsx
import LeadCaptureForm from './components/LeadCaptureForm';
```

```tsx
const [leadDismissed, setLeadDismissed] = useState(false);
const showLeadForm = chat.intent === 'lead_capture' && !leadDismissed && chat.status === 'idle';

const handleLeadSubmit = async (lead: {
  name: string;
  phone: string;
  preferredContact: 'whatsapp' | 'call';
}) => {
  setLeadDismissed(true);
  const reply = await chat.send(
    `My name is ${lead.name}, my number is ${lead.phone}, please contact me on ${lead.preferredContact}.`,
  );
  if (reply) speakReply(reply);
};
```

Render it inside `MessageList`'s children, after the product carousel:

```tsx
{showLeadForm && (
  <LeadCaptureForm
    onSubmit={handleLeadSubmit}
    onDismiss={() => setLeadDismissed(true)}
    isSubmitting={chat.status === 'sending'}
  />
)}
```

- [ ] **Step 6: Verify manually**

Restart the dev server with both env vars set:

```bash
export GROQ_API_KEY="gsk_..."
export GOOGLE_SCRIPT_URL="https://script.google.com/macros/s/.../exec"
npx vercel dev --listen 3000
```

In the widget, type `I want to buy the Vilasa mattress, please call me`. Confirm:
- The assistant asks whether you would like an expert to contact you — it does **not** demand a phone number out of nowhere.
- Supplying a name and number produces a confirmation.
- A new row appears in the Google Sheet with `RelaxPro AI Assistant` in **Source** and a populated **AI Summary** in column O.

Then break it deliberately: unset `GOOGLE_SCRIPT_URL`, restart, and repeat. Confirm the assistant reports that it could not save the details and offers WhatsApp — it must not claim success.

- [ ] **Step 7: Run the full suite and commit**

Run: `npm test && npm run lint`
Expected: PASS, no type errors.

```bash
git add api/lead.ts api/_lib/tools.ts src/features/voice-ai/components/LeadCaptureForm.tsx src/features/voice-ai/VoiceAssistant.tsx google-apps-script.gs
git commit -m "feat(ai): lead capture into the existing google sheet with AI summary"
```

---

## Task 14: Integration, FAB consolidation, and smoke test

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/components/layout/WhatsAppFAB.tsx`
- Create: `tests/e2e/voice-ai.spec.ts`

**Interfaces:**
- Consumes: everything above.
- Produces: the mounted feature.

- [ ] **Step 1: Remove `WhatsAppFAB` from `src/App.tsx`**

Delete the import line:

```tsx
import WhatsAppFAB from './components/layout/WhatsAppFAB';
```

and the render line `<WhatsAppFAB />`. Keep the lazy `VoiceAssistant` mount added in Task 10. The bottom-right corner now holds one control; the WhatsApp handoff lives inside the assistant, where it carries conversation context.

- [ ] **Step 2: Delete the now-unused component**

```bash
git rm src/components/layout/WhatsAppFAB.tsx
```

Confirm nothing else references it:

```bash
grep -rn "WhatsAppFAB" src/ --include="*.tsx" --include="*.ts"
```

Expected: no output.

- [ ] **Step 3: Verify the widget does not affect page load**

```bash
npm run build
```

Expected: the build succeeds and the voice-ai code lands in its own lazy chunk, not in the entry chunk. Confirm by checking the Rollup output for a chunk containing `VoiceAssistant`.

- [ ] **Step 4: Write the smoke test**

Create `tests/e2e/voice-ai.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000';

test.describe('RelaxPro AI assistant', () => {
  test('opens, answers a quick action, and renders grounded product cards', async ({ page }) => {
    await page.goto(BASE_URL);

    const launcher = page.getByRole('button', { name: 'Talk to RelaxPro AI' });
    await expect(launcher).toBeVisible();
    await launcher.click();

    const dialog = page.getByRole('dialog', { name: 'RelaxPro AI assistant' });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('Namaskaram');

    await dialog.getByRole('button', { name: 'Under ₹20K' }).click();

    const cards = dialog.getByRole('article');
    await expect(cards.first()).toBeVisible({ timeout: 30_000 });

    // Every displayed price must respect the stated budget.
    const prices = await cards.locator('text=/^₹[\\d,]+/').allTextContents();
    expect(prices.length).toBeGreaterThan(0);
    for (const price of prices) {
      const value = Number(price.replace(/[₹,\/].*$/g, '').replace(/\D/g, ''));
      expect(value).toBeLessThanOrEqual(20000);
    }

    // Every card shows a match percentage produced by the scorer.
    await expect(cards.first()).toContainText('% Match');
  });

  test('exposes the whatsapp handoff with the configured number', async ({ page, context }) => {
    await page.goto(BASE_URL);
    await page.getByRole('button', { name: 'Talk to RelaxPro AI' }).click();

    const dialog = page.getByRole('dialog', { name: 'RelaxPro AI assistant' });
    await dialog.getByRole('button', { name: 'Under ₹20K' }).click();
    await expect(dialog.getByRole('article').first()).toBeVisible({ timeout: 30_000 });

    const popupPromise = context.waitForEvent('page');
    await dialog.getByRole('button', { name: /^Enquire about / }).first().click();
    const popup = await popupPromise;
    expect(popup.url()).toContain('wa.me/918686624494');
  });

  test('site still works when the ai backend is unavailable', async ({ page }) => {
    await page.route('**/api/chat', (route) => route.abort());
    await page.goto(BASE_URL);

    await page.getByRole('button', { name: 'Talk to RelaxPro AI' }).click();
    const dialog = page.getByRole('dialog', { name: 'RelaxPro AI assistant' });
    await dialog.getByRole('button', { name: 'Find My Mattress' }).click();

    await expect(dialog).toContainText("I'm having trouble connecting right now", {
      timeout: 30_000,
    });

    // The rest of the page is unaffected.
    await page.keyboard.press('Escape');
    await expect(page.getByRole('navigation').first()).toBeVisible();
  });
});
```

- [ ] **Step 5: Run the smoke test**

With `npx vercel dev --listen 3000` running in another terminal:

```bash
npx playwright test tests/e2e/voice-ai.spec.ts
```

Expected: 3 passed.

- [ ] **Step 6: Accessibility pass**

With the widget open, verify by keyboard only:

- `Tab` reaches the launcher, and `Enter` opens the panel.
- `Tab` cycles through language radios, the input, the mic, and send.
- The close button is reachable and labelled *Close RelaxPro AI*.
- While recording, the mic button's accessible name is *Stop listening*.
- With a screen reader running, a new assistant reply is announced (the `role="log"` `aria-live="polite"` container).

- [ ] **Step 7: Run everything**

```bash
npm test && npm run lint && npm run build
```

Expected: all pass.

- [ ] **Step 8: Commit and open the pull request**

```bash
git add -A
git commit -m "feat(ai): mount RelaxPro AI, consolidate floating buttons, add smoke test"
git push -u origin feat/voice-ai
gh pr create --title "feat: RelaxPro AI voice sales assistant" --body "Implements docs/superpowers/specs/2026-08-14-relaxpro-voice-ai-design.md"
```

---

## Post-merge checklist

These are not code tasks; they are the deployment steps without which the feature does not work in production.

- [ ] **Rotate the Groq API key.** The key used during design was transmitted in plaintext and must be treated as compromised.
- [ ] Set `GROQ_API_KEY` in the Vercel project's environment variables (Production and Preview).
- [ ] Set `GOOGLE_SCRIPT_URL` in Vercel — the server-side lead path reads it, and `VITE_PUBLIC_GOOGLE_SCRIPT_URL` alone is a client variable.
- [ ] Set `AI_DAILY_REQUEST_CAP` to a value matching your Groq tier. Remember each product turn costs **two** Groq requests.
- [ ] Confirm the Groq account's daily request allowance against expected traffic.
- [ ] Redeploy the Google Apps Script Web App so the `AI Summary` column is written.
- [ ] Verify on a real Android phone over HTTPS that the microphone prompts and Telugu recognition works.
- [ ] Watch the first day of Vercel function logs for `[api/chat]` errors and for rate-limit trips.
