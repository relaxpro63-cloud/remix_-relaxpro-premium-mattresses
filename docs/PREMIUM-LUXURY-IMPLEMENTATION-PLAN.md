# RelaxPro Premium Luxury Redesign — Implementation Plan

**Project:** RelaxPro Premium Mattresses  
**Path:** `C:\Users\ramak\Downloads\remix_-relaxpro-premium-mattresses-main\relaxpro-premium-mattresses-main`  
**Document:** Full implementation plan (desktop + mobile + motion + fonts)  
**Status:** Ready for execution  
**Last updated:** 2026-07-10  
**AI skills required:** See **Section 0A** — load these skills before implementing for best output

---

## 0. Design read (locked)

**Reading this as:** redesign of a premium DTC mattress / wellness brand site for Indian luxury-home buyers, with a quiet-luxury editorial language, leaning toward asymmetric layouts, restrained motion, and distinctive typography.

| Dial | Current | Target |
|------|---------|--------|
| `DESIGN_VARIANCE` | ~4 (centered, repetitive) | **7** |
| `MOTION_INTENSITY` | ~6 (busy, uneven) | **6–7** (fewer, better) |
| `VISUAL_DENSITY` | ~5 | **3** (gallery air) |

**Mode:** Redesign — preserve brand identity (forest green, gold accent, Kerala story, product data, routes/SEO), overhaul visual rhythm, type, spacing, and motion craft.

**Non-negotiables (preserve):**
- Routes and slugs (`/`, `/catalog`, `/mattresses/:slug`, `/builder`, `/compare`, `/cart`, `/science`, `/about`, `/locations`, `/contact`)
- Product data and pricing logic
- Cart / checkout / Google Sheets flow
- WhatsApp numbers and showroom content
- SEO titles, schema, sitemap
- Logo wordmark (unless brand provides a new asset)

---

## 0A. AI skills the agent must use (best output)

