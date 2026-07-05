# RelaxPro Premium Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved Apple-clean luxury plus Linear/Vercel precision redesign while preserving existing product data, cart behavior, SEO, forms, and Google Sheets integration.

**Architecture:** Implement in safe layers: repair cart flow, add design tokens/primitives, redesign global layout, then upgrade homepage, catalog, product detail, builder, checkout, and static pages. Keep the existing Vite React Router architecture and avoid new heavy dependencies.

**Tech Stack:** Vite, React 19, React Router 7, Tailwind CSS v4, Motion (`motion/react`), Lucide React, React Helmet Async, TypeScript.

---

## Files And Responsibilities

- `src/App.tsx`: add `/cart`, store order receipt, pass receipt to success, remove unused imports.
- `src/features/cart/CartContext.tsx`: persist cart writes to `localStorage`.
- `src/index.css`: update tokens, layout utilities, reduced-motion support, responsive polish.
- `src/components/ui/Container.tsx`: reusable max-width wrapper.
- `src/components/ui/Section.tsx`: reusable responsive section wrapper.
- `src/components/ui/Button.tsx`: shared premium button variants.
- `src/components/ui/Badge.tsx`: shared trust/status badge.
- `src/components/layout/Header.tsx`: glass navigation, mobile drawer, touch targets.
- `src/components/layout/Footer.tsx`: premium footer and mobile accordion polish.
- `src/components/home/HeroSlider.tsx`: Apple-clean product hero.
- `src/routes/home/index.tsx`: homepage rhythm and product section polish.
- `src/components/product/ProductList.tsx`: mobile filters and product card hierarchy.
- `src/routes/product/product-detail.tsx`: responsive gallery, sticky buy panel, spec tiles.
- `src/components/builder/MattressBuilder.tsx`: mobile-first step flow and desktop summary clarity.
- `src/components/cart/CartPage.tsx`: responsive checkout, form states, trust copy.
- `src/features/cart/success-page.tsx`: reliable order receipt display.
- `src/routes/pages/*.tsx`: consistent editorial treatment for static pages.

## Task 1: Repair Cart Route And Success Receipt

**Files:**
- Modify: `src/App.tsx`

- [ ] Add `useState` to the React import.
- [ ] Remove unused imports: `useParams`, `HelmetProvider`, `PRODUCTS`, `CartItem`, `Product`, `MattressSize`, and `SEO`.
- [ ] Add `const [orderReceipt, setOrderReceipt] = useState<OrderReceipt | null>(null);` inside `AppContent` after `const cart = useCart();`.
- [ ] Update `onCheckoutSuccess` to set the receipt, clear cart, and navigate to `/success`.
- [ ] Add a `/cart` route before `/success` that renders `CartPage` inside `PageShell` and passes `cart.cart`, `cart.updateQty`, `cart.removeItem`, `cart.clearCart`, `onCheckoutSuccess`, and `page`.
- [ ] Change the `/success` route to pass `orderReceipt={orderReceipt}` and clear both `orderReceipt` and cart in `onReset`.
- [ ] Run `npm run lint`. Expected: TypeScript succeeds.
- [ ] Run `npm run build`. Expected: Vite build succeeds.

## Task 2: Persist Cart Writes

**Files:**
- Modify: `src/features/cart/CartContext.tsx`

- [ ] Replace `const saveCart = (next: CartItem[]) => setCart(next);` with a function that calls `setCart(next)` and `localStorage.setItem(STORAGE_KEY, JSON.stringify(next))` inside `try/catch`.
- [ ] Keep existing add, update, remove, and clear APIs unchanged.
- [ ] Manually verify adding an item, refreshing, and opening `/cart` keeps the item.
- [ ] Run `npm run lint`. Expected: TypeScript succeeds.

## Task 3: Add Design Tokens And Layout Utilities

**Files:**
- Modify: `src/index.css`

- [ ] Update brand palette tokens to the approved cooler premium palette: deep graphite/forest, silver mist, controlled champagne accent, restrained green success.
- [ ] Add `.rp-container`, `.rp-section`, `.rp-display`, `.rp-heading`, and `.rp-body` utilities in the base layer.
- [ ] Add reduced-motion CSS that disables long animations and transitions under `prefers-reduced-motion: reduce`.
- [ ] Preserve existing utility names used by current components so the site does not visually break mid-migration.
- [ ] Run `npm run lint`. Expected: TypeScript succeeds.

## Task 4: Add UI Primitives

**Files:**
- Create: `src/components/ui/Container.tsx`
- Create: `src/components/ui/Section.tsx`
- Create: `src/components/ui/Button.tsx`
- Create: `src/components/ui/Badge.tsx`

- [ ] Create `Container` as a typed `div` wrapper using `rp-container` and optional `className`.
- [ ] Create `Section` as a typed `section` wrapper using `rp-section` with `default`, `muted`, and `dark` tones.
- [ ] Create `Button` with `primary`, `secondary`, `outline`, and `ghost` variants, `min-h-11`, one-line label support, focus visibility, and active press feedback.
- [ ] Create `Badge` for small trust/status labels with consistent radius, border, and uppercase tracking.
- [ ] Run `npm run lint`. Expected: TypeScript succeeds.

