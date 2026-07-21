# Luxury Editorial Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Goal:** Apply luxury-editorial design system (warm-oat text, ease-out-expo motion, no single-letter glyphs, consolidated certs, price-last psychology) to four existing pages and one design-token prerequisite.
>
> **Architecture:** Each task is an independent file change. No new routes, no new data, no backend changes. T0 (token layer) unlocks T1–T4. Tasks T1–T4 can be implemented in any order once T0 is in place.
>
> **Tech Stack:** React 19 + TypeScript + Tailwind v4 + Framer Motion (`motion/react`)

---

## Task 0: Design tokens (prerequisite)

**Files:**
- Modify: `src/index.css:1-52` (the `@theme` block at the top)

- [ ] **Step 1:** Open `src/index.css` and locate the existing `@theme` block.

- [ ] **Step 2:** Add the new design tokens inside the `@theme` block. Append after the existing `--spacing-32` line:

```css
/* Warm Oat — replaces pure #FFFFFF on dark backgrounds */
--color-warm-white: #F5F2EB;

/* Section vertical rhythm */
--section-vertical-xs: clamp(40px, 5vw, 64px);
--section-vertical-sm: clamp(56px, 7vw, 96px);
--section-vertical-md: clamp(80px, 9vw, 128px);
--section-vertical-lg: clamp(120px, 12vw, 160px);

/* Motion easing — luxury standard */
--ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);

/* Luxury font tracking */
--tracking-editorial: 0.18em;
--tracking-wide: 0.10em;
```

- [ ] **Step 3:** Verify no token name collides with an existing Tailwind v4 utility. Run `npm run lint` and confirm zero type errors.

- [ ] **Step 4:** Commit

```bash
git add src/index.css
git commit -m "chore: add luxury editorial design tokens to @theme"
```

---

## Task 1: Catalog size selector fix

**Files:**
- Modify: `src/components/product/ProductList.tsx`
- Lines replaced: ~365–410 (size selector block), ~395–406 (price block)

- [ ] **Step 1 — Remove the "kqds" glyph renderer:** locate the size button map at line ~374–391:

```tsx
{(['king', 'queen', 'double', 'single'] as MattressSize[]).map((sz) => (
  <button key={sz} ...>
    {sz[0]}  {/* ← REMOVE THIS */}
  </button>
))}
```

Replace the inner text with a constant map:

```tsx
const SIZE_SHORT_LABELS: Record<MattressSize, string> = {
  king: 'K',
  queen: 'Q',
  double: 'D',
  single: 'S',
};
```

However, per spec we abandon single-letter entirely — remove the entire inline segmented control and replace with:

```tsx
{/* Desktop segmented control (≥640px) */}
<div className="hidden sm:flex bg-neutral-light/50 p-1 rounded-lg border border-brand-200/40">
  {(['king', 'queen', 'double', 'single'] as MattressSize[]).map((sz) => (
    <button
      key={sz}
      type="button"
      onClick={(e) => { e.stopPropagation(); setProductSize(p.slug, sz); }}
      className={`flex-1 px-3 py-2 rounded-md text-[11px] font-accent font-bold uppercase tracking-wider transition-all cursor-pointer ${
        activeSize === sz
          ? 'bg-primary text-warm-white shadow-sm'
          : 'text-neutral-dark/60 hover:text-primary hover:bg-white'
      }`}
    >
      {sz === 'king' ? 'King' : sz === 'queen' ? 'Queen' : sz === 'double' ? 'Double' : 'Single'}
    </button>
  ))}
</div>

{/* Mobile select (<640px) */}
<div className="sm:hidden">
  <select
    value={activeSize}
    onChange={(e) => { e.stopPropagation(); setProductSize(p.slug, e.target.value as MattressSize); }}
    className="w-full bg-white border border-brand-200/60 text-xs font-accent font-bold text-primary px-3 py-2.5 rounded-lg cursor-pointer outline-none appearance-none"
    style={{
      backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231A3629' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 10px center',
      paddingRight: '32px',
    }}
  >
    <option value="king">King Size (72"×78")</option>
    <option value="queen">Queen Size (60"×78")</option>
    <option value="double">Double Size (48"×75")</option>
    <option value="single">Single Size (36"×75")</option>
  </select>
</div>
```

- [ ] **Step 2 — Remove the `getPriceRange` helper and "Up to" line**: Delete the `getPriceRange` function (lines ~58–69). Remove the "Up to" block in the price indicator:

```tsx
{/* REMOVE this entire span block */}
<span className="hidden sm:block text-[8px] sm:text-[10px] text-neutral-dark/50 font-mono mt-0.5">
  <PriceText>Up to ₹{getPriceRange(p).max.toLocaleString('en-IN')}</PriceText>
</span>
```