**Mandatory instruction for any AI implementing this plan:**  
Do **not** freestyle the redesign from general knowledge alone. Before writing or editing UI code for each phase, **read and apply** the skills listed below. These are installed under `~\.agents\skills\` (and Grok/Claude skill paths as available).

### 0A.1 Core stack (always on)

Load these on **every** implementation session. They form the quality baseline.

| Priority | Skill name | Path (typical) | Use for |
|----------|------------|----------------|---------|
| **P0 — Lead** | `design-taste-frontend` | `~\.agents\skills\design-taste-frontend\SKILL.md` | Anti-slop rules, dials, eyebrow limits, hero rules, premium-consumer palette ban, pre-flight checklist, redesign protocol |
| **P0 — Lead** | `impeccable` | `~\.agents\skills\impeccable\SKILL.md` | End-to-end craft, brand register, typeset/layout/animate/audit/polish commands, anti-pattern detection |
| **P0 — Motion** | `emil-design-eng` | `~\.agents\skills\emil-design-eng\SKILL.md` | Animation decisions, easing, duration, springs, `transition-all` ban, press feedback, reduced motion, before/after review tables |
| **P0 — Motion review** | `review-animations` | `~\.agents\skills\review-animations\SKILL.md` | Audit existing Motion/GSAP/CSS animations against polish standards |
| **P0 — Agency finish** | `high-end-visual-design` | `~\.agents\skills\high-end-visual-design\SKILL.md` | Double-bezel cards, button-in-button CTAs, macro whitespace, fluid island nav, expensive shadows/radii |
| **P0 — Existing site** | `redesign-existing-projects` | `~\.agents\skills\redesign-existing-projects\SKILL.md` | Audit-first redesign, preserve brand/IA/SEO, upgrade without breaking flows |

### 0A.2 Supporting skills (load by task)

| Skill name | Path (typical) | When to use |
|------------|----------------|-------------|
| `animation-vocabulary` | `~\.agents\skills\animation-vocabulary\SKILL.md` | Naming motion correctly (stagger, clip-path reveal, sticky stack, origin-aware, rubber-band) so prompts and code comments stay precise |
| `apple-design` | `~\.agents\skills\apple-design\SKILL.md` | Quiet luxury spacing, haptic press, calm product presentation (mattress = physical product, Apple-like restraint) |
| `frontend-design` | `~\.agents\skills\frontend-design\SKILL.md` | Distinctive type/layout choices when composing new sections |
| `minimalist-ui` | `~\.agents\skills\minimalist-ui\SKILL.md` | If density feels too loud — calm editorial sections, FAQ, forms |
| `gpt-taste` | `~\.agents\skills\gpt-taste\SKILL.md` | Advanced GSAP ScrollTrigger / pinning / horizontal pan only for the **one** cinematic section |
| `full-output-enforcement` | `~\.agents\skills\full-output-enforcement\SKILL.md` | When rewriting large files (home, index.css) — no truncated or placeholder code |
| `agent-browser` | `~\.agents\skills\agent-browser\SKILL.md` | Visual QA: open local dev server, screenshot mobile/desktop breakpoints |
| `imagegen-frontend-web` | `~\.agents\skills\imagegen-frontend-web\SKILL.md` | Optional: section mood references (one image per section) before coding layout |
| `imagegen-frontend-mobile` | `~\.agents\skills\imagegen-frontend-mobile\SKILL.md` | Optional: mobile screen concepts for PDP sticky bar / builder steps |
| `brandkit` | `~\.agents\skills\brandkit\SKILL.md` | Optional: if elevating logo/identity board later (not required for CSS polish) |

### 0A.3 Impeccable sub-commands (use by phase)

When using `impeccable`, invoke the matching reference under `impeccable/reference/`:

| Command / reference | Phase | Purpose |
|---------------------|-------|---------|
| `document` / `extract` | 0–1 | Capture tokens into DESIGN.md if missing; extract reusable system |
| `typeset` | 1–2 | Fonts, hierarchy, line length, tracking |
| `colorize` / brand register `brand.md` | 1 | Refine palette without cream+brass AI default trap |
| `layout` | 2–3 | Section rhythm, spacing, asymmetric grids |
| `adapt` | 2–5 | Mobile responsive behavior explicitly |
| `animate` | 4 | Purposeful motion only |
| `quieter` / `distill` | 3 | Kill eyebrows, duplicate CTAs, page bloat |
| `critique` | 3, 7 | Heuristic UX score mid and late |
| `audit` | 7 | A11y, perf, responsive technical checks |
| `polish` | 7 | Final ship pass |
| `clarify` | any | CTA/form copy cleanup |
| `optimize` | 7 | UI performance (LCP, motion jank) |
| `harden` | 5–6 | Forms, empty/error states, edge cases |

Also load **`impeccable/reference/brand.md`** for this project (marketing / landing surface = brand register, not product dashboard).

### 0A.4 Skills by implementation phase (checklist)

| Phase | Must load before coding | Optional | Impeccable commands |
|-------|-------------------------|----------|---------------------|
| **0 — Prep / baseline** | `design-taste-frontend`, `redesign-existing-projects`, `impeccable` | `agent-browser`, `review-animations` | `document`, `critique` (baseline) |
| **1 — Tokens, fonts, Button** | `design-taste-frontend`, `impeccable`, `high-end-visual-design`, `frontend-design` | `minimalist-ui`, `brandkit` | `typeset`, `colorize`, `extract` |
| **2 — Header, Hero, Proof bar** | `design-taste-frontend`, `impeccable`, `high-end-visual-design`, `emil-design-eng`, `apple-design` | `imagegen-frontend-web` | `layout`, `typeset`, `adapt`, `animate` (hero only) |
| **3 — Home body sections** | `design-taste-frontend`, `impeccable`, `redesign-existing-projects`, `high-end-visual-design` | `minimalist-ui`, `quieter` via impeccable | `layout`, `distill`, `quieter`, `adapt` |
| **4 — Motion system** | `emil-design-eng`, `review-animations`, `animation-vocabulary`, `design-taste-frontend` (motion sections) | `gpt-taste` (one GSAP set-piece only) | `animate`, then `review-animations` pass |
| **5 — Catalog, PDP, Builder, Cart** | `impeccable`, `design-taste-frontend`, `emil-design-eng`, `apple-design` | `imagegen-frontend-mobile`, `harden` | `adapt`, `harden`, `polish` (per page) |
| **6 — Secondary pages + footer** | `impeccable`, `design-taste-frontend`, `minimalist-ui` | `frontend-design` | `layout`, `typeset`, `clarify` |
| **7 — QA, a11y, perf** | `impeccable`, `review-animations`, `emil-design-eng`, `design-taste-frontend` (pre-flight) | `agent-browser` | `audit`, `optimize`, `critique`, `polish` |

### 0A.5 How the agent should invoke skills (workflow)

```
1. Read this plan (docs/PREMIUM-LUXURY-IMPLEMENTATION-PLAN.md)
2. For the active phase, open every skill in the "Must load" column
3. State a one-line Design Read + dials (from Section 0)
4. Implement only that phase’s files
5. Run the phase exit criteria + design-taste pre-flight (Appendix B)
6. For motion-heavy PRs: run review-animations + Emil before/after table
7. Before merge: impeccable audit + polish; agent-browser screenshots at 375 / 768 / 1440
```

### 0A.6 Conflict resolution (when skills disagree)

| Conflict | Prefer |
|----------|--------|
| “More animation” vs “restrained luxury” | **`emil-design-eng` + `design-taste-frontend`** — fewer, motivated motions |
| Serif everywhere vs sans default | **Luxury mattress exception:** serif for display + product names only; UI stays sans (`design-taste` serif discipline) |
| Beige+gold “premium” palette | **Preserve brand forest + gold** (redesign-existing) but cool the body bg (`impeccable` cream ban + plan Section 3.1) |
| GSAP everywhere vs Motion UI | **Motion for UI**; **GSAP only** for one pin/scrub section (`design-taste` + `gpt-taste`) |
| Visual density | Target dial **3** — `minimalist-ui` / `distill` over packing more cards |
| Apple-glass vs material honesty | Soft glass on **nav/overlays only**; product cards stay solid double-bezel (`high-end-visual-design` + `apple-design`) |

### 0A.7 Skills NOT to lead with (avoid wrong aesthetic)

Do **not** make these the primary style guide for RelaxPro:

| Skill | Why not lead |
|-------|----------------|
| `industrial-brutalist-ui` | Wrong genre (terminal/military, not sleep luxury) |
| `stitch-design-taste` | Only if exporting to Google Stitch; not primary web build |
| `design-taste-frontend-v1` | Prefer current `design-taste-frontend` (v2) unless legacy lock needed |

### 0A.8 Prompt snippet (paste when starting a phase)

Use this when asking the AI to execute a phase:

```text
Implement Phase N of docs/PREMIUM-LUXURY-IMPLEMENTATION-PLAN.md for RelaxPro.

You MUST load and follow these skills before coding:
- design-taste-frontend
- impeccable (brand register + relevant subcommand)
- emil-design-eng
- high-end-visual-design
- redesign-existing-projects
+ any phase-specific skills from Section 0A.4

