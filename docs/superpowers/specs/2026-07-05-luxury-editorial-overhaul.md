# Luxury Editorial Overhaul — Design Spec

**Date:** 2026-07-05  
**Stack:** React (Vite) + TypeScript + Tailwind v4 + Framer Motion (`motion/react`)  
**Scope:** Four discrete UI tasks on existing pages. No new routes, no new data, no backend changes.  
**Design vocabulary:** "Luxury editorial" — restraint, silence, pacing. Typography-driven, warm palette, generous whitespace, ease-out-expo motion.

---

## 0. Design tokens (pre-requisite, consumed by all four tasks)

These tokens are added to the existing `@theme` block in `src/index.css` and referenced by token name everywhere. Inline hex literals are removed from component JSX.

```css
@theme {
  /* Warm Oat — replaces pure #FFFFFF on dark backgrounds */
  --color-warm-white: #F5F2EB;

  /* Section vertical rhythm */
  --section-vertical-xs: clamp(40px, 5vw, 64px);
  --section-vertical-sm: clamp(56px, 7vw, 96px);
  --section-vertical-md: clamp(80px, 9vw, 128px);
  --section-vertical-lg: clamp(120px, 12vw, 160px);

  /* Motion easing — luxury standard */
  --ease-out-expo: cubic-bezier(0.22, 1, 0.36, 1);

  /* Luxury font scale overrides */
  --tracking-editorial: 0.18em;
  --tracking-wide: 0.10em;
}
```

**Rules enforced by spec:**
- `#FFFFFF` pure white is forbidden on `bg-primary` / `bg-neutral-dark` backgrounds. Use `text-warm-white` instead.
- `#000000` pure black is forbidden anywhere. Use `text-primary` (already `#1A3629`) or `bg-neutral-950`.
- Inline `style={{ color: '#...' }}`, `style={{ backgroundColor: '#...' }}` that reference the brand palette are converted to token class names.

---

## 1. T1 — Catalog size selector fix (`ProductList.tsx`)

### Problem
`ProductList.tsx:388` renders `{sz[0]}` inside each pill — producing "k / q / d / s" glyphs. Tightly grouped, these read as the typo "kqds". This is the single biggest credibility hit on the page.

### Fix

**Desktop (≥640px):** A segmented control with full `King | Queen | Double | Single` labels, separated by 1px hairline dividers (`border-brand-200/50`). Active state: `bg-primary text-warm-white` with subtle shadow. Inactive: `text-neutral-dark/60 hover:bg-neutral-light`.

**Mobile (<640px):** A native `<select>` styled with the brand palette, replacing the segmented control. The trigger shows the selected size label (full word, e.g., "King Size"). No single-letter rendering anywhere.

**Price line cleanup:** Remove the redundant "Up to ₹X" line beneath the starting price on each card (lines 395–406). Only the starting price for the currently selected size is shown. This removes the pricing confusion noted in the brief.

### Implementation notes
- The `cardSizes` state object and `getProductSize`/`setProductSize` helpers stay unchanged — only the rendered label changes.
- `getPriceRange(p)` helper and the `Up to` JSX can be removed after this change; no other consumer found in the file.
- Label casing: capitalized full word (`King`, not `king`).

---

## 2. T2 — Certification marquee (homepage)

### Problem
The certifications (GOLS, Oeko-Tex, etc.) appear as repeated badge clusters in:
- `routes/home/index.tsx:362-416` — the "GOLS Certified Organic" dark section
- Embedded in each `ProductList.tsx` card header (`p.warranty` badge with `Shield` icon)
- Multiple inline `<span>` blocks in home sub-components

Each repetition reads as a conversion-rate-optimization tactic rather than a brand statement. Luxury brands state credentials once, in passing.

### Fix

**New component:** `src/components/home/CertificationMarquee.tsx`

A single full-width horizontal strip, positioned after the `<Marquee />` and before `<ShopByBrands />` in `routes/home/index.tsx`.

