# RelaxPro CMS Architecture & Migration Guide

> **Project:** RelaxPro Premium Mattresses  
> **Sanity Studio:** https://relaxpro.sanity.studio  
> **Sanity Project ID:** `de6mndac`  
> **Dataset:** `production`  
> **Frontend:** Vite + React (TypeScript)  

---

## Table of Contents

1. [Overview](#1-overview)
2. [Sanity Studio Setup](#2-sanity-studio-setup)
3. [Schema Architecture](#3-schema-architecture)
4. [Desk Structure (Sidebar Organization)](#4-desk-structure-sidebar-organization)
5. [Seed Data & Migration](#5-seed-data--migration)
6. [Frontend Integration](#6-frontend-integration)
7. [GROQ Queries Reference](#7-groq-queries-reference)
8. [Image Handling](#8-image-handling)
9. [How to Add New Content](#9-how-to-add-new-content)
10. [Env Variables & Deployment](#10-env-variables--deployment)

---

## 1. Overview

This project uses **Sanity CMS** as a headless content management system. All website content — products, homepage sections, testimonials, FAQs, site settings — is managed through Sanity Studio (`https://relaxpro.sanity.studio/`).

**Architecture:**
```
Sanity Studio (relaxpro-studio/studio/)
       │
       │ (GROQ queries via @sanity/client)
       ▼
Frontend (Vite + React in /relaxpro/)
       │
       │ (imageUrl builder)
       ▼
Sanity Image CDN (cdn.sanity.io)
```

**Key principle:** No hardcoded content remains on the frontend. Every text, image, and setting is editable from Sanity Studio with sensible fallbacks.

---

## 2. Sanity Studio Setup

### Location
```
relaxpro-studio/studio/
├── sanity.config.ts       # Studio configuration
├── sanity.cli.ts          # CLI config (project ID, dataset)
├── deskStructure.ts       # Sidebar organization
├── schemas/
│   ├── index.ts           # Schema registry
│   ├── documents/         # Document-type schemas (23 files)
│   └── objects/           # Reusable object schemas (10 files)
├── seed/
│   ├── seed.mjs           # Main seed script (products, categories, homepage, etc.)
│   ├── seed-certifications.mjs  # Certifications seed script
│   ├── seed-builder.mjs   # Builder data seed script
│   └── *.json             # Seed data JSON files
└── dist/                  # Built Studio output
```

### Key Files

| File | Purpose |
|------|---------|
| `sanity.config.ts` | Project ID (`de6mndac`), dataset (`production`), schema types, desk structure |
| `sanity.cli.ts` | CLI configuration for deploy commands |
| `deskStructure.ts` | Organizes the Studio sidebar into logical groups |
| `schemas/index.ts` | Imports and exports all schema types |

### Environment Variables

```env
SANITY_AUTH_TOKEN=sk...  # Required for seeding/mutations (read+write access)
SANITY_STUDIO_PROJECT_ID=de6mndac
SANITY_STUDIO_DATASET=production
```

For the frontend, the Sanity client config at `src/lib/sanity.ts` uses hardcoded `projectId` and `dataset` (Vite reads runtime env vars from `import.meta.env`).

### Deploy Commands

```bash
# From relaxpro-studio/studio/
npx sanity deploy          # Build and deploy Studio to sanity.studio
npx sanity build           # Build Studio to dist/ for self-hosting
npx sanity schema validate # Validate schemas without deploying
```

---

## 3. Schema Architecture

### Document Types (23 total)

| Schema Name | Studio Label | Type | Description |
|-------------|-------------|------|-------------|
| `siteSettings` | Site Settings | Singleton | Global config: branding, SEO, contact info, footer, popup, certificates |
| `home` | Homepage | Singleton | All homepage sections: hero, features, categories, testimonials, etc. |
| `hero` | Homepage Hero | Singleton | Hero slides with image, heading, CTAs |
| `product` | Product | Document | Mattress products with full pricing, layers, images |
| `accessory` | Accessory | Document | Pillows, protectors, and other accessories |
| `brandCategory` | Category | Document | Product categories (Luxury, Premium, Comfort) |
| `showroom` | Showroom | Document | Physical store locations |
| `testimonial` | Testimonial | Document | Customer reviews |
| `faq` | FAQ | Document | Frequently asked questions |
| `offer` | Offer | Document | Time-limited discounts and promotions |
| `about` | About Page | Singleton | About page content |
| `contact` | Contact Page | Singleton | Contact page content|
| `productsPage` | Products Page | Singleton | Catalog page content |
| `customBuilder` | Mattress Builder | Singleton | Builder configuration: sizes, steps, materials |
| `builderMaterial` | Builder Material | Document | Foam/latex materials for the builder |
| `builderFabric` | Builder Fabric | Document | Cover fabrics for the builder |
| `navigation` | Navigation | Document | Desktop/mobile menu structure |
| `sleepScience` | Sleep Science | Singleton | Sleep science page content |
| `policyPage` | Policy Page | Document | Privacy, shipping, return policies |
| `location` | Location | Document | (Legacy - replaced by showroom) |
| `gallery` | Gallery | Document | Image galleries |
| `sleepStyle` | Sleep Style | Document | Sleep style categories |
| `certification` | Certification | Document | ISO, GOLS, OEKO-TEX certificates |
| `certificationSettings` | Certification Settings | Singleton | Homepage certification section config |

### Object Types (10 reusable)

| Object Name | Used In | Fields |
|-------------|---------|--------|
| `ctaButton` | Navigation, Hero, Home | `label`, `link`, `variant`, `openInNewTab` |
| `imageWithAlt` | Nearly all schemas | `asset` (image reference), `alt` (text) |
| `featureCard` | Home, About | `title`, `description`, `icon` |
| `navItem` | Navigation, Site Settings | `label`, `path`, `icon`, `isCta`, `children[]` |
| `socialLink` | Site Settings (Footer) | `platform`, `url` |
| `sizeOption` | Product | `name`, `width`, `length`, `price` |
| `formConfig` | Contact | `fields[]`, `submitButtonText`, `successMessage` |
| `pageSEO` | Multiple pages | `metaTitle`, `metaDescription`, `ogImage` |
| `builderThickness` | Builder Material | `thickness`, `label`, `price` |
| `richText` | About, Policy | Portable Text block content |

### Key Schema Details

#### `siteSettings` (Singleton)
The central configuration hub. Key field groups:
- **branding**: siteName, tagline, logo, favicon
- **navigation**: mainMenu, footerMenu, ctaButton, phoneNumber
- **footer**: description, socialLinks, trustBadges, certifications, copyrightText
- **contactInfo**: mainPhone, secondaryPhone, whatsappNumber, email, factoryAddress, googleMapsUrl
- **businessHours**: monday through sunday (string, default: "10:00 AM - 9:00 PM")
- **announcement**: showBanner, bannerText, bannerLink, bannerColor
- **staticImages**: gotsCotton, quiltedCotton, naturalLatex, comfortMeter, sizeChart, technicalSpecifications, vilasaBenefits, heroBedroom
- **seo**: metaTitle, metaDescription, ogImage
- **analytics**: gaTrackingId, metaPixelId, gtmId
- **certificates**: Array of { id, title, subtitle, description, pdfUrl, pdfEmbedUrl, validity }
- **leadPopup**: enabled, heading, description, badgeText, ctaLabel, successHeading, initialDelay, cooldownSeconds, scrollPercent, etc.

#### `product` (Document)
The most complex schema. Fields:
- **Basic**: name, slug (auto from name), tagline, subtitle, keyBenefit, description
- **Comfort**: comfortLevel (enum), comfortRating (1-5), totalThickness
- **Architecture**: layers[] with thickness, material (enum), brand, certifications, description
- **Pricing**: pricingModel (enum: with_without_accessories | fabric_options), pricing object with king/queen/double/single/diwan/custom for each model variant
- **Features**: features[], certifications[], accessories[]
- **Media**: image, images[], video
- **Relations**: category (reference to brandCategory), relatedProducts (references), tier
- **Flags**: isBestseller, isNew, isFeatured, inStock
- **SEO**: pageSEO object

#### `offer` (Document)
- title, subtitle, description, discountText, badge, type
- bannerImage, cta { label, link, variant }
- couponCode, showBanner, bannerColor
- startDate, endDate
- targetProducts[] (references to product)
- priority, isActive

#### `hero` (Singleton)
- slides[] with:
  - image (with asset + alt)
  - badge, heading, highlight, subheading, description
  - primaryCta, secondaryCta (ctaButton objects)
  - trustBadges[] (text + icon)

#### `certification` (Document)
- title, slug (auto from title), subtitle, description
- logoImage (with alt), certificateImage (with alt)
- pdfUrl, pdfEmbedUrl, certificateNumber
- issueDate, expiryDate, validity
- order, isActive

---

## 4. Desk Structure (Sidebar Organization)

The sidebar (`deskStructure.ts`) organizes the Studio into:

```
RelaxPro CMS
├── Pages
│   ├── Homepage
│   ├── Products Page
│   ├── Mattress Builder
│   ├── About Page
│   └── Contact Page
├── Offers & Campaigns
├── ─── (divider)
├── Mattresses         (document list)
├── Accessories        (document list)
├── Categories         (document list)
├── Showrooms          (document list)
├── Testimonials       (document list)
├── FAQs               (document list)
├── ─── (divider)
├── Builder
│   ├── Materials
│   └── Fabrics
├── ─── (divider)
└── Site Settings      (singleton)
```

Note: Some document types (hero, navigation, sleepScience, policyPage, gallery, sleepStyle, certification, certificationSettings) are accessible via the main document list or search but are NOT in the desk structure sidebar. This means they exist but require the "Search" bar to find, or they need to be added to the desk structure.

---

## 5. Seed Data & Migration

### Seed Scripts Location
```
relaxpro-studio/studio/seed/
├── seed.mjs                    # Main seed script
├── seed-certifications.mjs     # Certifications seed
├── seed-builder.mjs            # Builder data seed
├── imageMapping.json           # Auto-generated: maps local images → Sanity asset IDs
├── about.json                  # About page data
├── builderConfig.json          # Builder config data
├── builderFabrics.json         # Builder fabrics data
├── builderMaterials.json       # Builder materials data
├── categories.json             # Categories data
├── contact.json                # Contact page data
├── customBuilder.json          # Custom builder page data
├── faqs.json                   # FAQ data
├── homepage.json               # Homepage data
├── products.json               # Product data
├── productsPage.json           # Products page data
├── showrooms.json              # Showrooms data
├── siteSettings.json           # Site settings data
├── testimonials.json           # Testimonials data
└── uploadImages.mjs            # Standalone image upload script
```

### How the Seed Works

**Main Seed (`seed.mjs`):**

1. Reads `SANITY_AUTH_TOKEN` from environment
2. Creates a Sanity client with write access
3. **Image Upload**: For each product, category, etc., it calls `getImageAsset(localPath)` which:
   - Checks `imageMapping.json` for previously uploaded assets (deduplication)
   - If not found, reads the file from `public/images/` directory
   - Uploads to Sanity assets
   - Records the mapping in `imageMapping.json` for reuse
4. **Creates documents** using `createOrReplace` (idempotent):
   - Categories first (products reference them)
   - Then products
   - Then homepage, settings, testimonials, FAQs, etc.
5. Uses retry logic (3 attempts with 2s delay) for resilience

**To run the seed:**
```bash
cd relaxpro-studio/studio
SANITY_AUTH_TOKEN=skYourToken node seed/seed.mjs
```

**To run certification seed:**
```bash
cd relaxpro-studio/studio
SANITY_AUTH_TOKEN=skYourToken node seed/seed-certifications.mjs
```

### Image Mapping

`imageMapping.json` is auto-generated and tracks which local images have been uploaded to Sanity assets. This prevents duplicate uploads if the seed is run multiple times.

**Structure:**
```json
{
  "products/nirvana.webp": {
    "_type": "image",
    "asset": { "_type": "reference", "_ref": "image-abc123-800x600-png" },
    "alt": "Nirvana Mattress"
  }
}
```

**Key rule:** All images must be stored in `public/images/`. The seed script resolves relative paths from there.

### What Gets Seeded

| Document Type | Count | Source |
|---------------|-------|--------|
| `brandCategory` | 3 | Hardcoded in seed.mjs |
| `product` | 12+ | Hardcoded in seed.mjs + products.json |
| `home` | 1 | homepage.json |
| `siteSettings` | 1 | siteSettings.json |
| `testimonial` | 14 | testimonials.json |
| `faq` | 20+ | faqs.json |
| `about` | 1 | about.json |
| `contact` | 1 | contact.json |
| `productsPage` | 1 | productsPage.json |
| `customBuilder` | 1 | customBuilder.json + builderConfig.json |
| `builderMaterial` | 6 | builderMaterials.json |
| `builderFabric` | 2 | builderFabrics.json |
| `showroom` | 3 | showrooms.json |
| `certification` | 3 | seed-certifications.mjs |
| `certificationSettings` | 1 | seed-certifications.mjs |

---

## 6. Frontend Integration

### Sanity Client Configuration

**File:** `src/lib/sanity.ts`

```typescript
import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'

const PROJECT_ID = 'de6mndac'
const DATASET = 'production'

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: !import.meta.env.DEV,               // CDN in production, live in dev
  // In dev mode, proxies through Vite to bypass CORS:
  ...(import.meta.env.DEV && {
    useProjectHostname: false,
    apiHost: window.location.origin + '/api/sanity',
  }),
})

const builder = createImageUrlBuilder(sanityClient)
export function urlFor(source: any) {
  return builder.image(source)
}
```

### Image URL Helper

**File:** `src/lib/queries.ts` → `imageUrl()` and `imageUrlFor()`

```typescript
export function imageUrl(source: any, maxWidth = 2560) {
  if (!source) return ''                          // null/undefined → ''
  if (typeof source === 'string') return source   // already URL → pass through
  // Extract asset reference and build CDN URL:
  const assetRef = source.asset?._ref || source.asset?._id || source._ref
  if (assetRef) {
    return urlFor({ ...source, asset: { ...(source.asset || {}), _ref: assetRef } })
      .width(maxWidth).auto('format').quality(80).url()
  }
  return ''
}
```

This handles:
- Null/missing images → empty string (component can fall back to a local file)
- Sanity image objects → CDN URL with transformations
- Direct URLs → passed through (for external images)

### Vite Config (CORS Proxy)

The Vite config (`vite.config.ts`) includes a proxy that rewrites `/api/sanity` to `https://de6mndac.apicdn.sanity.io` in development mode. This avoids CORS issues when querying from localhost.

### Preconnect Hint

The `index.html` includes:
```html
<link rel="preconnect" href="https://cdn.sanity.io">
```
This speeds up Sanity CDN image loading by pre-resolving DNS.

---

## 7. GROQ Queries Reference

All queries are in `src/lib/queries.ts`. Here is a complete reference:

| Function Name | GROQ Query | Returns |
|--------------|------------|---------|
| `getSiteSettings()` | `*[_type == "siteSettings"][0]` | Single object with branding, nav, footer, contactInfo, businessHours, announcement, staticImages, seo, analytics, certificates, leadPopup |
| `getNavigation()` | `*[_type == "navigation"][0]` | desktopMenu, mobileMenu, footerMenu |
| `getHero()` | `*[_type == "hero"][0]{slides[]}` | Array of hero slides with image, heading, CTAs |
| `getHomePage()` | `*[_type == "home"][0]` | Full homepage content with all sections |
| `getAllProducts()` | `*[_type == "product" && inStock == true] \| order(sortOrder asc)` | Array of products with pricing, images, category |
| `getProductBySlug(slug)` | `*[_type == "product" && slug.current == $slug][0]` | Single product with full details, related products |
| `getProductPricing(slug)` | `*[_type == "product" && slug.current == $slug][0]{ pricingModel, pricing }` | Pricing only (lightweight) |
| `getAboutPage()` | `*[_type == "about"][0]` | About page sections |
| `getContactPage()` | `*[_type == "contact"][0]` | Contact page heading, description, form fields |
| `getProductsPage()` | `*[_type == "productsPage"][0]` | Catalog page with products list |
| `getBrandCategories()` | `*[_type == "brandCategory"] \| order(order asc)` | All categories |
| `getFaqs()` | `*[_type == "faq"] \| order(order asc)` | All FAQs |
| `getTestimonials()` | `*[_type == "testimonial" && featured == true] \| order(order asc)` | Featured testimonials |
| `getAllShowrooms()` | `*[_type == "showroom"] \| order(order asc)` | All showrooms |
| `getBuilderData()` | `*[_type == "customBuilder"][0]` | Builder config + materials + fabrics (subquery) |
| `getSleepScience()` | `*[_type == "sleepScience"][0]` | Sleep science page |
| `getLocations()` | `*[_type == "showroom"] \| order(order asc)` | Showrooms with coordinates |
| `getPolicyPage(slug)` | `*[_type == "policyPage" && slug.current == $slug][0]` | Single policy page |
| `getGallery(slug)` | `*[_type == "gallery" && slug.current == $slug][0]` | Single gallery |
| `getAccessories()` | `*[_type == "accessory" && inStock == true] \| order(sortOrder asc)` | All accessories |
| `getAccessoryBySlug(slug)` | `*[_type == "accessory" && slug.current == $slug][0]` | Single accessory |
| `getCertifications()` | `*[_type == "certification" && isActive == true] \| order(order asc)` | Active certifications |
| `getCertificationSettings()` | `*[_type == "certificationSettings"][0]` | Certification section settings |
| `getActiveOffers()` | `*[_type == "offer" && isActive == true && (endDate == null \|\| endDate > now())] \| order(priority desc)` | Active offers |

### Query Conventions

1. **Singletons** use `[0]` to get the first document
2. **References** use `->` to dereference (e.g., `category->{ name }`)
3. **Slug fields** use `"slug": slug.current` to get the string value
4. **Images** use `image { asset->{ _id, url }, alt }` to get the raw URL
5. **CDN URLs** are NOT stored — they're generated by `imageUrl()` on the frontend

---

## 8. Image Handling

### Storage
- All images are stored in **Sanity Assets** (not URL strings in content)
- Local images live in `public/images/` as development/reference copies
- The seed script uploads from `public/images/` → Sanity Assets

### Image Schema Pattern
```typescript
// Schema definition (imageWithAlt object):
{
  name: 'heroImage',
  title: 'Hero Image',
  type: 'imageWithAlt'  // Custom object: asset reference + alt text
}

// Query response structure:
{
  "asset": {
    "_id": "image-abc123-800x600-png",
    "url": "https://cdn.sanity.io/images/de6mndac/production/abc123-800x600.png"
  },
  "alt": "Description of the image"
}

// Frontend usage:
imageUrl(heroImage)  // → https://cdn.sanity.io/images/de6mndac/production/abc123-800x600.png?w=2560&auto=format&q=80
```

### Image Transformations

The `imageUrl()` utility applies:
- **Width**: default 2560px (responsive)
- **Format**: auto (WebP when supported by browser)
- **Quality**: 80 (balance of quality + file size)
- **`sizes` attribute**: Components specify responsive sizes (e.g., `sizes="100vw"` for hero, `sizes="(max-width: 768px) 50vw, 33vw"` for product cards)

### Adding New Images

1. Drop the image file into `public/images/` (or subdirectory)
2. In Sanity Studio, upload via the image field (drag & drop supported)
3. In the frontend, ensure the GROQ query includes the image field
4. Use `imageUrl(data.imageField)` to generate the CDN URL

For seed data, add the file to the appropriate JSON and ensure `getImageAsset()` is called.

### Performance
- `<link rel="preconnect" href="https://cdn.sanity.io">` in `index.html`
- `loading="lazy"` on all non-hero images
- `loading="eager"` + `fetchpriority="high"` on hero images
- WebP auto-conversion via `auto('format')`
- Blur placeholders where applicable (SafeImage component)

---

## 9. How to Add New Content

### Adding a New Product (via Sanity Studio)

1. Open https://relaxpro.sanity.studio/
2. Click **Mattresses** → **Create new**
3. Fill in:
   - **Product Name** (required)
   - **Slug** (auto-generated from name)
   - **Tagline**, **Key Benefit**, **Description**
   - **Comfort Level** (dropdown)
   - **Total Thickness** (inches)
   - **Pricing Model**: Select "With / Without Accessories" or "Fabric Options"
   - **Pricing**: Fill in prices for King, Queen, Double, Single (at minimum)
   - **Features**: Add bullet points
   - **Image**: Upload product image
   - **Category**: Link to a brand category
   - **Tier**: Select Comfort / Premium / Luxury
   - **Flags**: Toggle Bestseller, New Arrival, etc.
4. Click **Publish**

### Adding a New Offer/Campaign

1. Open https://relaxpro.sanity.studio/
2. Click **Offers & Campaigns** → **Create new**
3. Fill in title, description, banner image, discount text
4. Set **startDate** and **endDate**
5. Toggle **isActive** to true
6. (Optional) Link **targetProducts** to show on specific product pages
7. Click **Publish**

### Editing Homepage Content

1. Open https://relaxpro.sanity.studio/
2. Click **Pages** → **Homepage**
3. Each section is collapsible:
   - **Ownership Ways**: Two cards (Custom Builder + Our Models)
   - **Shop by Brands**: Category tabs
   - **Bestsellers Section**: Featured products
   - **Cost Comparison**: Natural Latex vs Ordinary Foam
   - **Testimonials Section**: Customer reviews
   - **Showrooms**: Location cards
   - **FAQ Section**: Questions/answers
4. Make changes and click **Publish**

### Editing Hero Section

1. Open https://relaxpro.sanity.studio/
2. Search for "hero" in the search bar
3. Click the **hero** document
4. Edit slides: heading, description, CTAs, image
5. Click **Publish**

### Editing Site Settings

1. Open https://relaxpro.sanity.studio/
2. Scroll down the sidebar → **Site Settings**
3. Sections: Branding, Navigation, Footer, Global Contact Info, Business Hours, Announcement, Static Brand Images, Default SEO, Analytics, Lead Capture Popup, Certificate PDF Links

---

## 10. Env Variables & Deployment

### Required for Seeding
```bash
SANITY_AUTH_TOKEN=skYourToken  # From sanity.io/manage → API → Tokens
```

### Frontend (Vite)
No Sanity-specific env vars needed in the frontend. The project ID and dataset are hardcoded in `src/lib/sanity.ts` for simplicity. In development, Vite proxies Sanity API calls to avoid CORS.

### Deploying Sanity Schema Changes
```bash
cd relaxpro-studio/studio
npx sanity deploy            # Builds and deploys studio to sanity.studio
```

### Deploying Frontend
```bash
cd relaxpro/
npx vite build                # Builds to dist/
git push origin main          # Pushes to GitHub → Vercel auto-deploys
```

### Making Content Edits Live
1. Make edits in Sanity Studio
2. Click **Publish**
3. Changes are immediately visible via the CDN (may take a few seconds to propagate)
4. No frontend redeploy needed for content changes — only for code changes

---

## Quick Reference: Common Tasks

| Task | Where to Do It |
|------|---------------|
| Change phone number | Site Settings → Global Contact Info |
| Upload new product | Mattresses → Create new |
| Change homepage text | Pages → Homepage |
| Update hero image | Search for "hero" → edit slide |
| Add an offer | Offers & Campaigns → Create new |
| Change footer | Site Settings → Footer |
| Update SEO titles | Site Settings → Default SEO |
| Add a testimonial | Testimonials → Create new |
| Add a store location | Showrooms → Create new |
| Update certificate PDFs | Search for "certification" → edit document |
| Add builder material | Builder → Materials → Create new |
| Change announcement banner | Site Settings → Announcement Banner |
| Edit popup settings | Site Settings → Lead Capture Popup |
| Upload logo/favicon | Site Settings → Branding |