Preserve routes, cart, products, SEO. Mobile-first. Match tokens in Section 3.
After changes, run pre-flight (Appendix B) and phase exit criteria.
```

---

## 1. Goals and success criteria

### 1.1 Product goals
1. Feel like a **₹1L+ agency sleep brand**, not a themed catalog template.
2. Convert better on **mobile first** (majority traffic assumption for India DTC).
3. Keep load fast: LCP &lt; 2.5s on mid-range mobile, CLS &lt; 0.1.
4. Respect `prefers-reduced-motion` and WCAG AA contrast.

### 1.2 Definition of done
- [ ] Design tokens unified in `src/index.css` (type, color, radius, space, motion)
- [ ] Fonts self-hosted (or fontsource); no Google Fonts runtime `@import`
- [ ] Home page uses ≥ 4 distinct layout families; ≤ 1 eyebrow per 3 sections
- [ ] Hero fits first viewport on mobile and desktop; CTAs visible without scroll
- [ ] All major pages pass mobile breakpoint matrix (Section 11)
- [ ] One cinematic scroll section (sticky stack or clip-path materials)
- [ ] No `transition-all`; micro-interactions use exact properties + ease-out
- [ ] Lighthouse mobile Performance ≥ 85, Accessibility ≥ 90 (target)
- [ ] Visual QA screenshots for home, catalog, PDP, builder, cart

---

## 2. Current state audit (baseline)

### 2.1 Stack
| Layer | Current |
|-------|---------|
| Framework | React 19 + Vite 6 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Motion | `motion`, GSAP, Lenis |
| Routing | `react-router-dom` v7 |
| Icons | `lucide-react` |
| Carousel | Swiper |

### 2.2 Key files
| Area | Path |
|------|------|
| Design tokens | `src/index.css` |
| App shell | `src/App.tsx`, `src/main.tsx` |
| Home | `src/routes/home/index.tsx` |
| Hero | `src/components/home/HeroSlider.tsx` |
| Header / Footer | `src/components/layout/Header.tsx`, `Footer.tsx` |
| Motion primitives | `src/components/motion/motionPrimitives.tsx` |
| Button | `src/components/ui/Button.tsx` |
| Smooth scroll | `src/lib/smoothScroll.ts` |
| Products | `src/data/products.ts` |
| PDP | `src/components/product/ProductDetail.tsx` |
| Builder | `src/components/builder/MattressBuilder.tsx` |

### 2.3 Problems to fix (summary)
1. **Type:** Playfair + Google CDN; micro body text (7–12px) on cards/mobile
2. **Color:** Ivory + champagne AI-luxury default; rainbow trust icons
3. **Layout:** Same “eyebrow pill → H2 → equal cards” every section
4. **Hero:** Trust strip + scroll cue + post-hero duplicate CTAs; `min-h-screen`
5. **Motion:** `transition-all`, heavy 3D card tilts, infinite glow/float
6. **Header:** `window` scroll listener; tall banner + nav stack on mobile
7. **Density:** Home too long (map + 2 forms + 2 comparison blocks)
8. **Mobile:** Tiny type, cramped 2-col product grids, touch targets inconsistent

---

## 3. Design system specification

### 3.1 Color tokens (preserve brand, refine surfaces)

Keep **primary forest** and **gold accent**. Soften the “cream paper” body.

| Token | Role | Proposed value | Notes |
|-------|------|----------------|-------|
| `--color-primary` | Ink / dark surfaces | `#0F1F17` | Keep |
| `--color-accent` | CTA / highlight | `#C9A87C` | Keep; one accent only |
| `--color-accent-dark` | Hover | `#B89568` | Keep |
| `--color-bg` | Page background | `#F4F5F3` or cool bone | Replace pure ivory body |
| `--color-surface` | Cards | `#FFFFFF` / `#FAF8F3` | Ivory reserved for elevated cards |
| `--color-muted` | Secondary text | `#3D4A46` min | Must pass 4.5:1 on bg |
| `--color-border` | Hairlines | `rgba(15, 31, 23, 0.08)` | No harsh gray |
| `--color-success` | Success only | `#5A8F7B` | Not decorative icons |

**Ban:** Multi-hue icon chips (blue/emerald/sky/green) on WhyChooseUs.  
**Shadow rule:** Always tinted `rgba(15, 31, 23, …)`, never pure black.

### 3.2 Typography

| Role | Family | Weight | Size (fluid) | Tracking |
|------|--------|--------|--------------|----------|
| Display / H1 | Serif display (upgrade from Playfair if possible) | 400–500 | `clamp(2rem, 5vw, 4.25rem)` | `-0.02em` to `-0.03em` (floor ≥ `-0.04em`) |
| H2 | Same serif or strong sans | 500–600 | `clamp(1.5rem, 3vw, 2.75rem)` | `-0.01em` |
| H3 / product name | Serif | 400–500 | `clamp(1.125rem, 2vw, 1.5rem)` | normal |
| Body | Plus Jakarta Sans / Satoshi / Geist | 400–500 | `clamp(1rem, 1.2vw, 1.125rem)` | normal |
| UI / nav / buttons | Same sans | 600–700 | 12–14px desktop; **≥ 13px mobile** | `0.08em`–`0.14em` uppercase max |
| Price | Tabular mono or body tabular-nums | 600 | 16–24px | `0.02em` |

**Font loading plan:**
1. Prefer `@fontsource` packages or self-host woff2 in `/public/fonts/`
2. `font-display: swap` + preload display weight used in hero
3. Remove `@import url('https://fonts.googleapis.com/...')` from `index.css`

**Suggested free upgrade pairing:**
- Display: **Newsreader** or **Libre Baskerville** (if keeping free stack)
- Body/UI: **Plus Jakarta Sans** (keep) or **DM Sans**
- Optional paid later: Canela / PP Editorial New + Satoshi

**Rules:**
- Serif only for product names + hero display lines
- Nav, buttons, forms = sans only
- `text-wrap: balance` on h1–h3; `pretty` on long body
- No body text under **14px** for content; UI labels min **12px** (mobile min **13px** for primary labels)

### 3.3 Spacing scale

| Token | Desktop | Mobile |
|-------|---------|--------|
| Section Y | `py-20`–`py-28` / `clamp(64px, 8vw, 120px)` | `py-14`–`py-16` / min 56px |
| Container X | `px-8`–`px-16`, max-w `1280`–`1400` | `px-4` (16px) |
| Card gap | `gap-6`–`gap-8` | `gap-3`–`gap-4` |
| Stack (form fields) | `gap-4` | `gap-3` |
| Hero top padding | max `pt-24` content area | `pt-20` after header |

### 3.4 Radius lock (one system)

| Element | Radius |
|---------|--------|
| Buttons (primary) | `9999px` (pill) **or** `12px` — pick one globally |
| Cards | `16px` |
| Images inside cards | `12px` (inner) |
| Inputs | `12px` |
| Badges / pills | full |
| Modals / sheets | `20px` top (mobile sheet) |

**Decision for this plan:**  
- **Buttons:** `rounded-full`  
- **Cards:** `rounded-2xl` (16px)  
- **Images:** `rounded-xl`  
Kill ad-hoc `rounded-[2.5rem]` / `rounded-3xl` mixes unless double-bezel outer shell.

### 3.5 Motion tokens

```css
--ease-out-luxury: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out-move: cubic-bezier(0.77, 0, 0.175, 1);
--duration-press: 140ms;
--duration-ui: 200ms;
--duration-reveal: 600ms;
--stagger-step: 50ms;
```