**Visual spec:**
- Full-bleed background: `bg-secondary` (soft off-white already in palette)
- Content boxed to `rp-container`, centered
- Horizontal row of 4 items: `GOLS Certified · Oeko-Tex Standard 100 · FSC Certified · Zero VOC Emissions`
- Separators: 1px hairline, `border-brand-200/50`
- Typography: `text-[10px] font-accent uppercase tracking-editorial text-neutral-dark/60`
- Each item rendered as a `<span>` with `px-6 py-3`
- No badges, no checkmark icons, no Shields — restraint only
- On mobile: single line, smaller `text-[9px]`, items separated by `·` only (no vertical stacking)
- On mobile ≤480px: reduce to 2 items per row or wrap gracefully

**Removals from home:**
- Delete the `361-417` GOLS section in `routes/home/index.tsx` (the Leaf icon block with 4 cert tiles) — replaced by the marquee.
- Remove per-card certification badges in `ProductList.tsx` (the `Shield + warrantyY` pill in the header row, lines 271-274) — replace with a simpler "10-Yr Warranty" text label, no Shield icon.

### Implementation notes
- The marquee is a static list, not an auto-scrolling carousel. "Marquee" in the brief refers to horizontal row, not `<Marquee />` animation component.
- The home `locations` section further down the page already has its own trust context; it stays untouched.

---

## 3. T3 — Builder price reflow + motion audit (`components/builder/MattressBuilder.tsx`)

Read and apply changes to `components/builder/MattressBuilder.tsx`.

### 3a. Price reflow

**Current (problematic):** The total price is displayed prominently *before* the layer / fabric / size selection controls, breaking the psychological build-up of value.

**Fix:** The price block moves to the **bottom** of the configurator, after all selection controls. The label reads "Final Configuration Total" in `text-[10px] uppercase tracking-editorial text-neutral-dark/50`. The amount uses `text-4xl font-heading font-bold text-primary`.

Intermediate subtotals (per-layer cost) remain visible inline next to each layer option as the user adds/removes layers.

### 3b. Motion easing audit

All `motion` and hover transition calls in this file are audited:

| Before (allowed) | After (required) |
|---|---|
| `whileHover={{ scale: 1.03, y: -6 }}` with spring | `whileHover={{ scale: 1.02, y: -4 }}` with `transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}` |
| `transition={{ type: "spring", stiffness: 400 }}` | `transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}` |
| `duration: 0.4` linear-ish fades | `duration: 1.0, ease: "easeOutExpo"` (via CSS var or inline) |
| `exit={{ opacity: 0, scale: 0.95 }}` with no easing | `exit={{ opacity: 0, y: 10 }}` with `transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}` |

"Bouncy" spring animations are eliminated from this component entirely. Motion is smooth, damped, deliberate.

### 3c. Layer preview

If the current layer preview is flat colored rectangles, replace with:
- Each layer rendered as a soft-bordered card with `border-brand-200/40` and a subtle gradient fill indicating material type (warm cream for latex, deeper tone for rebonded foam).
- When a layer is added/removed/updated, AnimatePresence wraps the layer card with `layout` animation and the expo ease.
- No need for external image assets — CSS gradients suffice and keep the bundle small.

---

## 4. T4 — Science & About editorial layout

Files: `routes/pages/sleep-science.tsx`, `routes/pages/about.tsx`

### Problem
Both pages are single-column centered layouts with dense text blocks — reads like a FAQ dump.

### Fix

**Layout:**
- Desktop: asymmetric 60/40 grid — text block on the left (`lg:col-span-7`), large editorial image on the right (`lg:col-span-5`).
- Image on the right uses `aspect-[4/5]` with `object-cover` and `rounded-[1.5rem]` — portrait orientation, editorial feel.
- On mobile (`<1024px`): stacked, image above text, full bleed within `rp-container` padding.

**Typography:**
- Page heading: `rp-display` utility (already defined in `index.css`) with `text-primary`
- Body: `rp-body` utility, `leading-relaxed` or `leading-loose`, `max-w-[65ch]`
- Section dividers: `mt-24 md:mt-32` (section-vertical-md)
- Drop cap on the first paragraph of each major section — `::first-letter` pseudo-element with `font-heading text-5xl float-left mr-3 mt-1`

