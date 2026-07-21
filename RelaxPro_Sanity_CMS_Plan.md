# RelaxPro Website - Sanity CMS Migration Plan

> **Project:** RelaxPro Mattress Website  
> **Goal:** Make 100% of website content editable via Sanity CMS  
> **Date:** July 21, 2026  
> **Status:** Planning Phase  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Website Audit - All Pages and Sections](#2-website-audit)
3. [Sanity Project Architecture](#3-sanity-project-architecture)
4. [Complete Schema Definitions](#4-complete-schema-definitions)
5. [Page-by-Page Editable Content Map](#5-page-by-page-editable-content-map)
6. [Data Migration Plan](#6-data-migration-plan)
7. [Frontend Integration Plan](#7-frontend-integration-plan)
8. [GROQ Queries Reference](#8-groq-queries-reference)
9. [Deployment and Environment Setup](#9-deployment-and-environment-setup)
10. [Client Training Guide](#10-client-training-guide)
11. [Timeline and Milestones](#11-timeline-and-milestones)
12. [Appendix](#12-appendix)

---

## 1. Project Overview

### 1.1 Objective

Migrate the entire RelaxPro mattress website (https://relaxpromatres.netlify.app/) to a fully CMS-driven architecture using **Sanity.io**, ensuring that **every single piece of content** — text, images, prices, products, testimonials, showrooms, FAQs, forms, navigation, footer, SEO — is editable by the client without any developer intervention.

### 1.2 Current Website Pages

| # | Page | URL | Type |
|---|------|-----|------|
| 1 | Home | `/` | Multi-section landing page |
| 2 | Products | `/products` | Product listing |
| 3 | Product Detail | `/products/:slug` | Individual product page |
| 4 | Custom Builder | `/custom-builder` | Interactive configurator |
| 5 | About | `/about` | Company story |
| 6 | Contact / Book Visit | `/contact` | Contact + booking form |

### 1.3 Tech Stack (Recommended)

| Layer | Technology |
|-------|------------|
| CMS | Sanity.io (Content Lake) |
| Studio | Sanity Studio v3 |
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Hosting | Vercel / Netlify |
| Images | Sanity CDN (with hotspot/crop) |
| Forms | Sanity Documents or external (Formspree) |

---

## 2. Website Audit - All Pages and Sections

### 2.1 Homepage (`/`)

| Section # | Section Name | Editable Elements |
|-----------|-------------|-------------------|
| H-01 | **Navbar** | Logo, menu items, CTA button text and link, phone number |
| H-02 | **Hero Banner** | Title, subtitle, description, 2 CTA buttons (label + link), background image |
| H-03 | **Trust Badges / Features Grid** | 3 feature cards (icon, title, description) |
| H-04 | **Two Ways to Own** | Section title, subtitle, "Build Your Own" card (title, desc, features list, CTA), "Shop Pre-Built" card (title, desc, features list, CTA) |
| H-05 | **Shop by Brands / Categories** | Section title, category cards (name, icon, description, link) |
| H-06 | **Bestselling Products** | Section title, CTA link, product cards (image, name, tagline, price, rating, badges) |
| H-07 | **Cost Comparison** | Title, subtitle, Natural Latex column (price, lifespan, per year, per day), Ordinary Foam column (same fields), comparison note |
| H-08 | **Showroom CTA Banner** | Title, location name, address, CTA button |
| H-09 | **Why Choose RelaxPro** | Section title, 4 benefit cards (icon, title, description) |
| H-10 | **Testimonials** | Section title, overall rating, total reviews count, testimonial cards (name, location, rating, quote, verified badge) |
| H-11 | **All Showrooms** | Section title, description, showroom cards (name, type badge, address, hours, phone, CTA buttons) |
| H-12 | **Sleep FAQs and Guides** | Section title, description, category tabs, FAQ accordion items (question, answer) |
| H-13 | **Book Showroom Visit Form** | Title, subtitle, form fields (name, phone, showroom select, date, time slot), submit button text |
| H-14 | **Diagnostic Consultation Form** | Title, description, form fields (name, phone, back concern select, message), submit button |
| H-15 | **Footer** | Logo, tagline, description, quick links, contact info, social links, certifications, copyright text |

### 2.2 Products Page (`/products`)

| Section # | Section Name | Editable Elements |
|-----------|-------------|-------------------|
| P-01 | **Page Header** | Title, subtitle/description |
| P-02 | **Filter Bar** | Category filter options, sort options |
| P-03 | **Product Grid** | Product cards (image, name, tagline, price, rating, badges, CTA) |
| P-04 | **SEO Section** | Meta title, meta description, OG image |

### 2.3 Product Detail Page (`/products/:slug`)

| Section # | Section Name | Editable Elements |
|-----------|-------------|-------------------|
| PD-01 | **Product Hero** | Image gallery, product name, tagline, rating, review count |
| PD-02 | **Pricing and Sizes** | Size selector (name, dimensions, price per size) |
| PD-03 | **Specifications** | Thickness, density, purity, certification, feel, material |
| PD-04 | **Description** | Long-form rich text description |
| PD-05 | **Benefits** | Bullet list of benefits |
| PD-06 | **Custom Options** | Available thicknesses, firmness levels |
| PD-07 | **Shipping and Warranty** | Delivery time, free delivery badge, warranty period, trial period |
| PD-08 | **Related Products** | Cross-sell product cards |
| PD-09 | **Reviews Section** | Customer reviews (name, rating, text, date) |

### 2.4 Custom Builder Page (`/custom-builder`)

| Section # | Section Name | Editable Elements |
|-----------|-------------|-------------------|
| CB-01 | **Page Header** | Title, description |
| CB-02 | **Step 1: Size** | Available sizes with dimensions and prices |
| CB-03 | **Step 2: Thickness** | Thickness options (4", 6", 8", 10") with price modifiers |
| CB-04 | **Step 3: Firmness** | Firmness levels (Soft, Medium, Firm) with descriptions |
| CB-05 | **Step 4: Material** | Material options (Pure Latex, Hybrid, Memory Foam) |
| CB-06 | **Price Calculator** | Base price, add-ons, total calculation logic |
| CB-07 | **CTA** | "Add to Cart" / "Request Quote" button text |

### 2.5 About Page (`/about`)

| Section # | Section Name | Editable Elements |
|-----------|-------------|-------------------|
| A-01 | **Hero** | Title, subtitle, hero image |
| A-02 | **Our Story** | Rich text content, images |
| A-03 | **Our Process** | Step cards (number, title, description, image) |
| A-04 | **Certifications** | Certification badges (name, logo image, description) |
| A-05 | **Team / Factory** | Team photos, factory images, descriptions |
| A-06 | **Values / Mission** | Mission statement, value cards |

### 2.6 Contact Page (`/contact`)

| Section # | Section Name | Editable Elements |
|-----------|-------------|-------------------|
| C-01 | **Page Header** | Title, subtitle |
| C-02 | **Contact Info Cards** | Phone, WhatsApp, Email (with icons and links) |
| C-03 | **Showroom Locations** | All showroom cards (reuses showroom schema) |
| C-04 | **Booking Form** | Form title, fields, submit button |
| C-05 | **Map Embed** | Google Maps embed URL or coordinates |
| C-06 | **FAQ / Help** | Quick help text, support hours |

---

## 3. Sanity Project Architecture

### 3.1 Project Structure

```
relaxpro-sanity/
├── sanity.config.ts
├── schemas/
│   ├── index.ts
│   ├── documents/
│   │   ├── home.ts
│   │   ├── about.ts
│   │   ├── contact.ts
│   │   ├── productsPage.ts
│   │   ├── customBuilder.ts
│   │   ├── product.ts
│   │   ├── showroom.ts
│   │   ├── testimonial.ts
│   │   ├── faq.ts
│   │   ├── brandCategory.ts
│   │   ├── siteSettings.ts
│   │   └── pageSEO.ts
│   ├── objects/
│   │   ├── heroSection.ts
│   │   ├── featureCard.ts
│   │   ├── ctaButton.ts
│   │   ├── productCard.ts
│   │   ├── pricingTable.ts
│   │   ├── sizeOption.ts
│   │   ├── specificationBlock.ts
│   │   ├── formConfig.ts
│   │   ├── socialLink.ts
│   │   ├── navItem.ts
│   │   └── imageWithAlt.ts
│   └── singletons/
│       ├── homeSingleton.ts
│       ├── aboutSingleton.ts
│       ├── contactSingleton.ts
│       └── settingsSingleton.ts
├── deskStructure.ts
├── seed/
│   ├── products.json
│   ├── showrooms.json
│   ├── testimonials.json
│   ├── faqs.json
│   └── seed.ts
├── package.json
└── .env
```

### 3.2 Sanity Studio Configuration

```typescript
// sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import { deskStructure } from './deskStructure'

export default defineConfig({
  name: 'relaxpro-cms',
  title: 'RelaxPro CMS',
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
```

### 3.3 Custom Desk Structure

```typescript
// deskStructure.ts
import { StructureBuilder } from 'sanity/structure'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('RelaxPro CMS')
    .items([
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.document().schemaType('home').documentId('home').title('Homepage'),
              S.document().schemaType('productsPage').documentId('productsPage').title('Products Page'),
              S.document().schemaType('customBuilder').documentId('customBuilder').title('Custom Builder'),
              S.document().schemaType('about').documentId('about').title('About Page'),
              S.document().schemaType('contact').documentId('contact').title('Contact Page'),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('product').title('Products'),
      S.documentTypeListItem('brandCategory').title('Categories'),
      S.documentTypeListItem('showroom').title('Showrooms'),
      S.documentTypeListItem('testimonial').title('Testimonials'),
      S.documentTypeListItem('faq').title('FAQs'),
      S.divider(),
      S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings'),
    ])
```

---

## 4. Complete Schema Definitions

### 4.1 Reusable Objects

#### `objects/ctaButton.ts`

```typescript
export default {
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    { name: 'label', title: 'Button Text', type: 'string' },
    { name: 'link', title: 'Link URL', type: 'string' },
    {
      name: 'variant',
      title: 'Style Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (Green)', value: 'primary' },
          { title: 'Secondary (Outline)', value: 'secondary' },
          { title: 'Ghost', value: 'ghost' },
        ],
      },
      initialValue: 'primary',
    },
    { name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean' },
  ],
}
```

#### `objects/imageWithAlt.ts`

```typescript
export default {
  name: 'imageWithAlt',
  title: 'Image with Alt Text',
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', title: 'Alt Text', type: 'string', options: { isHighlighted: true } },
    { name: 'caption', title: 'Caption', type: 'string', options: { isHighlighted: true } },
  ],
}
```

#### `objects/featureCard.ts`

```typescript
export default {
  name: 'featureCard',
  title: 'Feature Card',
  type: 'object',
  fields: [
    { name: 'icon', title: 'Icon (emoji or SVG name)', type: 'string' },
    { name: 'iconImage', title: 'Icon Image', type: 'imageWithAlt' },
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
  ],
}
```

#### `objects/navItem.ts`

```typescript
export default {
  name: 'navItem',
  title: 'Navigation Item',
  type: 'object',
  fields: [
    { name: 'label', title: 'Label', type: 'string' },
    { name: 'link', title: 'Link', type: 'string' },
    { name: 'openInNewTab', title: 'Open in New Tab', type: 'boolean' },
  ],
}
```

#### `objects/socialLink.ts`

```typescript
export default {
  name: 'socialLink',
  title: 'Social Link',
  type: 'object',
  fields: [
    {
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: { list: ['WhatsApp', 'Instagram', 'Facebook', 'YouTube', 'Twitter/X', 'LinkedIn'] },
    },
    { name: 'url', title: 'URL', type: 'url' },
    { name: 'icon', title: 'Icon Image', type: 'imageWithAlt' },
  ],
}
```

#### `objects/sizeOption.ts`

```typescript
export default {
  name: 'sizeOption',
  title: 'Size Option',
  type: 'object',
  fields: [
    { name: 'name', title: 'Size Name', type: 'string', description: 'e.g., King, Queen, Single' },
    { name: 'dimensions', title: 'Dimensions', type: 'string', description: 'e.g., 78x72 inches' },
    { name: 'price', title: 'Price (INR)', type: 'number' },
    { name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true },
  ],
}
```

#### `objects/formConfig.ts`

```typescript
export default {
  name: 'formConfig',
  title: 'Form Configuration',
  type: 'object',
  fields: [
    { name: 'title', title: 'Form Title', type: 'string' },
    { name: 'subtitle', title: 'Form Subtitle', type: 'text', rows: 2 },
    { name: 'submitButtonText', title: 'Submit Button Text', type: 'string' },
    { name: 'successMessage', title: 'Success Message', type: 'string' },
    {
      name: 'fields',
      title: 'Form Fields',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Field Name', type: 'string' },
            { name: 'label', title: 'Field Label', type: 'string' },
            { name: 'type', title: 'Field Type', type: 'string', options: { list: ['text', 'tel', 'email', 'select', 'date', 'textarea', 'time'] } },
            { name: 'required', title: 'Required', type: 'boolean' },
            { name: 'options', title: 'Dropdown Options', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    },
  ],
}
```

#### `objects/pageSEO.ts`

```typescript
export default {
  name: 'pageSEO',
  title: 'SEO Settings',
  type: 'object',
  fields: [
    { name: 'metaTitle', title: 'Meta Title', type: 'string' },
    { name: 'metaDescription', title: 'Meta Description', type: 'text', rows: 3 },
    { name: 'ogImage', title: 'OG Image', type: 'imageWithAlt' },
    { name: 'keywords', title: 'Keywords', type: 'array', of: [{ type: 'string' }] },
    { name: 'noIndex', title: 'No Index', type: 'boolean' },
  ],
}
```

---

### 4.2 Document Schemas

#### `documents/home.ts` — Homepage (Singleton)

```typescript
export default {
  name: 'home',
  title: 'Homepage',
  type: 'document',
  fields: [
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        { name: 'title', title: 'Main Title', type: 'string' },
        { name: 'subtitle', title: 'Subtitle', type: 'string' },
        { name: 'description', title: 'Description', type: 'text', rows: 4 },
        { name: 'backgroundImage', title: 'Background Image', type: 'imageWithAlt' },
        { name: 'ctaButtons', title: 'CTA Buttons', type: 'array', of: [{ type: 'ctaButton' }], validation: (Rule) => Rule.max(3) },
      ],
    },
    { name: 'featuresGrid', title: 'Features / Trust Badges', type: 'array', of: [{ type: 'featureCard' }], validation: (Rule) => Rule.min(2).max(6) },
    {
      name: 'ownershipWays',
      title: 'Two Ways to Own a RelaxPro',
      type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        {
          name: 'customBuilder', title: 'Build Your Own Card', type: 'object',
          fields: [
            { name: 'title', title: 'Card Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'features', title: 'Feature List', type: 'array', of: [{ type: 'string' }] },
            { name: 'cta', title: 'CTA Button', type: 'ctaButton' },
            { name: 'image', title: 'Card Image', type: 'imageWithAlt' },
          ],
        },
        {
          name: 'shopPrebuilt', title: 'Shop Pre-Built Card', type: 'object',
          fields: [
            { name: 'title', title: 'Card Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 3 },
            { name: 'features', title: 'Feature List', type: 'array', of: [{ type: 'string' }] },
            { name: 'cta', title: 'CTA Button', type: 'ctaButton' },
            { name: 'image', title: 'Card Image', type: 'imageWithAlt' },
          ],
        },
      ],
    },
    {
      name: 'shopByBrands', title: 'Shop by Brands / Categories', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        { name: 'categories', title: 'Categories', type: 'array', of: [{ type: 'reference', to: [{ type: 'brandCategory' }] }] },
      ],
    },
    {
      name: 'bestsellersSection', title: 'Bestselling Products Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        { name: 'products', title: 'Featured Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }], validation: (Rule) => Rule.max(8) },
        { name: 'viewAllCta', title: 'View All CTA', type: 'ctaButton' },
      ],
    },
    {
      name: 'costComparison', title: 'Cost Comparison Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        {
          name: 'naturalLatex', title: 'Natural Latex Column', type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'avgPrice', title: 'Average Price', type: 'string' },
            { name: 'lifespan', title: 'Lifespan', type: 'string' },
            { name: 'perYearCost', title: 'Per Year Cost', type: 'string' },
            { name: 'perDayCost', title: 'Per Day Cost', type: 'string' },
            { name: 'highlighted', title: 'Highlighted (Recommended)', type: 'boolean' },
          ],
        },
        {
          name: 'ordinaryFoam', title: 'Ordinary Foam Column', type: 'object',
          fields: [
            { name: 'label', title: 'Label', type: 'string' },
            { name: 'avgPrice', title: 'Average Price', type: 'string' },
            { name: 'lifespan', title: 'Lifespan', type: 'string' },
            { name: 'perYearCost', title: 'Per Year Cost', type: 'string' },
            { name: 'perDayCost', title: 'Per Day Cost', type: 'string' },
          ],
        },
        { name: 'footnote', title: 'Footnote / Disclaimer', type: 'text', rows: 2 },
      ],
    },
    {
      name: 'showroomCtaBanner', title: 'Showroom CTA Banner', type: 'object',
      fields: [
        { name: 'title', title: 'Title', type: 'string' },
        { name: 'locationName', title: 'Location Name', type: 'string' },
        { name: 'address', title: 'Address', type: 'text', rows: 3 },
        { name: 'backgroundImage', title: 'Background Image', type: 'imageWithAlt' },
        { name: 'cta', title: 'CTA Button', type: 'ctaButton' },
      ],
    },
    {
      name: 'whyChooseUs', title: 'Why Choose RelaxPro', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionSubtitle', title: 'Section Subtitle', type: 'text', rows: 2 },
        { name: 'benefits', title: 'Benefits', type: 'array', of: [{ type: 'featureCard' }], validation: (Rule) => Rule.min(3).max(8) },
      ],
    },
    {
      name: 'testimonialsSection', title: 'Testimonials Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'overallRating', title: 'Overall Rating', type: 'string' },
        { name: 'totalReviews', title: 'Total Reviews Count', type: 'string' },
        { name: 'testimonials', title: 'Featured Testimonials', type: 'array', of: [{ type: 'reference', to: [{ type: 'testimonial' }] }], validation: (Rule) => Rule.max(6) },
      ],
    },
    {
      name: 'allShowroomsSection', title: 'All Showrooms Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionDescription', title: 'Section Description', type: 'text', rows: 3 },
        { name: 'showrooms', title: 'Showrooms to Display', type: 'array', of: [{ type: 'reference', to: [{ type: 'showroom' }] }] },
      ],
    },
    {
      name: 'faqSection', title: 'FAQ / Sleep Guides Section', type: 'object',
      fields: [
        { name: 'sectionTitle', title: 'Section Title', type: 'string' },
        { name: 'sectionDescription', title: 'Section Description', type: 'text', rows: 3 },
        { name: 'categories', title: 'FAQ Category Tabs', type: 'array', of: [{ type: 'string' }] },
        { name: 'faqs', title: 'FAQ Items', type: 'array', of: [{ type: 'reference', to: [{ type: 'faq' }] }] },
      ],
    },
    { name: 'bookingForm', title: 'Book Showroom Visit Form', type: 'formConfig' },
    { name: 'diagnosticForm', title: 'Diagnostic Consultation Form', type: 'formConfig' },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
```

#### `documents/product.ts` — Product (Collection)

```typescript
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    { name: 'name', title: 'Product Name', type: 'string', validation: (R) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: (R) => R.required() },
    { name: 'tagline', title: 'Tagline', type: 'string' },
    { name: 'shortDescription', title: 'Short Description', type: 'text', rows: 3 },
    { name: 'longDescription', title: 'Long Description', type: 'array', of: [{ type: 'block' }, { type: 'imageWithAlt' }] },
    {
      name: 'pricing', title: 'Pricing', type: 'object',
      fields: [
        { name: 'startingPrice', title: 'Starting Price (INR)', type: 'number' },
        { name: 'mrp', title: 'MRP (INR)', type: 'number' },
        { name: 'currency', title: 'Currency Symbol', type: 'string', initialValue: '₹' },
      ],
    },
    { name: 'sizes', title: 'Available Sizes', type: 'array', of: [{ type: 'sizeOption' }] },
    {
      name: 'specifications', title: 'Specifications', type: 'object',
      fields: [
        { name: 'thickness', title: 'Thickness', type: 'string' },
        { name: 'density', title: 'Density', type: 'string' },
        { name: 'purity', title: 'Purity', type: 'string' },
        { name: 'certification', title: 'Certification', type: 'string' },
        { name: 'feel', title: 'Feel / Firmness', type: 'string', options: { list: ['Soft', 'Medium-Soft', 'Medium', 'Medium-Firm', 'Firm', 'Extra Firm'] } },
        { name: 'material', title: 'Material', type: 'string' },
        { name: 'weight', title: 'Weight (kg)', type: 'string' },
      ],
    },
    { name: 'benefits', title: 'Key Benefits', type: 'array', of: [{ type: 'string' }] },
    {
      name: 'customOptions', title: 'Custom Builder Options', type: 'object',
      fields: [
        { name: 'available', title: 'Available for Custom Build', type: 'boolean' },
        { name: 'thicknessOptions', title: 'Thickness Options', type: 'array', of: [{ type: 'string' }] },
        { name: 'firmnessOptions', title: 'Firmness Options', type: 'array', of: [{ type: 'string' }] },
      ],
    },
    {
      name: 'shippingWarranty', title: 'Shipping and Warranty', type: 'object',
      fields: [
        { name: 'deliveryTime', title: 'Delivery Time', type: 'string' },
        { name: 'freeDelivery', title: 'Free Delivery', type: 'boolean' },
        { name: 'warrantyPeriod', title: 'Warranty Period', type: 'string' },
        { name: 'trialPeriod', title: 'Trial Period', type: 'string' },
        { name: 'returnPolicy', title: 'Return Policy Text', type: 'text', rows: 3 },
      ],
    },
    { name: 'images', title: 'Product Images', type: 'array', of: [{ type: 'imageWithAlt' }], validation: (R) => R.min(1) },
    { name: 'video', title: 'Product Video URL', type: 'url' },
    { name: 'category', title: 'Category', type: 'reference', to: [{ type: 'brandCategory' }] },
    { name: 'tier', title: 'Product Tier', type: 'string', options: { list: [{ title: 'Comfort', value: 'comfort' }, { title: 'Premium', value: 'premium' }, { title: 'Luxury', value: 'luxury' }] } },
    { name: 'isBestseller', title: 'Bestseller', type: 'boolean' },
    { name: 'isNew', title: 'New Arrival', type: 'boolean' },
    { name: 'isFeatured', title: 'Featured on Homepage', type: 'boolean' },
    { name: 'inStock', title: 'In Stock', type: 'boolean', initialValue: true },
    { name: 'rating', title: 'Rating (out of 5)', type: 'number', validation: (R) => R.min(0).max(5) },
    { name: 'reviewCount', title: 'Review Count', type: 'number' },
    { name: 'relatedProducts', title: 'Related Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }], validation: (R) => R.max(4) },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
  preview: { select: { title: 'name', subtitle: 'tagline', media: 'images[0]' } },
}
```

#### `documents/showroom.ts` — Showroom (Collection)

```typescript
export default {
  name: 'showroom',
  title: 'Showroom',
  type: 'document',
  fields: [
    { name: 'name', title: 'Showroom Name', type: 'string', validation: (R) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'type', title: 'Showroom Type', type: 'string', options: { list: [{ title: 'Factory Showroom', value: 'factory' }, { title: 'Experience Center', value: 'experience' }, { title: 'Partner Store', value: 'partner' }, { title: 'Kerala Factory Outlet', value: 'outlet' }] } },
    {
      name: 'address', title: 'Address', type: 'object',
      fields: [
        { name: 'street', title: 'Street / Area', type: 'string' },
        { name: 'landmark', title: 'Landmark', type: 'string' },
        { name: 'city', title: 'City', type: 'string' },
        { name: 'state', title: 'State', type: 'string' },
        { name: 'pincode', title: 'Pincode', type: 'string' },
        { name: 'fullAddress', title: 'Full Address (for display)', type: 'text', rows: 3 },
      ],
    },
    { name: 'coordinates', title: 'Map Coordinates', type: 'object', fields: [{ name: 'lat', title: 'Latitude', type: 'number' }, { name: 'lng', title: 'Longitude', type: 'number' }] },
    {
      name: 'hours', title: 'Operating Hours', type: 'object',
      fields: [
        { name: 'monday', title: 'Monday', type: 'string' },
        { name: 'tuesday', title: 'Tuesday', type: 'string' },
        { name: 'wednesday', title: 'Wednesday', type: 'string' },
        { name: 'thursday', title: 'Thursday', type: 'string' },
        { name: 'friday', title: 'Friday', type: 'string' },
        { name: 'saturday', title: 'Saturday', type: 'string' },
        { name: 'sunday', title: 'Sunday', type: 'string' },
        { name: 'note', title: 'Hours Note', type: 'string' },
      ],
    },
    { name: 'contact', title: 'Contact Info', type: 'object', fields: [{ name: 'phoneNumbers', title: 'Phone Numbers', type: 'array', of: [{ type: 'string' }] }, { name: 'whatsapp', title: 'WhatsApp Number', type: 'string' }, { name: 'email', title: 'Email', type: 'string' }] },
    { name: 'ctaButtons', title: 'CTA Buttons', type: 'array', of: [{ type: 'ctaButton' }] },
    { name: 'image', title: 'Showroom Image', type: 'imageWithAlt' },
    { name: 'isActive', title: 'Active / Visible', type: 'boolean', initialValue: true },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
  preview: { select: { title: 'name', subtitle: 'type', media: 'image' } },
}
```

#### `documents/testimonial.ts` — Testimonial (Collection)

```typescript
export default {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    { name: 'customerName', title: 'Customer Name', type: 'string', validation: (R) => R.required() },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (R) => R.min(1).max(5) },
    { name: 'quote', title: 'Review Text', type: 'text', rows: 5 },
    { name: 'isVerified', title: 'Verified Purchase', type: 'boolean' },
    { name: 'avatar', title: 'Customer Photo', type: 'imageWithAlt' },
    { name: 'productPurchased', title: 'Product Purchased', type: 'reference', to: [{ type: 'product' }] },
    { name: 'date', title: 'Review Date', type: 'date' },
    { name: 'featured', title: 'Featured on Homepage', type: 'boolean' },
    { name: 'order', title: 'Display Order', type: 'number' },
  ],
  preview: { select: { title: 'customerName', subtitle: 'location' } },
}
```

#### `documents/faq.ts` — FAQ (Collection)

```typescript
export default {
  name: 'faq',
  title: 'FAQ / Sleep Guide',
  type: 'document',
  fields: [
    { name: 'question', title: 'Question', type: 'string', validation: (R) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'question' } },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['Durability and Cores', 'Care and Setting Up', 'Custom Sizing', 'Shipping and Delivery', 'Warranty and Returns', 'General'] } },
    { name: 'answer', title: 'Answer', type: 'array', of: [{ type: 'block' }, { type: 'imageWithAlt' }] },
    { name: 'relatedProducts', title: 'Related Products', type: 'array', of: [{ type: 'reference', to: [{ type: 'product' }] }] },
    { name: 'order', title: 'Display Order', type: 'number' },
    { name: 'published', title: 'Published', type: 'boolean', initialValue: true },
  ],
  preview: { select: { title: 'question', subtitle: 'category' } },
}
```

#### `documents/brandCategory.ts` — Category (Collection)

```typescript
export default {
  name: 'brandCategory',
  title: 'Product Category',
  type: 'document',
  fields: [
    { name: 'name', title: 'Category Name', type: 'string', validation: (R) => R.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', title: 'Description', type: 'text', rows: 3 },
    { name: 'icon', title: 'Icon', type: 'imageWithAlt' },
    { name: 'bannerImage', title: 'Banner Image', type: 'imageWithAlt' },
    { name: 'order', title: 'Display Order', type: 'number' },
    { name: 'isActive', title: 'Active', type: 'boolean', initialValue: true },
  ],
  preview: { select: { title: 'name', media: 'icon' } },
}
```

#### `documents/siteSettings.ts` — Global Settings (Singleton)

```typescript
export default {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    { name: 'branding', title: 'Branding', type: 'object', fields: [{ name: 'siteName', title: 'Site Name', type: 'string' }, { name: 'tagline', title: 'Tagline', type: 'string' }, { name: 'logo', title: 'Logo', type: 'imageWithAlt' }, { name: 'favicon', title: 'Favicon', type: 'image' }] },
    { name: 'navigation', title: 'Navigation', type: 'object', fields: [{ name: 'mainMenu', title: 'Main Menu', type: 'array', of: [{ type: 'navItem' }] }, { name: 'footerMenu', title: 'Footer Menu', type: 'array', of: [{ type: 'navItem' }] }, { name: 'ctaButton', title: 'Navbar CTA Button', type: 'ctaButton' }, { name: 'phoneNumber', title: 'Navbar Phone Number', type: 'string' }] },
    { name: 'footer', title: 'Footer', type: 'object', fields: [{ name: 'description', title: 'Footer Description', type: 'text', rows: 4 }, { name: 'socialLinks', title: 'Social Links', type: 'array', of: [{ type: 'socialLink' }] }, { name: 'certifications', title: 'Certification Badges', type: 'array', of: [{ type: 'object', fields: [{ name: 'name', title: 'Name', type: 'string' }, { name: 'image', title: 'Badge Image', type: 'imageWithAlt' }] }] }, { name: 'copyrightText', title: 'Copyright Text', type: 'string' }] },
    { name: 'contactInfo', title: 'Global Contact Info', type: 'object', fields: [{ name: 'mainPhone', title: 'Main Phone', type: 'string' }, { name: 'whatsappNumber', title: 'WhatsApp Number', type: 'string' }, { name: 'email', title: 'Email', type: 'string' }, { name: 'factoryAddress', title: 'Factory Address', type: 'text', rows: 3 }] },
    { name: 'announcement', title: 'Announcement Banner', type: 'object', fields: [{ name: 'showBanner', title: 'Show Banner', type: 'boolean' }, { name: 'bannerText', title: 'Banner Text', type: 'string' }, { name: 'bannerLink', title: 'Banner Link', type: 'string' }, { name: 'bannerColor', title: 'Banner Color', type: 'string', options: { list: ['green', 'blue', 'red', 'yellow'] } }] },
    { name: 'seo', title: 'Default SEO', type: 'pageSEO' },
    { name: 'analytics', title: 'Analytics and Tracking', type: 'object', fields: [{ name: 'gaTrackingId', title: 'Google Analytics ID', type: 'string' }, { name: 'metaPixelId', title: 'Meta Pixel ID', type: 'string' }, { name: 'gtmId', title: 'Google Tag Manager ID', type: 'string' }] },
  ],
}
```

#### `documents/about.ts` — About Page (Singleton)

```typescript
export default {
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    { name: 'hero', title: 'Hero Section', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'subtitle', title: 'Subtitle', type: 'string' }, { name: 'backgroundImage', title: 'Background Image', type: 'imageWithAlt' }] },
    { name: 'ourStory', title: 'Our Story', type: 'object', fields: [{ name: 'title', title: 'Section Title', type: 'string' }, { name: 'content', title: 'Story Content', type: 'array', of: [{ type: 'block' }, { type: 'imageWithAlt' }] }] },
    { name: 'ourProcess', title: 'Our Process', type: 'object', fields: [{ name: 'title', title: 'Section Title', type: 'string' }, { name: 'steps', title: 'Process Steps', type: 'array', of: [{ type: 'object', fields: [{ name: 'stepNumber', title: 'Step Number', type: 'number' }, { name: 'title', title: 'Step Title', type: 'string' }, { name: 'description', title: 'Description', type: 'text', rows: 3 }, { name: 'image', title: 'Step Image', type: 'imageWithAlt' }] }] }] },
    { name: 'certifications', title: 'Certifications', type: 'object', fields: [{ name: 'title', title: 'Section Title', type: 'string' }, { name: 'items', title: 'Certification Items', type: 'array', of: [{ type: 'object', fields: [{ name: 'name', title: 'Certification Name', type: 'string' }, { name: 'description', title: 'Description', type: 'text', rows: 2 }, { name: 'logo', title: 'Logo', type: 'imageWithAlt' }] }] }] },
    { name: 'values', title: 'Our Values / Mission', type: 'object', fields: [{ name: 'missionStatement', title: 'Mission Statement', type: 'text', rows: 4 }, { name: 'valueCards', title: 'Value Cards', type: 'array', of: [{ type: 'featureCard' }] }] },
    { name: 'teamSection', title: 'Team / Factory Section', type: 'object', fields: [{ name: 'title', title: 'Section Title', type: 'string' }, { name: 'content', title: 'Content', type: 'array', of: [{ type: 'block' }, { type: 'imageWithAlt' }] }] },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
```

#### `documents/contact.ts` — Contact Page (Singleton)

```typescript
export default {
  name: 'contact',
  title: 'Contact Page',
  type: 'document',
  fields: [
    { name: 'hero', title: 'Page Header', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }] },
    { name: 'contactCards', title: 'Contact Info Cards', type: 'array', of: [{ type: 'object', fields: [{ name: 'icon', title: 'Icon', type: 'string' }, { name: 'label', title: 'Label', type: 'string' }, { name: 'value', title: 'Value', type: 'string' }, { name: 'link', title: 'Link', type: 'string' }] }] },
    { name: 'showrooms', title: 'Showroom Locations', type: 'array', of: [{ type: 'reference', to: [{ type: 'showroom' }] }] },
    { name: 'bookingForm', title: 'Booking Form', type: 'formConfig' },
    { name: 'mapEmbed', title: 'Map Embed', type: 'object', fields: [{ name: 'embedUrl', title: 'Google Maps Embed URL', type: 'url' }, { name: 'title', title: 'Map Title', type: 'string' }] },
    { name: 'helpSection', title: 'Help / Support Section', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'content', title: 'Content', type: 'text', rows: 4 }, { name: 'supportHours', title: 'Support Hours', type: 'string' }] },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
```

#### `documents/productsPage.ts` — Products Listing (Singleton)

```typescript
export default {
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  fields: [
    { name: 'header', title: 'Page Header', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'subtitle', title: 'Subtitle', type: 'text', rows: 2 }] },
    { name: 'filterOptions', title: 'Filter Options', type: 'object', fields: [{ name: 'categories', title: 'Category Filters', type: 'array', of: [{ type: 'reference', to: [{ type: 'brandCategory' }] }] }, { name: 'sortOptions', title: 'Sort Options', type: 'array', of: [{ type: 'string' }] }] },
    { name: 'promoBanner', title: 'Promo Banner (optional)', type: 'object', fields: [{ name: 'show', title: 'Show Banner', type: 'boolean' }, { name: 'text', title: 'Banner Text', type: 'string' }, { name: 'image', title: 'Banner Image', type: 'imageWithAlt' }, { name: 'cta', title: 'CTA', type: 'ctaButton' }] },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
```

#### `documents/customBuilder.ts` — Custom Builder (Singleton)

```typescript
export default {
  name: 'customBuilder',
  title: 'Custom Builder Page',
  type: 'document',
  fields: [
    { name: 'header', title: 'Page Header', type: 'object', fields: [{ name: 'title', title: 'Title', type: 'string' }, { name: 'description', title: 'Description', type: 'text', rows: 3 }] },
    {
      name: 'steps', title: 'Builder Steps', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'stepNumber', title: 'Step Number', type: 'number' },
          { name: 'title', title: 'Step Title', type: 'string' },
          { name: 'description', title: 'Step Description', type: 'text', rows: 2 },
          { name: 'options', title: 'Options', type: 'array', of: [{ type: 'object', fields: [{ name: 'label', title: 'Option Label', type: 'string' }, { name: 'description', title: 'Option Description', type: 'string' }, { name: 'priceModifier', title: 'Price Modifier (INR)', type: 'number' }, { name: 'image', title: 'Option Image', type: 'imageWithAlt' }] }] },
        ],
      }],
    },
    { name: 'basePrice', title: 'Base Price (INR)', type: 'number' },
    { name: 'ctaSection', title: 'CTA Section', type: 'object', fields: [{ name: 'buttonText', title: 'Button Text', type: 'string' }, { name: 'note', title: 'Note Text', type: 'string' }] },
    { name: 'seo', title: 'SEO Settings', type: 'pageSEO' },
  ],
}
```

---

## 5. Page-by-Page Editable Content Map

### Complete Editability Checklist

| Page | Section | Editable? | Schema Field |
|------|---------|-----------|-------------|
| **Home** | Navbar logo and menu | ✅ YES | `siteSettings.navigation` |
| | Hero title/subtitle/CTAs | ✅ YES | `home.heroSection` |
| | Feature cards | ✅ YES | `home.featuresGrid` |
| | Two Ways to Own | ✅ YES | `home.ownershipWays` |
| | Shop by Brands | ✅ YES | `home.shopByBrands` |
| | Bestsellers | ✅ YES | `home.bestsellersSection` |
| | Cost Comparison | ✅ YES | `home.costComparison` |
| | Showroom CTA | ✅ YES | `home.showroomCtaBanner` |
| | Why Choose Us | ✅ YES | `home.whyChooseUs` |
| | Testimonials | ✅ YES | `home.testimonialsSection` |
| | All Showrooms | ✅ YES | `home.allShowroomsSection` |
| | FAQ Section | ✅ YES | `home.faqSection` |
| | Booking Form | ✅ YES | `home.bookingForm` |
| | Diagnostic Form | ✅ YES | `home.diagnosticForm` |
| | Footer | ✅ YES | `siteSettings.footer` |
| **Products** | Page header | ✅ YES | `productsPage.header` |
| | Filters | ✅ YES | `productsPage.filterOptions` |
| | Product cards | ✅ YES | `product` documents |
| **Product Detail** | All product info | ✅ YES | `product` document |
| | Images | ✅ YES | `product.images` |
| | Sizes and pricing | ✅ YES | `product.sizes` |
| | Specifications | ✅ YES | `product.specifications` |
| | Related products | ✅ YES | `product.relatedProducts` |
| **Custom Builder** | All steps and options | ✅ YES | `customBuilder.steps` |
| | Pricing | ✅ YES | `customBuilder.basePrice` |
| **About** | All sections | ✅ YES | `about` document |
| **Contact** | All sections | ✅ YES | `contact` document |
| **Global** | SEO defaults | ✅ YES | `siteSettings.seo` |
| | Analytics | ✅ YES | `siteSettings.analytics` |
| | Announcements | ✅ YES | `siteSettings.announcement` |

---

## 6. Data Migration Plan

### 6.1 Seed Data Files

```
seed/
├── products.json        # All mattress products
├── categories.json      # Product categories
├── showrooms.json       # All showroom locations
├── testimonials.json    # Customer reviews
├── faqs.json            # FAQ items
├── homepage.json        # Homepage content
├── about.json           # About page content
├── contact.json         # Contact page content
├── settings.json        # Site settings
└── seed.ts              # Import script
```

### 6.2 Seed Script

```typescript
// seed/seed.ts
import { createClient } from '@sanity/client'
import products from './products.json'
import categories from './categories.json'
import showrooms from './showrooms.json'
import testimonials from './testimonials.json'
import faqs from './faqs.json'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-01-01',
})

async function seed() {
  console.log('Starting seed...')

  for (const cat of categories) {
    await client.createIfNotExists({ _type: 'brandCategory', ...cat })
  }
  for (const product of products) {
    await client.createIfNotExists({ _type: 'product', ...product })
  }
  for (const showroom of showrooms) {
    await client.createIfNotExists({ _type: 'showroom', ...showroom })
  }
  for (const t of testimonials) {
    await client.createIfNotExists({ _type: 'testimonial', ...t })
  }
  for (const f of faqs) {
    await client.createIfNotExists({ _type: 'faq', ...f })
  }

  console.log('Seed complete!')
}

seed().catch(console.error)
```

### 6.3 Sample Product Seed Data

```json
[
  {
    "_id": "product-nirvana",
    "name": "Nirvana",
    "slug": { "current": "nirvana" },
    "tagline": "100% Organic",
    "shortDescription": "6 inch Kerala Latex 90 density pure 96.6% Purity GOLS certified medium-soft feel",
    "pricing": { "startingPrice": 49000, "currency": "₹" },
    "sizes": [
      { "name": "King", "dimensions": "78x72 inches", "price": 49000, "inStock": true },
      { "name": "Queen", "dimensions": "78x60 inches", "price": 44000, "inStock": true },
      { "name": "Single", "dimensions": "78x36 inches", "price": 34000, "inStock": true }
    ],
    "specifications": {
      "thickness": "6 inches",
      "density": "90 density",
      "purity": "96.6% Purity",
      "certification": "GOLS certified",
      "feel": "Medium-Soft",
      "material": "Pure Kerala Latex"
    },
    "benefits": ["Therapeutic deep sleep", "Pressure relief", "Hypoallergenic", "Eco-friendly"],
    "rating": 4.9,
    "reviewCount": 2400,
    "isBestseller": true,
    "tier": "premium",
    "inStock": true,
    "shippingWarranty": {
      "deliveryTime": "5-7 days",
      "freeDelivery": true,
      "warrantyPeriod": "10 years",
      "trialPeriod": "100 nights"
    }
  }
]
```

---

## 7. Frontend Integration Plan

### 7.1 Install Dependencies

```bash
npm install @sanity/client @sanity/image-url next-sanity
```

### 7.2 Sanity Client Setup

```typescript
// lib/sanity.ts
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

const builder = imageUrlBuilder(sanityClient)
export function urlFor(source: any) {
  return builder.image(source)
}
```

### 7.3 Data Fetching Functions

```typescript
// lib/queries.ts
import { sanityClient } from './sanity'

export async function getHomePage() {
  return sanityClient.fetch(`*[_type == "home"][0]{ heroSection, featuresGrid, ownershipWays, shopByBrands{ sectionTitle, categories[]->{ name, slug, description, icon } }, bestsellersSection{ sectionTitle, products[]->{ name, slug, tagline, pricing, rating, "imageUrl": images[0].asset->url }, viewAllCta }, costComparison, showroomCtaBanner, whyChooseUs, testimonialsSection{ sectionTitle, overallRating, totalReviews, testimonials[]->{ customerName, location, rating, quote, isVerified } }, allShowroomsSection{ sectionTitle, showrooms[]->{ name, type, address, hours, contact, image } }, faqSection{ sectionTitle, categories, faqs[]->{ question, category, answer } }, bookingForm, diagnosticForm, seo }`)
}

export async function getAllProducts() {
  return sanityClient.fetch(`*[_type == "product" && inStock == true] | order(isBestseller desc, rating desc){ name, slug, tagline, shortDescription, pricing, sizes, rating, reviewCount, isBestseller, isNew, tier, category->{ name, slug }, "imageUrl": images[0].asset->url }`)
}

export async function getProductBySlug(slug: string) {
  return sanityClient.fetch(`*[_type == "product" && slug.current == $slug][0]{ ..., category->{ name, slug }, relatedProducts[]->{ name, slug, tagline, pricing, rating, "imageUrl": images[0].asset->url } }`, { slug })
}

export async function getAllShowrooms() {
  return sanityClient.fetch(`*[_type == "showroom" && isActive == true] | order(order asc){ name, slug, type, address, coordinates, hours, contact, ctaButtons, image }`)
}

export async function getSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]{ branding, navigation, footer, contactInfo, announcement, seo, analytics }`)
}

export async function getAboutPage() {
  return sanityClient.fetch(`*[_type == "about"][0]{ ... }`)
}

export async function getContactPage() {
  return sanityClient.fetch(`*[_type == "contact"][0]{ ..., showrooms[]->{ name, type, address, hours, contact, image } }`)
}

export async function getFaqsByCategory(category: string) {
  return sanityClient.fetch(`*[_type == "faq" && category == $category && published == true] | order(order asc){ question, slug, category, answer }`, { category })
}
```

### 7.4 Next.js Page Components (App Router)

```typescript
// app/page.tsx
import { getHomePage, getSiteSettings } from '@/lib/queries'

export default async function HomePage() {
  const home = await getHomePage()
  const settings = await getSiteSettings()
  return (
    <>
      <Navbar settings={settings} />
      <HeroSection data={home.heroSection} />
      <FeaturesGrid features={home.featuresGrid} />
      <OwnershipWays data={home.ownershipWays} />
      <ShopByBrands data={home.shopByBrands} />
      <Bestsellers data={home.bestsellersSection} />
      <CostComparison data={home.costComparison} />
      <ShowroomCTA data={home.showroomCtaBanner} />
      <WhyChooseUs data={home.whyChooseUs} />
      <Testimonials data={home.testimonialsSection} />
      <AllShowrooms data={home.allShowroomsSection} />
      <FAQSection data={home.faqSection} />
      <BookingForm config={home.bookingForm} />
      <DiagnosticForm config={home.diagnosticForm} />
      <Footer settings={settings} />
    </>
  )
}

// app/products/[slug]/page.tsx
import { getProductBySlug } from '@/lib/queries'

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)
  return (
    <>
      <ProductHero product={product} />
      <SizeSelector sizes={product.sizes} />
      <Specifications specs={product.specifications} />
      <ProductDescription content={product.longDescription} />
      <RelatedProducts products={product.relatedProducts} />
    </>
  )
}
```

---

## 8. GROQ Queries Reference

| Purpose | GROQ Query |
|---------|-----------|
| All products | `*[_type == "product"]` |
| Bestsellers only | `*[_type == "product" && isBestseller == true]` |
| Products by category | `*[_type == "product" && category->slug.current == $slug]` |
| Single product | `*[_type == "product" && slug.current == $slug][0]` |
| All showrooms | `*[_type == "showroom" && isActive == true]` |
| Featured testimonials | `*[_type == "testimonial" && featured == true]` |
| FAQs by category | `*[_type == "faq" && category == $cat && published == true]` |
| Site settings | `*[_type == "siteSettings"][0]` |
| Homepage | `*[_type == "home"][0]` |
| Search products | `*[_type == "product" && name match $query]` |

---

## 9. Deployment and Environment Setup

### 9.1 Environment Variables

```env
# .env.local (Frontend)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# .env (Sanity Studio)
SANITY_PROJECT_ID=your_project_id
SANITY_TOKEN=your_write_token
```

### 9.2 Deploy Sanity Studio

```bash
cd relaxpro-sanity
sanity deploy
# Output: https://relaxpro.sanity.studio
```

### 9.3 Deploy Frontend (Vercel)

```bash
vercel --prod
```

### 9.4 Webhook for Revalidation (Next.js)

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { _type } = await req.json()
  if (_type === 'product') revalidateTag('products')
  if (_type === 'home') revalidateTag('home')
  if (_type === 'showroom') revalidateTag('showrooms')
  if (_type === 'siteSettings') revalidateTag('settings')
  return NextResponse.json({ revalidated: true })
}
```

Configure webhook in Sanity: `https://your-vercel-app.vercel.app/api/revalidate`

---

## 10. Client Training Guide

### 10.1 What the Client Can Edit

| Task | How |
|------|-----|
| Change product prices | Products → Select product → Edit pricing fields |
| Add new product | Products → "New Product" button → Fill form → Publish |
| Update homepage text | Pages → Homepage → Edit any section |
| Add showroom | Showrooms → "New Showroom" → Fill details |
| Manage testimonials | Testimonials → Add/Edit/Delete |
| Update FAQs | FAQs → Add/Edit questions and answers |
| Change navigation | Site Settings → Navigation |
| Update footer | Site Settings → Footer |
| Change logo | Site Settings → Branding → Upload new logo |
| Toggle announcement banner | Site Settings → Announcement → Show/Hide |
| Update SEO | Each page has an SEO section at the bottom |

### 10.2 Publishing Workflow

1. **Draft Mode**: All changes are saved as drafts first
2. **Preview**: Client can preview changes before publishing
3. **Publish**: Click "Publish" button to make changes live
4. **Rollback**: Sanity keeps version history for all documents

---

## 11. Timeline and Milestones

| Phase | Tasks | Duration |
|-------|-------|----------|
| **Phase 1: Setup** | Initialize Sanity project, create all schemas, deploy Studio | 2 days |
| **Phase 2: Content Entry** | Seed all products, showrooms, testimonials, FAQs, page content | 3 days |
| **Phase 3: Frontend Integration** | Connect Next.js to Sanity, build all page components | 5 days |
| **Phase 4: Dynamic Pages** | Product detail pages, category filtering, search | 3 days |
| **Phase 5: Forms and Interactivity** | Booking form, diagnostic form, custom builder | 2 days |
| **Phase 6: SEO and Performance** | Meta tags, OG images, sitemap, ISR/revalidation | 1 day |
| **Phase 7: Testing and QA** | Test all editable fields, responsive design, cross-browser | 2 days |
| **Phase 8: Deployment** | Deploy Studio + Frontend, configure webhooks, DNS | 1 day |
| **Phase 9: Client Training** | Walkthrough of Sanity Studio, documentation handoff | 1 day |
| **Total** | | **~20 days** |

---

## 12. Appendix

### 12.1 Sanity CLI Commands

```bash
sanity init          # Initialize project
sanity dev           # Start local Studio
sanity deploy        # Deploy Studio
sanity dataset export production ./backup.tar.gz   # Export data
sanity dataset import ./backup.tar.gz production   # Import data
sanity manage        # Open project settings (API tokens)
```

### 12.2 Useful Sanity Plugins

| Plugin | Purpose |
|--------|---------|
| `@sanity/vision` | Test GROQ queries in Studio |
| `@sanity/structure` | Custom desk structure |
| `@sanity/image-url` | Image URL builder |
| `sanity-plugin-media` | Better media management |
| `sanity-plugin-iframe-pane` | Live preview in Studio |
| `@portabletext/react` | Render rich text in frontend |

### 12.3 File Naming Convention

```
schemas/documents/    → One file per document type
schemas/objects/      → One file per reusable object
components/sections/  → One component per homepage section
components/products/  → Product-related components
components/layout/    → Navbar, Footer, etc.
lib/                  → Sanity client, queries, utils
```

---

> **NOTE:** This plan covers 100% of the website content. Every text, image, price, button, form field, navigation item, footer link, SEO tag, and social media link will be editable through the Sanity Studio dashboard without any code changes.

---

*Document prepared for RelaxPro CMS Migration Project*  
*Date: July 21, 2026*