| Interaction | Duration | Easing | Properties |
|-------------|----------|--------|------------|
| Button press | 100–160ms | ease-out | `transform` only |
| Hover (desktop only) | 200ms | ease-out | `transform`, `color`, `border-color` |
| Dropdown / menu | 200–250ms | ease-out | `opacity`, `transform` |
| Scroll reveal | 500–700ms | ease-out expo | `opacity`, `transform` (+ optional blur ≤ 2px) |
| Page / modal | 250–400ms | ease-out | `opacity`, `transform` |
| Marquee | continuous | linear | `transform` only |
| Sticky stack (GSAP) | scrub | none | `scale`, `opacity` |

**Hard rules:**
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding`
- Never `transition: all`
- Gate hover with `@media (hover: hover) and (pointer: fine)`
- `prefers-reduced-motion: reduce` → opacity only, no pin, no Lenis smooth

---

## 4. Information architecture (home)

### 4.1 Proposed home order (shorter, clearer)

| # | Section | Layout family | Primary job | Mobile pattern |
|---|---------|---------------|-------------|----------------|
| 1 | **Hero** | Asymmetric split / full-bleed editorial | Value + primary CTA | Stack: media top or full-bleed bg + left copy |
| 2 | **Proof bar** | Slim horizontal strip | Trial / delivery / warranty | Horizontal scroll-snap chips |
| 3 | **Two ways** | Editorial 50/50 split | Build vs shop | 2-col compact cards (already); improve type |
| 4 | **Bestsellers** | Featured + rail | Conversion | 1 featured full-width + horizontal snap rail |
| 5 | **Why natural latex** | Bento / sticky stack (one cinematic) | Differentiation | Vertical stack; sticky only if `md+` |
| 6 | **Certifications** | Single marquee or logo row | Trust | Single row, no second marquee |
| 7 | **Testimonials** | Drag rail | Social proof | Snap carousel, 1.1 cards visible |
| 8 | **Showrooms** | 3-up → list | Visit | Stacked cards + sticky “Book” CTA |
| 9 | **FAQ** | Accordion | Objection handling | Full-width accordion |
| 10 | **Book visit** | Single form CTA block | Lead | Full-width form, large inputs |
| 11 | Footer | Dark brand | Nav / legal | Accordion columns (existing) |

**Remove or relocate from home:**
- Post-hero dual CTA strip (merge into hero/proof)
- Second marquee (keep one)
- Raw Google Map embed → link to `/locations` or static image + “Open map”
- Duplicate `CostComparison` + `ComparisonTable` → one combined module
- Second form (`ConsultationForm`) → contact page or WhatsApp deep link

### 4.2 Eyebrow budget
Max **ceil(sectionCount / 3)** uppercase kickers on home.  
For 10 sections → max **4** eyebrows total (including hero). Prefer none on FAQ, map, forms.

---

## 5. Phase plan (implementation)

---

### Phase 0 — Prep and baseline (0.5 day)

**Skills (required):** `design-taste-frontend` · `redesign-existing-projects` · `impeccable` · optional: `agent-browser`, `review-animations`  
**Impeccable:** `document`, `critique` (baseline)  
See **Section 0A.4**.

**Objectives:** Safe branch, measure baseline, freeze scope.

| Task | Detail | Owner skill |
|------|--------|-------------|
| 0.1 | Create branch `feat/premium-luxury-redesign` | — |
| 0.2 | Screenshot home/catalog/PDP mobile + desktop | Visual QA baseline |
| 0.3 | Lighthouse mobile + desktop on current build | Perf baseline |
| 0.4 | Inventory all `uppercase tracking` eyebrows on home | design-taste |
| 0.5 | List all `transition-all` and scroll listeners | emil-design-eng |

**Deliverable:** Baseline notes in PR description.

---

### Phase 1 — Design tokens, fonts, base UI (1–2 days)

**Skills (required):** `design-taste-frontend` · `impeccable` · `high-end-visual-design` · `frontend-design`  
**Impeccable:** `typeset`, `colorize`, `extract`  
See **Section 0A.4**.

**Files:** `src/index.css`, `index.html`, `src/components/ui/Button.tsx`, `Badge.tsx`, `Container.tsx`, `Section.tsx`, `main.tsx`

#### 1.1 Tokens rewrite
- Replace ad-hoc spacing clamps with documented scale
- Add semantic tokens: `--color-bg`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-accent`
- Document z-index scale: `base 0`, `sticky 40`, `dropdown 50`, `overlay 60`, `modal 70`, `toast 80`, `fab 90`
- Noise overlay: fixed, `pointer-events-none`, opacity ≤ 0.03

#### 1.2 Fonts
- Install/self-host woff2 for display + body
- Preload hero display font in `index.html`
- Map Tailwind `@theme` `--font-heading`, `--font-body`
- Remove Google Fonts `@import`

#### 1.3 Base styles
```css
html { -webkit-text-size-adjust: 100%; }
body { background: var(--color-bg); color: var(--color-ink); }
h1, h2, h3 { text-wrap: balance; font-family: var(--font-heading); }
p { text-wrap: pretty; max-width: 65ch; }
@media (prefers-reduced-motion: reduce) { /* opacity-only fallbacks */ }
```

#### 1.4 Button system
Unify all CTAs through `Button.tsx`:

| Variant | Use |
|---------|-----|
| `primary` | Gold fill / forest text **or** forest fill / warm white |
| `secondary` | Forest fill |
| `outline` | Hairline border |
| `ghost` | Text only |

**Specs:**
- `min-h-11` (44px) always
- `active:scale-[0.97]`
- Trailing icon in nested circle (button-in-button) for primary marketing CTAs
- No `transition-all` → `transition-[transform,background-color,border-color,color,box-shadow] duration-200`

#### 1.5 Mobile for Phase 1
- 16px inputs (prevent iOS zoom) — already partially enforced
- Touch targets ≥ 44×44
- Safe-area padding utilities: `pb-[env(safe-area-inset-bottom)]`

**Exit criteria:** Site looks the same-ish but type renders from local fonts; Button used on home hero; no Google Fonts network request.

---

### Phase 2 — Header + Hero + proof bar (1.5–2 days)

