# RelaxPro Premium Redesign Design Spec

Date: 2026-07-04

## Goal

Transform the current RelaxPro mattress website into a premium ecommerce experience that combines Apple-clean product luxury with Linear/Vercel-style precision. The redesign must preserve existing functionality, routes, SEO behavior, product data, forms, Google Sheets submission, and business logic while improving visual quality, responsiveness, accessibility, and performance.

## Approved Direction

The approved direction is a hybrid system:

- Apple-clean luxury for the brand impression, homepage, hero, product imagery, whitespace, and calm confidence.
- Linear/Vercel precision for catalog discovery, product specs, comparison, builder controls, cart, forms, and technical trust.
- Mobile responsiveness is implemented with every component change, not as a later cleanup pass.

The site should feel premium and clear, not decorative. Motion should communicate hierarchy, feedback, and transitions. It should not become a heavy animation showcase.

## Current Codebase Constraints

The project is a Vite React app using React 19, React Router, Tailwind CSS v4, Motion, Lucide icons, and `react-helmet-async`.

Important existing files:

- `src/App.tsx` owns routes and layout composition.
- `src/index.css` contains the current Tailwind v4 theme and global styles.
- `src/data/products.ts` contains product catalog data.
- `src/types.ts` contains product, cart, lead, and order types.
- `src/features/cart/CartContext.tsx` owns cart state.
- `src/components/cart/CartPage.tsx` contains checkout form and Google Sheets submission.
- `src/utils/googleSheets.ts` handles Google Apps Script submission.
- `src/components/layout/Header.tsx` and `Footer.tsx` own global navigation and footer.
- `src/components/layout/PageShell.tsx` and `src/components/seo/SEO.tsx` own page metadata.

The implementation must work with the current stack. No framework migration is planned.

## Functional Fixes Included

The redesign includes these required UX fixes because the buying flow is currently incomplete:

- Add a `/cart` route in `src/App.tsx`.
- Render `CartPage` through the router.
- Persist cart changes to `localStorage`, not only read from it.
- Preserve order receipt after checkout so `/success` can display the submitted order.
- Remove the duplicate `HelmetProvider` wrapper.
- Keep Google Sheets submission intact.
- Keep existing product pricing and builder logic unchanged.

These fixes are in scope because they protect the redesigned ecommerce flow. They should be implemented minimally and should not change business rules.

## Visual System

The redesigned visual system should move away from a fully warm beige craft look and toward a cooler premium surface language.

Core palette:

- Background: soft white and silver mist.
- Main text: deep graphite or forest-black.
- Accent: controlled RelaxPro green or champagne, used sparingly for action and trust.
- Surfaces: translucent white, soft silver, and subtle inner borders.
- Product/spec areas: cleaner, sharper, and more technical.

Typography:

- Use a modern sans as the primary voice for precision and readability.
- Keep the current serif only in limited brand moments where warmth helps.
- Use tabular or mono treatment for prices, dimensions, ratings, and specs.
- Use responsive type with `clamp()` for major headings.
- Avoid arbitrary one-off font sizes across components.

Shape and depth:

- Buttons: consistent pill or soft radius treatment with clear touch size.
- Cards: softer premium radii, not generic border-and-shadow boxes everywhere.
- Images: larger radius than cards where appropriate.
- Shadows: soft, tinted, and restrained.
- Surfaces: use subtle nested shells for key premium cards, especially product and builder summary cards.

## Reusable Components

The redesign should introduce or standardize these reusable patterns:

- `Container`: shared max width, responsive horizontal padding, centered layout.
- `Section`: shared vertical spacing and optional tone.
- `Button`: primary, secondary, outline, ghost, icon-capable, disabled/loading-ready.
- `Card`: base premium surface with consistent radius and interaction states.
- `Badge`: trust, product tier, status, and spec badges.
- `Input`: label, helper text, error text, focus state, and mobile-safe sizing.
- `Accordion`: accessible disclosure pattern for FAQ and mobile footer sections.
- `ProductCard`: catalog and homepage product card with image, price, specs, and CTAs.
- `SpecTile`: product detail and comparison spec display.
- `TrustMetric`: concise rating, warranty, delivery, and customer proof.
- `CTASection`: premium conversion block used across major pages.

Components should be extracted as needed during page work. The goal is not to create a large library before visible progress.

## Responsive Foundation

Every redesigned component must define its mobile behavior at the time it is built.

Breakpoints to verify:

- 320px
- 375px
- 425px
- 640px
- 768px
- 1024px
- 1280px
- 1440px+

Rules:

- No horizontal scrolling at 320px.
- Touch targets must be at least 44px where interactive.
- Multi-column layouts collapse below 768px unless a specific mobile pattern is designed.
- Product cards are single-column or readable two-column only where space permits.
- Catalog filters collapse into mobile-friendly controls.
- Product detail gallery stacks above buying controls on mobile.
- Builder becomes a mobile-first accordion or wizard.
- Cart checkout is single-column on mobile.
- Hero CTAs and primary product actions remain visible and readable.
- Images reserve space, scale with `width: 100%`, and avoid layout shifts.

## Route Designs

### Homepage

The homepage becomes the primary premium brand moment.

Structure:

- Hero with short value proposition, product visual, trust metrics, and two CTAs.
- Trust strip below hero, not overcrowded inside the hero.
- Best products presented with larger product-led cards.
- Feature sections using varied layouts, not repeated three-card rows.
- Comparison or engineering story presented through precision panels.
- FAQ with smoother disclosure and clearer spacing.
- Strong CTA section near the end.

Hero constraints:

- Headline should stay readable and avoid excessive line wrapping.
- Subcopy should be short and specific.
- CTAs should not wrap on desktop.
- Mobile hero should show headline, subcopy, CTAs, and visual without feeling cramped.

