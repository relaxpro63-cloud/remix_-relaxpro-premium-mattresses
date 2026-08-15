import { z } from 'zod';
import { submitLead } from '../lead';
import {
  getCatalog,
  findProduct,
  priceFor,
  availableSizes,
  lowestPrice,
  CATALOG_SIZES,
  type CatalogSize,
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
// Cast preserves the literal union so parsed sizes type-check against priceFor.
const sizeSchema = z.enum(CATALOG_SIZES as unknown as [CatalogSize, ...CatalogSize[]]);

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