**Skills (required):** `design-taste-frontend` · `impeccable` · `high-end-visual-design` · `emil-design-eng` · `apple-design`  
**Impeccable:** `layout`, `typeset`, `adapt`, `animate` (hero only)  
See **Section 0A.4**.

**Files:** `Header.tsx`, `HeroSlider.tsx`, `WhatsAppFAB.tsx`, `ScrollToTop.tsx`, new `ProofBar.tsx`

#### 2.1 Header redesign

**Desktop:**
- Single row ≤ 72px content height
- Hide utility banner after scroll **or** collapse into one line
- Sticky with `bg-white/90 backdrop-blur` only when scrolled
- Nav one line; Shop mega/dropdown origin-aware (scale from trigger)
- Cart badge with layout animation (optional)

**Mobile:**
- Logo left, cart + hamburger right
- **No** multi-line desktop nav visible under `lg`
- Full-screen or 100dvh menu panel with:
  - Staggered links (`y: 12` → `0`, delay 50ms)
  - Primary CTA “Shop” + “Build” pinned bottom
  - Focus trap + `body` scroll lock (existing)
  - Close on route change (existing)

**Motion:**
- Replace `window.addEventListener('scroll')` with Motion `useScroll` + `useMotionValueEvent` **or** IntersectionObserver on a sentinel
- Hide-on-scroll-down: keep, but disable when menu open and when near top

**Mobile header checklist:**
| Breakpoint | Behavior |
|------------|----------|
| &lt; 640 | Compact logo, icon buttons only |
| 640–1023 | Compact logo, cart + menu |
| ≥ 1024 | Full nav |

#### 2.2 Hero redesign

**Structure (max 4 text units):**
1. Optional small eyebrow (one line) **or** none  
2. Headline ≤ 2 lines desktop; ≤ 3 mobile  
3. Subtext ≤ 20 words  
4. CTAs: 1 primary + 1 secondary  

**Remove from hero:**
- Trust badge row (move to Proof bar)
- Scroll indicator

**Layout:**
- Desktop: left copy / right or full-bleed image with left gradient scrim
- Use `min-h-[100dvh]` not `h-screen` / careful with sticky header: content `min-h-[calc(100dvh-header)]` if needed
- Hero image: `loading="eager"`, `fetchPriority="high"`, explicit width/height, WebP/AVIF

**Copy direction (example):**
- H1: “Pure natural latex, from Kerala to your bed”
- Sub: “GOLS-certified organic latex. Hand-layered. Factory-direct pricing.”
- Primary: “Explore collection”
- Secondary: “Book showroom visit”

**Motion:**
- Word/line reveal on load (existing `RevealText`) — keep, reduce delays
- Parallax image subtle; disable on reduced motion and on low-end (`matchMedia` + optional)
- No infinite float on hero content

#### 2.3 Proof bar (new, under hero)
- Items: Free delivery · 100-night trial · 10-year warranty · GOLS latex
- Desktop: centered flex row with hairline dividers
- Mobile: horizontal scroll-snap, `snap-x`, hide scrollbar, chips min width 70% or equal flex

**Exit criteria:** First viewport sells the brand cleanly on iPhone SE width (375) and desktop 1440.

---

### Phase 3 — Home body sections (2–3 days)

**Skills (required):** `design-taste-frontend` · `impeccable` · `redesign-existing-projects` · `high-end-visual-design` · optional: `minimalist-ui`  
**Impeccable:** `layout`, `distill`, `quieter`, `adapt`  
See **Section 0A.4**.

**Files:** `routes/home/index.tsx`, home components under `src/components/home/*`

#### 3.1 TwoWaysToOwn
- Keep 2-col concept (strong conversion)
- Desktop: larger type, double-bezel cards, button-in-button CTAs
- Mobile: keep 2-col only if type ≥ 12px; else stack at `&lt; sm`
- Remove decorative eyebrow if budget exceeded
- Hover lift only on `(hover: hover)`

#### 3.2 Marquees
- Keep **one**: Certification **or** brand strip
- Pause on hover (desktop); reduced motion → static list wrap
- Mobile: slower speed (60s+) or static 2-row wrap to save CPU

#### 3.3 Bestsellers
- Layout: featured product (Nirvana) large left / 2 stacked right on `lg`
- Mobile: featured full-width card, then horizontal snap for rest (`scroll-snap-type: x mandatory`)
- One badge max per card
- Min title `text-sm` mobile; price `text-base`
- CTAs: full width, 44px height; WhatsApp secondary outline
- Hover: image scale 1.04 only; no rotateY

#### 3.4 WhyChooseUs
- Replace 4 equal rainbow cards with:
  - Option A: 2×2 monochrome bento with gold hairlines  
  - Option B: single horizontal icon strip (no cards)
- Stats row: use `AnimatedCounter` with tabular nums; mobile 2×2 grid

#### 3.5 CostComparison + ComparisonTable
- Merge into one section “Natural latex vs foam”
- Desktop: comparison cards or simple 2-col
- Mobile: stacked rows or horizontal scroll table with sticky first column
- Avoid long `border-b` on every micro-row; group rows

#### 3.6 Testimonials
- Quote body ≤ 3 lines with line-clamp
- Attribution: name + city + product
- Mobile snap carousel; desktop drag (existing) + arrows optional
- Prefer real photos later; interim: monogram OK but quieter

#### 3.7 Showrooms
- 3 cards → stack on mobile
- CTA “Book visit” primary; map opens external or `/locations`
- Remove wipe background if it causes paint jank on mobile

#### 3.8 Forms
- Keep **ShowroomBookingForm** only on home
- Move consultation to `/contact`
- Inputs: 16px font, clear labels, error states, focus gold ring
- Submit button full-width mobile

#### 3.9 QuickConnectBar
- Sticky on mobile bottom above WhatsApp FAB? Avoid double FABs
- Coordinate z-index with WhatsAppFAB + ScrollToTop so nothing overlaps

**Home mobile spacing matrix:**

| Section | Mobile py | Desktop py |
|---------|-----------|------------|
| Proof bar | py-4 | py-5 |
| Two ways | py-14 | py-20 |
| Bestsellers | py-14 | py-24 |
| Why latex | py-14 | py-24 |
| Testimonials | py-14 | py-24 |
| Showrooms | py-14 | py-24 |
| FAQ | py-12 | py-20 |
| Form | py-12 | py-16 |