The surrounding `<div className="flex flex-row justify-between items-center p-1.5 sm:p-4 ...">` now contains only the starting-price column and is the sole price display.

- [ ] **Step 3 — Verify `getPriceRange` has no other callers:** grep the file for `getPriceRange`. Only the removed call site should exist. If any other site, update it or leave a TODO comment.

- [ ] **Step 4 — Run typecheck:**

```bash
cd "C:\Users\ramak\Downloads\remix_-relaxpro-premium-mattresses-main\relaxpro-premium-mattresses-main"
npm run lint
```

Expected: zero type errors.

- [ ] **Step 5 — Manual check:** `npm run dev`, navigate to `/catalog`, confirm:
  - Desktop: four full-word pills (King | Queen | Double | Single) visible
  - Mobile (DevTools responsive mode ≤639px): a native `<select>` with four options
  - No single-letter glyphs anywhere on the size selector

- [ ] **Step 6 — Commit:**

```bash
git add src/components/product/ProductList.tsx
git commit -m "fix: replace kqds glyphs with full-word size selector; remove redundant Up-to price line"
```

---

## Task 2: Certification marquee component

**Files:**
- Create: `src/components/home/CertificationMarquee.tsx`
- Modify: `src/routes/home/index.tsx` (insert after `<Marquee />`, delete GOLS block ~lines 351–417)

- [ ] **Step 1 — Create `src/components/home/CertificationMarquee.tsx`:**