## Task 5: Redesign Header And Footer

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`

- [ ] Keep header route data, cart count, mobile state, route-close behavior, and body scroll lock.
- [ ] Convert header shell to restrained translucent glass with controlled height and stronger active states.
- [ ] Replace emoji banner copy with text-only phone/location copy.
- [ ] Ensure mobile cart and menu buttons are at least `44px` by `44px`.
- [ ] Keep footer links and social URLs, but refine dark surface, spacing, and bottom link group.
- [ ] Verify desktop nav remains one line at `1024px`.
- [ ] Verify mobile drawer opens, closes, locks body scroll, and has large touch targets.
- [ ] Run `npm run lint` and `npm run build`. Expected: both succeed.

## Task 6: Redesign Homepage Hero And Rhythm

**Files:**
- Modify: `src/components/home/HeroSlider.tsx`
- Modify: `src/routes/home/index.tsx`

- [ ] Replace the current dark hero with a light premium product hero using one headline, short subcopy, two CTAs, trust metrics, and a product image linking to `nirvana`.
- [ ] Remove the third hero CTA and keep WhatsApp intent in FAB/contact areas.
- [ ] Use mobile-first stacking and verify 320px/375px without horizontal scroll.
- [ ] Apply `rp-section` and `rp-container` to the bestselling product section.
- [ ] Preserve existing homepage section order unless a section is proven broken.
- [ ] Run `npm run lint` and `npm run build`. Expected: both succeed.

## Task 7: Upgrade Catalog And Product Cards

**Files:**
- Modify: `src/components/product/ProductList.tsx`

- [ ] Preserve search, tier, comfort, latex, and sorting state logic.
- [ ] Make filters collapse or wrap cleanly on mobile.
- [ ] Redesign product cards with clearer image, model, comfort, key specs, price, and CTA hierarchy.
- [ ] Ensure card CTAs remain bottom-aligned and do not wrap on desktop.
- [ ] Verify buy-now navigates to `/cart` after Task 1.
- [ ] Run `npm run lint` and `npm run build`. Expected: both succeed.

## Task 8: Upgrade Product Detail

**Files:**
- Modify: `src/routes/product/product-detail.tsx`

- [ ] Preserve slug lookup, pricing logic, accessory logic, fabric logic, add-to-cart, and WhatsApp behavior.
- [ ] Make mobile order: gallery, product summary, purchase controls, specs.
- [ ] Keep desktop sticky purchase panel but improve spacing and touch targets.
- [ ] Convert dense spec areas into grouped tiles where practical.
- [ ] Verify all product slugs still render and unknown slug shows not found state.
- [ ] Run `npm run lint` and `npm run build`. Expected: both succeed.

## Task 9: Upgrade Builder

**Files:**
- Modify: `src/components/builder/MattressBuilder.tsx`

- [ ] Preserve all layer, size, fabric, accessory, and price calculations.
- [ ] Improve mobile accordion/wizard behavior so one active step is readable at a time.
- [ ] Improve desktop two-column layout with clearer live summary and price breakdown.
- [ ] Keep `handleAddToCart`, `handleBuyNow`, and WhatsApp enquiry behavior intact.
- [ ] Run `npm run lint` and `npm run build`. Expected: both succeed.

## Task 10: Upgrade Cart And Success Flow

**Files:**
- Modify: `src/components/cart/CartPage.tsx`
- Modify: `src/features/cart/success-page.tsx`

- [ ] Preserve form fields, validation, total calculation, and `submitLead` payload shape.
- [ ] Make cart layout single-column on mobile and two-column on desktop.
- [ ] Improve empty cart state with premium CTA back to catalog.
- [ ] Improve form labels, error spacing, loading state, and trust copy.
- [ ] Ensure `SuccessPage` shows receipt when present and gives a clear fallback when absent.
- [ ] Run `npm run lint` and `npm run build`. Expected: both succeed.

## Task 11: Static Page Consistency Pass

**Files:**
- Modify: `src/routes/pages/about.tsx`
- Modify: `src/routes/pages/contact.tsx`
- Modify: `src/routes/pages/locations.tsx`
- Modify: `src/routes/pages/sleep-science.tsx`
- Modify: `src/routes/pages/not-found.tsx`

- [ ] Apply shared container and section rhythm.
- [ ] Keep all business contact/location content intact.
- [ ] Ensure each page has one clear H1 and usable mobile spacing.
- [ ] Improve 404 with clear return-to-home and catalog actions.
- [ ] Run `npm run lint` and `npm run build`. Expected: both succeed.

## Task 12: Final Responsive, Accessibility, And Performance QA

**Files:**
- Inspect all changed files.

- [ ] Run `npm run lint`. Expected: TypeScript succeeds.
- [ ] Run `npm run build`. Expected: Vite build succeeds.
- [ ] Start `npm run dev` and inspect `/`, `/catalog`, `/builder`, `/cart`, `/compare`, `/contact`, and one `/mattresses/:slug` route.
- [ ] Verify no horizontal scroll at 320px, 375px, 768px, 1024px, and desktop width.
- [ ] Verify cart add, refresh persistence, quantity update, remove, clear, checkout submit path, and success receipt.
- [ ] Verify visible focus states on header links, buttons, drawer controls, filters, and form fields.
- [ ] Verify image alt text remains descriptive on product and hero imagery.
- [ ] Verify reduced-motion mode does not leave content hidden.

## Plan Self-Review

- Spec coverage: cart repair, design tokens, responsive foundation, global layout, homepage, catalog, product detail, builder, checkout, static pages, accessibility, and performance are all covered.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation steps remain.
- Type consistency: file names and existing API names match the inspected codebase.