**Exit criteria:** Home scrolls in under ~1.5 screens of “decision content” before FAQ; no duplicate CTA intents.

---

### Phase 4 — Motion system polish (1–1.5 days)

**Skills (required):** `emil-design-eng` · `review-animations` · `animation-vocabulary` · `design-taste-frontend` · optional: `gpt-taste` (one GSAP set-piece only)  
**Impeccable:** `animate` → then animation review pass  
See **Section 0A.4**.

**Files:** `motionPrimitives.tsx`, `smoothScroll.ts`, targeted section components

#### 4.1 Primitives cleanup
| Primitive | Change |
|-----------|--------|
| `FadeUp` | Default `y: 20`, duration 0.55–0.65 |
| `StaggerChildren` | Default stagger 0.05 |
| `RevealText` | Keep; shorter delays |
| New `ClipReveal` | Image wipe via `clip-path` |
| New `Magnetic` (optional) | Desktop primary CTA only; Motion values, no React state |

#### 4.2 Global CSS animation audit (`index.css`)
- Remove or gate: `animate-float`, `animate-pulse-glow`, `soft-glow` infinite
- Keep marquee, shimmer (skeleton), optional shine on one hero CTA
- Fix duplicate `.card-hover` rules (file has two definitions)

#### 4.3 One cinematic section (pick one)
**Recommended:** Sticky stack “Layers of sleep” on home or `/science`
- GSAP ScrollTrigger, `start: "top top"`, pin true
- **Desktop only** (`matchMedia("(min-width: 1024px)")`)
- Mobile: static vertical stack (no pin) — pin + address bar is fragile on iOS

#### 4.4 Lenis
- Disable when `prefers-reduced-motion`
- Ensure nested scroll (cart drawer, mobile menu, maps) uses `data-lenis-prevent`

#### 4.5 Route transitions (optional light)
- `AnimatePresence` on main outlet: opacity 0.15s — keep short; no long page wipes

**Exit criteria:** Motion feels expensive but never delays interaction; mobile FPS stable on mid Android.

---

### Phase 5 — Catalog, PDP, Builder, Cart (2 days)

**Skills (required):** `impeccable` · `design-taste-frontend` · `emil-design-eng` · `apple-design` · optional: `imagegen-frontend-mobile`  
**Impeccable:** `adapt`, `harden`, per-page `polish`  
See **Section 0A.4**.

#### 5.1 ProductList (`/catalog`)
- Filters: sticky top under header on mobile as horizontal chips
- Grid: 2-col mobile, 3-col desktop; consistent card component shared with home
- Skeleton loaders matching card geometry
- Empty filter state designed (not blank)

#### 5.2 ProductDetail (PDP)
- Gallery: swipe mobile, thumbs desktop
- Sticky buy box on desktop (`lg`); on mobile sticky bottom bar:
  - Price + “Add to cart” + WhatsApp icon
  - `safe-area-inset-bottom`
  - Hide when footer in view (optional)
- Size selector: large touch targets, segmented control
- Specs: grouped cards, not 15 hairline rows
- Related products: horizontal snap

#### 5.3 MattressBuilder
- Step indicator clear on mobile
- One primary action per step
- Preview image sticky on desktop; collapsible summary on mobile
- Disable accidental double-submit

#### 5.4 Cart + Success
- Line items readable; qty steppers 44px
- Order summary sticky desktop, bottom sheet summary mobile
- Success: calm confirmation + WhatsApp follow-up (existing confetti optional, once)

#### 5.5 Compare
- Mobile: horizontal scroll table, first column sticky
- Desktop: full table with clear CTA per column

**Exit criteria:** Full purchase path usable one-handed on 375px width.

---

### Phase 6 — Secondary pages + footer (1 day)

**Skills (required):** `impeccable` · `design-taste-frontend` · `minimalist-ui` · optional: `frontend-design`  
**Impeccable:** `layout`, `typeset`, `clarify`  
See **Section 0A.4**.

| Page | Focus |
|------|--------|
| Sleep Science | Cleaner tabs, monochrome icons, optional sticky stack (if not on home) |
| About | Editorial split: story + process images; drop-cap optional once |
| Locations | Real map section lives here; list + filters |
| Contact | Consultation form + channels |
| 404 | On-brand calm page |

Footer:
- Reduce link noise
- Mobile accordion (exists) — ensure one open at a time, smooth height without jank
- Trust line + payments/shipping clarity

---

### Phase 7 — Performance, a11y, QA (1–1.5 days)

**Skills (required):** `impeccable` · `review-animations` · `emil-design-eng` · `design-taste-frontend` (Appendix B pre-flight) · optional: `agent-browser`  
**Impeccable:** `audit`, `optimize`, `critique`, `polish`  
See **Section 0A.4**.

#### 7.1 Performance
- Hero image optimized + priority
- Lazy routes already for builder — extend for heavy home below-fold if needed
- Audit third-party (maps iframe off home)
- Prefer CSS for simple hovers under load
- Avoid animating box-shadow; toggle precomputed shadow classes

#### 7.2 Accessibility
- Focus visible gold ring (exists) — verify on all interactive
- Skip link works
- Menu focus trap
- Form errors associated with `aria-describedby`
- Color contrast AA on muted text
- Reduced motion path tested

#### 7.3 SEO
- Do not change routes
- Keep Helmet titles/descriptions; update only if copy changes
- OG image if missing

#### 7.4 QA matrix
See Section 11.

---

## 6. Mobile-responsive plan (detailed)

### 6.1 Breakpoints (Tailwind defaults)

| Name | Width | Primary use |
|------|-------|-------------|
| default | 0–639 | Phone portrait |
| `sm` | 640+ | Large phone / small tablet |
| `md` | 768+ | Tablet portrait |
| `lg` | 1024+ | Laptop / desktop nav |
| `xl` | 1280+ | Wide desktop |
| `2xl` | 1536+ | Large monitors |

### 6.2 Device test matrix