### Catalog

Catalog is for efficient product discovery.

Required behavior:

- Search, tier, comfort, latex, and sort controls remain available.
- Mobile filters become collapsible or compact controls.
- Product cards clearly show image, model, comfort, key specs, price, and CTA.
- Product CTAs route correctly to product detail or cart.
- Existing filtering and sorting logic remains unchanged unless a bug is found.

### Product Detail

Product detail should feel immersive but still practical.

Structure:

- Mobile: gallery first, product summary second, purchase controls third, specs below.
- Desktop: large gallery and technical content with sticky purchase panel.
- Specs become tiles and grouped explanations instead of dense paragraphs.
- Size, accessory, and fabric choices become tactile segmented controls.
- Add to Cart and WhatsApp actions remain clear and accessible.

Business logic:

- Product data, pricing models, accessory logic, and fabric option logic stay unchanged.

### Builder

Builder should feel like a precise configurator.

Structure:

- Mobile: accordion or step-by-step wizard with one active section.
- Desktop: controls on one side, live summary/price/visual stack on the other.
- Each step shows selection, price effect, and next action.
- Custom build output should continue creating a `CartItem` using existing logic.

### Cart And Checkout

Cart must become reachable and reliable.

Structure:

- `/cart` route renders `CartPage`.
- Empty cart becomes a premium empty state with clear return-to-catalog CTA.
- Filled cart shows items, totals, trust copy, and checkout form.
- Form labels stay above inputs.
- Error text appears below inputs.
- Google Sheets submission remains through `submitLead`.
- Success route receives or retrieves order receipt and displays it.

### Static Pages

About, contact, locations, and sleep science should use a calmer editorial treatment.

Rules:

- Keep SEO through `PageShell` and `SEO`.
- Use shared containers and section rhythm.
- Add route-specific CTAs where useful.
- Keep content recognizable and do not remove business information.

## Navigation And Footer

Header:

- Desktop nav should remain single-line.
- Height should stay controlled and not dominate the viewport.
- Use a restrained glass or translucent surface treatment.
- Active route state must remain visible.
- Cart count remains visible and accurate.

Mobile drawer:

- Opens with slide/fade motion.
- Uses body scroll lock.
- Has accessible open/close labels.
- Links have large touch targets.
- Backdrop and panel should feel premium without hurting performance.

Footer:

- Desktop uses clear columns for company, products, support, resources, and social/legal.
- Mobile may use accordion sections to reduce length.
- Add legal links as non-functional placeholders only if routes are not implemented; otherwise link only to existing routes.

## Motion Rules

Allowed motion:

- Hero and section entrance reveals.
- Product card hover lift and image scale.
- Button press feedback.
- Mobile drawer slide/fade.
- Tactile segmented control changes.
- Subtle route/page fade through existing `PageShell` patterns.

Avoid:

- Heavy scroll hijacking.
- Multiple marquees.
- Continuous animations everywhere.
- Animating layout properties like `width`, `height`, `top`, or `left`.
- Motion that ignores reduced-motion preferences.

Motion should use `transform` and `opacity` wherever possible. Existing IntersectionObserver patterns may be retained or simplified if they remain performant.

## Accessibility Requirements

- Preserve semantic landmarks: `header`, `main`, `section`, `article`, `footer`, and `nav` where appropriate.
- Each route should have a clear H1.
- Interactive controls need visible focus states.
- Mobile drawer must be operable by keyboard and screen readers.
- Form inputs must have labels, not placeholder-only labels.
- Error messages should be associated with their fields where practical.
- Color contrast should target WCAG AA minimum.
- Product images need descriptive alt text.
- Touch targets should be at least 44px on mobile.

## Performance Requirements

- Preserve Vite code splitting for lazy builder route.
- Avoid adding large libraries unless a clear need exists.
- Do not add GSAP for this redesign unless a later approved plan requires pinned scroll choreography.
- Keep animations GPU-safe.
- Avoid backdrop blur on large scrolling containers.
- Keep image loading lazy where images are below the fold.
- Reserve image dimensions or aspect ratios to reduce layout shift.

## Implementation Strategy

Work in layers to avoid a random component-by-component makeover:

1. Design tokens and global responsive foundation.
2. Core layout primitives and UI primitives.
3. Functional route fixes for cart and order receipt.
4. Header and footer redesign.
5. Homepage hero and main sections.
6. Catalog and product cards.
7. Product detail purchase flow and specs.
8. Builder responsive refinement.
9. Cart and checkout polish.
10. Static page consistency pass.
11. Accessibility, performance, and responsive QA.

## Verification Plan

Minimum verification before calling implementation complete:

- Run `npm run lint`.
- Run `npm run build`.
- Manually inspect key routes at 320px, 375px, 768px, 1024px, and desktop width.
- Verify `/cart` is reachable from header and buy-now actions.
- Verify cart persists after refresh.
- Verify checkout can call `submitLead` without changing the API contract.
- Verify `/success` can show the latest order receipt.
- Verify no horizontal scroll on mobile.
- Verify primary buttons have readable contrast and do not wrap on desktop.

## Out Of Scope

- Replacing the framework or router.
- Changing product data, pricing rules, or business logic.
- Replacing Google Sheets with a new backend.
- Adding dark mode UI controls in the first implementation pass.
- Adding new legal routes unless explicitly requested.
- Generating or replacing all product photography in the first pass.

## Self-Review Notes

- No placeholder requirements remain in this spec.
- The scope is focused on visual redesign plus the minimum functional fixes needed for ecommerce flow reliability.
- The design direction is internally consistent: Apple-clean brand moments, Linear/Vercel precision for product and checkout flows.
- Mobile responsiveness is a first-class requirement and appears in every affected area.