**Color:**
- Alternating sections: light (`bg-secondary`) and deep (`bg-primary` with `text-warm-white` body text)
- On dark sections, the paragraph color is `text-warm-white/80` — not `text-white`
- No dark-on-dark without a clear contrast ratio; all text on `bg-primary` uses `text-warm-white` or `text-warm-white/80`

**Content structure (About page example):**
```
[Left 60%]                          [Right 40%]
  "Our Story" (rp-display)
  One-line subtitle (rp-body, italic)
  ─── 1px hairline ───
  First paragraph — founding story   [portrait image]
  Second paragraph — Kerala process
  Third paragraph — philosophy
```

**Science page:** Same layout, but image subject changes to latex-tapping photography (to be sourced; placeholder image path: `/images/science/latex-tapping.jpg` — existing asset or CMS-provided).

### Implementation notes
- The `PageShell` wrapper already provides `<main>` padding and `<Helmet>` SEO. Page content changes are internal to each route file.
- No new `<section>` components needed; apply the grid pattern inline within each page's existing `<div>` structure.
- Images referenced here (`/images/science/...`) use the same `SafeImage` component already in the codebase.

---

## 5. Cross-cutting rules (all four tasks)

1. **No inline hex literals for brand colors.** If a component needs `#F5F2EB`, it uses `text-warm-white`. If it needs `#C9A87C`, it uses `text-accent`. The palette exists in `@theme`; use it.

2. **No spring animations in user-facing interactions.** Spring physics are reserved for decorative micro-animations only (e.g., confetti). All hover, scroll-reveal, and layout transitions use `easeOutExpo`.

3. **Typography token usage:**
   - Headings: `font-heading` (DM Serif Display) — already in `@theme`
   - UI labels, buttons, tracking: `font-accent` (Plus Jakarta Sans)
   - Body: default sans (inherits `font-body`)
   - Monospace data: `font-mono`

4. **Section padding standardization:**
   - After a major section boundary (`border-t` or `bg-color` change): `py-section-vertical-sm md:py-section-vertical-md`
   - Within a section: keep existing padding as-is; only section-to-section gaps are standardized.

5. **Mobile first, desktop enhanced:**
   - Default styles target mobile (no prefix)
   - `md:` and `lg:` prefixes add complexity only for larger screens
   - Test at 375px, 768px, 1440px viewports

6. **Accessibility preserved:**
   - All interactive elements retain `cursor-pointer`, focus rings (`focus:ring-accent/20`), and `aria-label` where currently present
   - Size selector (T1) on mobile uses a native `<select>` — free keyboard access, no ARIA needed
   - Color contrast: `text-warm-white` on `bg-primary` (#1A3629) meets WCAG AA (contrast ratio ~12:1)

---

## 6. Files changed (summary)

| Task | Files |
|------|-------|
| T0 (tokens) | `src/index.css` |
| T1 size selector | `src/components/product/ProductList.tsx` |
| T2 certification marquee | `src/components/home/CertificationMarquee.tsx` (new), `src/routes/home/index.tsx` |
| T3 builder | `src/components/builder/MattressBuilder.tsx` |
| T4 editorial layout | `src/routes/pages/sleep-science.tsx`, `src/routes/pages/about.tsx` |

Total: 5 files modified, 1 new component file. No data file changes. No routing changes.

---

## 7. Verification checklist

- [ ] `npm run lint` — zero new type errors
- [ ] `npm run dev` — visual diff at 375px, 768px, 1440px
- [ ] T1: catalog page shows "King / Queen / Double / Single" in full words on both mobile and desktop; no "kqds" glyphs anywhere
- [ ] T1: pricing line shows only one price per selected size; "Up to" line absent
- [ ] T2: exactly one certification strip visible on homepage; ProductList cards no longer show cert badges
- [ ] T3: builder price block is at the bottom; no spring animations in hover/interaction
- [ ] T4: science and about pages use asymmetric grid on desktop; stacked on mobile; dark sections use warm-oat text
- [ ] T0: no `style={{ color: '#...' }}` references to `#FFFFFF`, `#000000`, `#F5F2EB`, `#C9A87C`, `#1A3629` remain in the five changed files
- [ ] Lighthouse mobile accessibility score ≥ 95