| Device class | Widths | Must verify |
|--------------|--------|-------------|
| Small phone | 360, 375 | Hero CTA in first view, no horizontal scroll |
| Large phone | 390, 430 | Product 2-col cards readable |
| Tablet | 768, 834 | Nav still hamburger or condensed |
| Desktop | 1280, 1440 | Full nav one line, asymmetric layouts |
| Large | 1920 | Container max-width, no stretched text |

### 6.3 Global mobile rules

1. **No horizontal page scroll** (`overflow-x: hidden` on root only if needed; fix root causes first)
2. **Min tap target 44×44** for all buttons, nav items, qty controls
3. **Inputs `font-size: 16px`** minimum (iOS zoom prevention)
4. **Viewport units:** `100dvh` for full-height; avoid `100vh` alone
5. **Safe areas:** FAB, sticky cart bar, mobile menu use `env(safe-area-inset-*)`
6. **Hover none:** no sticky hover states on touch (`@media (hover: hover)`)
7. **Images:** never cause CLS; always width/height or aspect-ratio box
8. **Type floor:** body ≥ 14–16px; UI labels ≥ 12–13px; ban 7–9px labels
9. **Grids:** default single column under `md` unless 2-col is proven readable
10. **Sticky elements:** max one primary sticky chrome (header); second sticky (buy bar) only on PDP
11. **GSAP pin / horizontal pan:** desktop only (`lg+`)
12. **WhatsApp FAB:** bottom-right; offset when sticky buy bar present (`bottom-24` vs `bottom-6`)

### 6.4 Component-level mobile specs

#### Header
| State | Spec |
|-------|------|
| Default height | Banner ~32px + bar ~56px |
| Scrolled | Banner hides optional; bar 56px glass |
| Menu open | `100dvh` panel, links 48px row height |
| Active link | Gold underline or weight change |

#### Hero
| Spec | Mobile | Desktop |
|------|--------|---------|
| Min height | `min-h-[100dvh]` | same |
| Headline | `text-4xl` (~36px) | up to ~76px |
| Sub | 14–16px, max 4 lines | 16–18px, max 3 lines |
| CTAs | full-width stack, gap-3 | row, auto width |
| Image | full-bleed bg | full-bleed or split |

#### Product card
| Spec | Mobile | Desktop |
|------|--------|---------|
| Grid | 2-col, gap-3 | 3-col, gap-8 |
| Image ratio | 4/3 | 4/3 |
| Title | ≥ 13px | 20–24px |
| Price | ≥ 14px | 20–24px |
| Buttons | stack, full width, ≥ 40px h | row or stack |

#### Forms
| Spec | Mobile |
|------|--------|
| Labels | above input, 13–14px |
| Fields | full width, min-h 48px |
| Submit | full width, min-h 48px |
| Errors | under field, red, 12–13px |

#### Footer
| Spec | Mobile |
|------|--------|
| Columns | accordion |
| Social | 44px hit area |
| Legal | stacked |

### 6.5 Mobile performance budget
- JS initial: prefer existing code-split builder
- Hero image &lt; ~200KB compressed
- Avoid 2 marquees + heavy blur on scroll on mobile
- Limit simultaneous Motion animations in viewport to ≤ 6

### 6.6 Mobile UX flows to script-test

1. Land home → Explore collection → open PDP → select size → add cart → cart → checkout fields  
2. Home → Build mattress → complete steps → add cart  
3. Home → Book showroom form submit  
4. Open mobile menu → every nav target  
5. WhatsApp enquire from product card  
6. Compare table usable without desktop  

---

## 7. Desktop-specific enhancements

- Asymmetric hero and featured product layouts
- Magentic CTA (optional, subtle)
- GSAP sticky stack materials story
- Shop dropdown / mega (lightweight)
- Multi-column showrooms + rich footer
- Cursor-driven image zoom only if smooth (else CSS)

---

## 8. Animation implementation checklist (named effects)

| Effect | Where | Mobile |
|--------|-------|--------|
| Fade / slide reveal | Section headers | Yes, shorter distance |
| Stagger | Product grids, lists | Yes, 50ms |
| Clip-path reveal | Lifestyle images | Yes |
| Parallax | Hero bg only | Optional off on small/low-end |
| Press feedback | All buttons | Yes |
| Origin-aware | Dropdowns / menu | Yes |
| Sticky stack | One materials section | **Desktop only** |
| Marquee | One cert row | Slow or static |
| Number ticker | Stats | Yes once in view |
| Shared layout (optional) | Cart badge count | Yes |

---

## 9. File-level change map

| File | Phase | Changes |
|------|-------|---------|
| `src/index.css` | 1, 4 | Tokens, fonts, motion CSS, kill bad keyframes |
| `index.html` | 1 | Preload fonts, meta viewport check |
| `src/components/ui/Button.tsx` | 1 | Variants, icon slot, motion |
| `src/components/layout/Header.tsx` | 2 | Scroll API, mobile menu polish, height |
| `src/components/home/HeroSlider.tsx` | 2 | Structure, dvh, copy, CTAs |
| `src/components/home/ProofBar.tsx` | 2 | **New** |
| `src/routes/home/index.tsx` | 3 | Section order, remove bloat, layouts |
| `src/components/home/TwoWaysToOwn.tsx` | 3 | Type, bezel, mobile type floor |
| `src/components/home/WhyChooseUs.tsx` | 3 | Monochrome bento |
| `src/components/home/CertificationMarquee.tsx` | 3 | Keep one marquee |
| `src/components/home/ShopByBrands.tsx` | 3 | Merge or cut |
| `src/components/home/CostComparison.tsx` | 3 | Merge with table |
| `src/components/home/ComparisonTable.tsx` | 3 | Merge |
| `src/components/home/ConsultationForm.tsx` | 3 | Move off home |
| `src/components/home/ShowroomBookingForm.tsx` | 3 | Polish |
| `src/components/home/SleepFAQs.tsx` | 3 | Type, spacing |
| `src/components/motion/motionPrimitives.tsx` | 4 | Defaults, ClipReveal |
| `src/lib/smoothScroll.ts` | 4 | Reduced motion |
| `src/components/product/*` | 5 | Shared card, PDP sticky bar |
| `src/components/builder/MattressBuilder.tsx` | 5 | Mobile steps |
| `src/components/cart/CartPage.tsx` | 5 | Layout |
| `src/components/layout/Footer.tsx` | 6 | Simplify |
| Secondary routes | 6 | Align tokens |