```tsx
import React from 'react';

const ITEMS = [
  'GOLS Certified',
  'Oeko-Tex Standard 100',
  'FSC Certified',
  'Zero VOC Emissions',
];

export default function CertificationMarquee() {
  return (
    <section className="bg-secondary border-y border-brand-200/30">
      <div className="rp-container">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 md:py-6">
          {ITEMS.map((item, i) => (
            <React.Fragment key={item}>
              {i > 0 && (
                <span className="hidden md:inline-block w-px h-3 bg-brand-200/60" aria-hidden="true" />
              )}
              <span className="text-[9px] md:text-[10px] font-accent font-semibold uppercase tracking-editorial text-neutral-dark/60 select-none">
                {item}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2 — Insert into `routes/home/index.tsx`:** after the `<Marquee />` line (currently line ~134) and before `<ShopByBrands />`:

```tsx
import CertificationMarquee from '../../components/home/CertificationMarquee';
```

Then after `<Marquee />`:
```tsx
<CertificationMarquee />
```

- [ ] **Step 3 — Remove the GOLS cert block** from `routes/home/index.tsx` (lines ~351–417, the section with Leaf icon, four cert tiles inside `bg-[#141C1A]`, and `GOLS Certified Organic` label):

```tsx
{/* REMOVE lines 350 through approximately 417 — the entire section:
     <section className="rp-section" style={{ background: '#141C1A', color: '#FFFFFF' }}>
       ...Leaf icon, cert tiles...
     </section>
   The CertificationMarquee component replaces this entirely.
*/}
```

Note: The section's `style={{ background: '#141C1A' }}` is an inline hex literal — removing it is part of the design-token cleanup tied to T2 (no inline palette colors).

- [ ] **Step 4 — Remove Shield+year badges from `ProductList.tsx`** — locate lines ~270–274:

```tsx
{/* REMOVE */}
<span className="hidden sm:block text-[9px] sm:text-[10px] ...">
  <Shield className="w-2 h-2 ..." /> {p.warranty}Y
</span>
```

Replace with:
```tsx
<span className="hidden sm:block text-[9px] sm:text-[10px] font-mono text-neutral-dark/50 uppercase tracking-widest">
  {p.warranty}-Year
</span>
```

Also remove `Shield` from the import at line 4 if it's no longer used elsewhere in that file (check the import line — `Shield` appears only in this badge).

- [ ] **Step 5 — Typecheck + dev check:**

```bash
npm run lint
```

```bash
npm run dev
```

Confirm: one horizontal cert strip on homepage between Marquee and ShopByBrands. Only one cert strip anywhere on the home page (the GOLS block is gone).

- [ ] **Step 6 — Commit:**

```bash
git add src/components/home/CertificationMarquee.tsx src/routes/home/index.tsx src/components/product/ProductList.tsx
git commit -m "feat: add single certification marquee; remove duplicate cert badges"
```

---

## Task 3: Builder price reflow + motion audit

**Files:**
- Modify: `src/components/builder/MattressBuilder.tsx` (full file, ~751 lines)

- [ ] **Step 1 — Identify price block location:** Lines 316–396 in the left sticky column (`lg:col-span-5`). This block includes:
  - Line 317–343: individual price breakdown rows (foundation, transition, topper, cover, accessories)
  - Line 347–361: total + size + delivery
  - Line 363–366: warranty badge
  - Line 368–395: CTA buttons (Add to Cart, Buy Now, WhatsApp)

The spec moves this block *out* of the left column and places it at the *bottom* of the right column, after all step accordion sections (after line ~737, inside `<div className="lg:col-span-7 order-2 space-y-3">` but *outside* the `STEPS_CONFIG.map`).

- [ ] **Step 2 — Extract price+CTA into a sub-component in the same file.** Add directly above the default export:

```tsx
interface BuilderTotalProps {
  priceBreakdown: { base: number; trans: number; top: number; fabric: number; acc: number; total: number };
  size: MattressSize;
  includeAccessories: boolean;
  selectedFabric: { name: string };
  onAddToCart: () => void;
  onBuyNow: () => void;
  onWhatsApp: () => void;
  addedToCart: boolean;
}

function BuilderTotal({
  priceBreakdown: pb,
  size,
  includeAccessories,
  selectedFabric,
  onAddToCart,
  onBuyNow,
  onWhatsApp,
  addedToCart,
}: BuilderTotalProps) {
  return (
    <div className="mt-8 bg-white rounded-2xl border border-gray-100/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] p-5 md:p-7">
      {/* Itemized breakdown */}
      <div className="space-y-2 mb-5 pb-5 border-b border-gray-100">
        {[
          { label: 'Foundation', value: pb.base },
          pb.trans > 0 && { label: 'Transition', value: pb.trans },
          pb.top > 0 && { label: 'Comfort Topper', value: pb.top },
          { label: 'Cover', value: pb.fabric },
          includeAccessories && { label: 'Accessories Bundle', value: pb.acc },
        ]
          .filter(Boolean)
          .map((row: any) => (
            <div key={row.label} className="flex items-center justify-between text-xs text-neutral-dark/70">
              <span>{row.label}</span>
              <span className="font-semibold text-primary"><PriceText>₹{row.value.toLocaleString('en-IN')}</PriceText></span>
            </div>
          ))}
      </div>

      {/* Total */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <span className="text-[10px] font-semibold text-neutral-dark/60 uppercase tracking-editorial block mb-1">
            Final Configuration Total
          </span>
          <span className="text-4xl font-heading font-bold text-primary tracking-tight">
            <PriceText>₹{pb.total.toLocaleString('en-IN')}</PriceText>
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-neutral-dark/50 capitalize">{size}</span>
          <span className="text-[10px] text-green-600 font-medium flex items-center gap-1 mt-0.5">
            <Truck className="w-3 h-3" /> Free Delivery
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-5 bg-blue-50/50 rounded-xl px-4 py-2.5 border border-blue-100/50">
        <Shield className="w-4 h-4 text-accent shrink-0" />
        <span className="text-[11px] text-blue-900/70 leading-relaxed">10-year warranty · 100-night trial · Certified materials</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            onClick={onAddToCart}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary hover:bg-neutral-dark text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{addedToCart ? 'Added!' : 'Add to Cart'}</span>
          </motion.button>
          <motion.button
            onClick={onBuyNow}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-accent hover:bg-accent-dark text-white py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Buy Now</span>
          </motion.button>
        </div>
        <button
          onClick={onWhatsApp}
          className="w-full py-3 px-4 rounded-xl border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs tracking-wide transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Enquire on WhatsApp — ₹{pb.total.toLocaleString('en-IN')}</span>
        </button>
      </div>
    </div>
  );
}
```

> Note: The `whileHover={{ scale: 1.01 }}` on the CTA buttons in this sub-component uses `duration-200` CSS transition as a fallback. The Framer Motion `whileHover` here is mild (1% scale) and is kept because it's on the final purchase action, not a content card — this matches the brief ("spring reserved for decorative micro-animations only") because CTA buttons are interactive controls, not content reveals. Brief allows this exception; if strict, change to no `whileHover` and use CSS hover only.

- [ ] **Step 3 — Remove price block from left column:** In the left column JSX (lines 247–398 of the original), keep only the artboard (`div className="relative bg-[#0F1A2E]..."`, lines 265–314). Delete everything from line 317 (`{/* Price Breakdown */}`) through line 398 (closing `</div>` of the price card). The left column now ends after the fabric indicator.

- [ ] **Step 4 — Insert `<BuilderTotal />` at bottom of right column:** After the `<AnimatePresence>` close + step map `)` at line ~738–739, and before the footer note (line 742), render:

```tsx
<BuilderTotal
  priceBreakdown={priceBreakdown}
  size={size}
  includeAccessories={includeAccessories}
  selectedFabric={selectedFabric}
  onAddToCart={handleAddToCart}
  onBuyNow={handleBuyNow}
  onWhatsApp={handleWhatsAppEnquire}
  addedToCart={addedToCart}
/>
```

- [ ] **Step 5 — Remove `whileHover={{ scale: 1.01 }}` from all configurator option buttons** (Steps 2–6 in the right column). Each option card (`BASE_LAYERS.map`, `TRANSITION_LAYERS.map`, `COMFORT_TOPPER_LAYERS.map`, `FABRICS.map`, accessories toggle) has `whileHover={{ scale: 1.005 }}`. Replace with no `whileHover` prop; keep the CSS `hover:border-gray-200 hover:shadow-sm` transitions, which are sufficient for a "selected state changes color, not position" luxury feel.

Specifically remove `whileHover` from the following button blocks:
- Line ~500 (base layer buttons)
- Line ~547 (transition buttons)
- Line ~601 (topper buttons)
- Line ~655 (fabric buttons)
- Line ~699 (accessories toggle)

Keep `whileTap={{ scale: 0.98 }}` on press for haptic feedback.

- [ ] **Step 6 — Update accordion open/close transition:** Line ~446:

```tsx
{/* Before */}
transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}

{/* After */}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
```

- [ ] **Step 7 — Update layer-stack AnimatePresence transitions:** Lines 281–284:

```tsx
{/* Before */}
initial={{ opacity: 0, scaleY: 0.3, y: 12 }}
animate={{ opacity: 1, scaleY: 1, y: 0 }}
exit={{ opacity: 0, scaleY: 0.3, y: -12 }}
transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}

{/* After */}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
```

(Remove `scaleY` entirely — it's an artifact of the Accordion-style animation; vertical stacking of flat cards with fade+slide is more editorial.)

- [ ] **Step 8 — Update fabric indicator AnimatePresence** (lines 307–309):

```tsx
{/* Before */}
initial={{ opacity: 0, y: 6 }}
animate={{ opacity: 1, y: 0 }}
// no explicit transition

{/* After */}
initial={{ opacity: 0, y: 8 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
```

- [ ] **Step 9 — Typecheck + dev check:**

```bash
npm run lint
```

```bash
npm run dev
```

Confirm: `/builder` loads, all 6 step accordions expand/collapse, price is no longer visible in the left "Your Build" artboard panel, price appears at the bottom of the right column after expanding steps. Select different options; price updates correctly.

- [ ] **Step 10 — Commit:**

```bash
git add src/components/builder/MattressBuilder.tsx
git commit -m "refactor(builder): move price to configurator bottom; replace spring animations with easeOutExpo"
```

---

## Task 4: Science & About editorial layout

**Files:**
- Modify: `src/routes/pages/sleep-science.tsx`
- Modify: `src/routes/pages/about.tsx`

- [ ] **Step 1 — Read both route files** to understand current heading structure and paragraph count:

```bash
# Already read during investigation; confirm current structure hasn't drifted
```

`sleep-science.tsx` heading: likely "Sleep Science" or similar. `about.tsx` heading: similar.

- [ ] **Step 2 — Create the editorial-section pattern** — this spec defines a reusable section shape. Apply it directly inline (no new component needed, per spec):

Left column (text): `lg:col-span-7 space-y-8`
Right column (image): `lg:col-span-5` with `sticky top-32`

Apply to both files:

**For the first major section of each page:**

```tsx
<div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start py-16 md:py-24">
  {/* Left: text */}
  <div className="lg:col-span-7 space-y-6">
    <span className="inline-flex items-center text-[10px] font-accent font-bold uppercase tracking-editorial text-accent bg-accent/10 px-4 py-1.5 rounded-full">
      {/* Section label, e.g. "Our Story" or "The Science" */}
    </span>
    <h2 className="rp-display text-primary">
      {/* Page heading */}
    </h2>
    <p className="rp-body text-neutral-dark/80 leading-loose">
      {/* First paragraph (short, punchy) */}
    </p>
    <div className="w-16 h-px bg-brand-200" aria-hidden="true" />
    <div className="space-y-4">
      <p className="rp-body text-neutral-dark/70 leading-loose">
        {/* Body paragraphs */}
      </p>
    </div>
  </div>

  {/* Right: image */}
  <div className="lg:col-span-5">
    <div className="sticky top-32">
      <img
        src="/images/science/latex-tapping.jpg"  /* or relevant path */
        alt="..."
        className="w-full aspect-[4/5] object-cover rounded-[1.5rem] shadow-sm"
        loading="lazy"
      />
    </div>
  </div>
</div>
```

For **subsequent sections** (if the page has more than one major section), flip the image position:
- Section 2: image LEFT, text RIGHT — `lg:col-span-5 order-1` (image) + `lg:col-span-7 order-2` (text)
- Section 3: text LEFT, image RIGHT (same as section 1)

- [ ] **Step 3 — Apply to `routes/pages/about.tsx`:**
  - Section 1 (founder story): text left, image right — use `/images/components-banner.png` or any existing image asset in `public/images/`
  - Section 2 (Kerala process): image left, text right — use a different existing image
  - Section 3 (philosophy): text left, no image required (centered text block, same `max-w-3xl mx-auto` pattern)

  Confirm the type `text-warm-white` (not `text-white`) is used on any dark background.

- [ ] **Step 4 — Apply to `routes/pages/sleep-science.tsx`:**
  - Section 1 (latex science intro): text left, image right — placeholder `/images/science/latex-tapping.jpg` (use `SafeImage` component or a plain `<img>` with `onError` fallback to a neutral gradient div if image is missing)
  - Section 2 (zone comfort): image left (use an existing assets like `/images/products/nirvana.webp` or similar), text right
  - Section 3 (FAQ or call to CTA): full-width text block, no image, centered

- [ ] **Step 5 — Add `::first-letter` drop-cap** — in `index.css`, add to the `@layer base` section:

```css
@layer base {
  /* ...existing rules... */

  .drop-cap::first-letter {
    float: left;
    font-family: var(--font-heading);
    font-size: 4rem;
    line-height: 0.8;
    padding-right: 0.75rem;
    padding-top: 0.25rem;
    color: var(--color-primary);
    font-weight: 400;
  }
}
```

Apply `drop-cap` class to the first `<p>` of each major editorial section in both files.

- [ ] **Step 6 — Dark-section color check:** For any section with a dark background (e.g., `bg-primary`), verify all paragraph text uses `text-warm-white` or `text-warm-white/80` — not `text-white`, not `text-neutral-light`. Do a grep in each file:

```bash
grep -n "text-white" src/routes/pages/sleep-science.tsx src/routes/pages/about.tsx
```

Any false positive (text-white on non-dark bg) should be corrected.

- [ ] **Step 7 — Typecheck + dev check:**

```bash
npm run lint
```

```bash
npm run dev
```

- Confirm `/about` and `/science` use asymmetric grid on desktop (≥1024px).
- Confirm mobile: images on top, text below, within container padding.
- Confirm dark sections (bg-primary): body text is warm-white.
- Confirm drop cap appears on first paragraph of each major section.

- [ ] **Step 8 — Commit:**

```bash
git add src/routes/pages/sleep-science.tsx src/routes/pages/about.tsx src/index.css
git commit -m "feat(science,about): editorial asymmetric grid layout with warm-oat typography"
```

---

## Cross-cutting final checks (after all four tasks)

```bash
npm run lint
```

- Grep for banned inline hex literals in modified files only:

```bash
grep -n "style=.*#\(FFFFFF\|000000\|F5F2EB\|C9A87C\|1A3629\)" \
  src/components/product/ProductList.tsx \
  src/components/home/CertificationMarquee.tsx \
  src/components/builder/MattressBuilder.tsx \
  src/routes/pages/sleep-science.tsx \
  src/routes/pages/about.tsx \
  src/routes/home/index.tsx
```

Any hits must be converted to token class names.

- Visual check of all four pages at 375px, 768px, 1440px.

---

## Summary

| Task | File(s) | Commit |
|------|---------|--------|
| T0 tokens | `src/index.css` | `chore: add luxury editorial design tokens to @theme` |
| T1 size selector | `src/components/product/ProductList.tsx` | `fix: replace kqds glyphs with full-word size selector` |
| T2 cert marquee | `src/components/home/CertificationMarquee.tsx` (new), `src/routes/home/index.tsx`, `src/components/product/ProductList.tsx` | `feat: add single certification marquee; remove duplicate cert badges` |
| T3 builder | `src/components/builder/MattressBuilder.tsx` | `refactor(builder): move price to configurator bottom; replace spring animations` |
| T4 editorial | `src/routes/pages/sleep-science.tsx`, `src/routes/pages/about.tsx` | `feat(science,about): editorial asymmetric grid layout` |
| Cross-cutting | all modified files | (inline in each task) |

Total: 5 files modified, 1 new component file, 5 commits (one per task + verification).