---

## 10. Copy and content guidelines

1. Concrete &gt; poetic: materials, certifications, lead times  
2. One CTA intent per region (don’t mix “Contact us” + “Let’s talk” + “Book”)  
3. No fear-mongering VOC language in hero  
4. No em-dash flourishes in UI strings (optional brand rule)  
5. Badge max one per product card  
6. Testimonials ≤ 3 lines  

---

## 11. QA checklist

### 11.1 Visual
- [ ] No horizontal scroll at 360 / 375 / 390 / 768 / 1024 / 1440  
- [ ] Hero CTA visible without scroll on 375  
- [ ] Nav single line at 1024+  
- [ ] Cards align; images no stretch  
- [ ] Gold accent consistent; no random blue/green chips  
- [ ] Radius system consistent  

### 11.2 Interaction
- [ ] All buttons show press feedback  
- [ ] Hover styles do not stick on touch devices  
- [ ] Mobile menu open/close, focus, body lock  
- [ ] Forms validate and show errors  
- [ ] Cart qty / remove works  
- [ ] Sticky PDP bar does not cover content permanently  

### 11.3 Motion
- [ ] Reduced motion disables parallax, pin, marquee scroll  
- [ ] No `transition-all` remaining in changed files  
- [ ] No infinite glow on primary CTAs  

### 11.4 A11y
- [ ] Tab order logical  
- [ ] Focus visible  
- [ ] Images have alt  
- [ ] Contrast AA for body and buttons  

### 11.5 Perf
- [ ] Lighthouse mobile pass targets  
- [ ] Hero network request optimized  
- [ ] No Google Fonts request  

---

## 12. Risk register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Font licensing for premium serifs | Legal / cost | Start with free pairing; swap later |
| Sticky GSAP on iOS | Jank / jump | Desktop-only pin |
| Home rewrite breaks SEO anchors | Traffic | Keep IDs (`#bestsellers`, booking section) |
| Over-animation | Cheap feel | Phase 4 restraint checklist |
| Form move breaks marketing links | Leads | Redirect hash or keep hidden form |
| Brand rejects cooler bg | Aesthetic | Keep ivory as `--color-surface` only |

---

## 13. Timeline estimate

| Phase | Estimate | Depends on |
|-------|----------|------------|
| 0 Prep | 0.5 day | — |
| 1 Tokens + fonts + Button | 1–2 days | 0 |
| 2 Header + Hero + Proof | 1.5–2 days | 1 |
| 3 Home body | 2–3 days | 2 |
| 4 Motion polish | 1–1.5 days | 3 |
| 5 Catalog / PDP / Builder / Cart | 2 days | 1 |
| 6 Secondary + footer | 1 day | 1 |
| 7 QA + perf | 1–1.5 days | 2–6 |
| **Total** | **~10–14 working days** | Single developer full-time |

Parallelization: Phase 5 can start after Phase 1 while Phase 3 continues.

---

## 14. Execution order (day-by-day sketch)

| Day | Work |
|-----|------|
| 1 | Phase 0 + Phase 1 tokens/fonts |
| 2 | Button system + global type pass |
| 3 | Header mobile/desktop |
| 4 | Hero + proof bar |
| 5–6 | Home restructure, bestsellers, two-ways |
| 7 | Why latex / merge comparison / testimonials / forms |
| 8 | Motion primitives + one GSAP section |
| 9–10 | Catalog, PDP sticky bar, builder mobile |
| 11 | Cart, compare, secondary pages, footer |
| 12 | QA matrix, Lighthouse, bugfix |
| 13–14 | Buffer / polish / stakeholder feedback |

---

## 15. Acceptance criteria (stakeholder)

1. Site feels calmer, more expensive, less “template.”  
2. Mobile purchase path is effortless.  
3. Brand forest + gold still recognizable.  
4. Kerala / GOLS story remains clear.  
5. No regression in cart, WhatsApp, or SEO routes.  
6. Animations feel intentional, not busy.  

---

## 16. Out of scope (this plan)

- Backend / pricing engine changes  
- New product photography shoot (recommend later)  
- Native apps  
- Full CMS migration  
- Multi-language i18n (can add later)  
- Payment gateway integration beyond current flow  

---

## 17. Next action

When approved, implement in this order:

1. **Load skills** from **Section 0A** (core stack + Phase 1 row)  
2. **Phase 1** — `src/index.css` tokens + self-hosted fonts + `Button.tsx`  
3. **Phase 2** — `Header.tsx` + `HeroSlider.tsx` + new `ProofBar.tsx`  
4. Continue through phases without changing URL structure; re-read phase skills each time  

**Remember:** Best output depends on loading **`design-taste-frontend` + `impeccable` + `emil-design-eng` + `high-end-visual-design` + `redesign-existing-projects`** on every coding session, then phase-specific skills from 0A.4.

---

## Appendix A — Mobile CSS patterns to reuse

```css
/* Full-height stable on mobile browsers */
.min-h-dvh { min-height: 100dvh; }

/* Touch-safe hover */
@media (hover: hover) and (pointer: fine) {
  .card-lift:hover {
    transform: translateY(-4px);
  }
}

/* Horizontal snap rail */
.snap-rail {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.snap-rail > * {
  scroll-snap-align: start;
  flex: 0 0 min(85%, 320px);
}

/* Safe sticky buy bar */
.pdp-sticky-buy {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  z-index: 40;
}
```

## Appendix B — Pre-flight (design-taste) before ship

- [ ] Design read still true  
- [ ] Dials 7 / 6–7 / 3  
- [ ] No em-dash spam in UI  
- [ ] Theme lock (no random light/dark flips)  
- [ ] One accent color  
- [ ] One radius system  
- [ ] Hero fits viewport  
- [ ] Eyebrow count ≤ ceil(n/3)  
- [ ] No scroll cue  
- [ ] No 3+ identical layout sections in a row  
- [ ] Reduced motion handled  
- [ ] Mobile collapse explicit for every multi-col layout  

---

*End of plan. File path:*  
`docs/PREMIUM-LUXURY-IMPLEMENTATION-PLAN.md`
