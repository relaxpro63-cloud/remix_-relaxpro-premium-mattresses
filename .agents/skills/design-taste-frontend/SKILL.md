---
name: design-taste-frontend
description: Guidelines for implementing tasteful, premium, high-end frontend interfaces with rich aesthetics, micro-animations, and balanced typography.
risk: safe
source: local
date_added: "2026-07-05"
---

# Design Taste Frontend Guidelines

This skill guides the implementation of premium, high-end, and visually stunning web interfaces. It aims to push designs beyond standard templates to create experiences that feel expensive, well-crafted, and highly modern.

## Core Pillars of Frontend Design Taste

### 1. Curated Color Systems
* **Contrast Over Clutter**: Ensure background to text contrast is high but soft. Use warm or cool off-whites (e.g., `#FAFAF5`, `#F6F6F5`) for dark text containers instead of pure gray to create organic texture.
* **Avoid Default Primaries**: Never use pure hex primaries (like `#0000FF` or `#FF0000`). Prefer tailored HSL or hex colors (e.g., Forest Night `#1A3629`, Sage `#5C7C68`, Champagne Gold `#C9A87C`).

### 2. Premium Typography
* **Font Pairing**: Pair a distinctive heading serif (e.g., `DM Serif Display`, `Playfair Display`) with a highly readable, clean geometric sans-serif for body text (e.g., `Plus Jakarta Sans`, `Inter`).
* **Sizing Scales**: Rely on fluid typography (e.g., `clamp()`) for headings to ensure text scales gracefully across screen resolutions without breaking boundaries or wrapping awkwardly.

### 3. Luxurious Layouts & Spacing
* **Generous White Space**: Allow elements to breathe. Do not pack columns tightly. Give grids and sections wide padding.
* **Balanced Borders**: Avoid raw capsules (`rounded-full`) for main buttons or content boxes unless they are small circular controls. Use slightly rounded rectangles (`rounded-xl` or `rounded-2xl`, 8px to 16px) for an expensive, architectural feel.
* **Dynamic Shadows**: Avoid harsh, dark borders. Instead, use soft, diffused, multi-layered shadows to give cards depth (e.g., `box-shadow: 0 4px 20px rgba(26, 54, 41, 0.05)`).

### 4. Interactive Micro-Animations
* **Physics-Based Transitions**: Use smooth, cubic-bezier timing curves (e.g., `cubic-bezier(0.4, 0, 0.2, 1)`) for transitions.
* **Subtle Hover States**: Enhance links and buttons with delicate hover effects (e.g., scale adjustments of `1.02`, slight background changes, or smooth translation). Avoid abrupt shifts.

---

## Developer Implementation Checklist

- [ ] **Accessibility**: Contrast ratio meets WCAG AA standards.
- [ ] **Responsiveness**: Mobile viewport displays clean layouts (e.g., items scroll horizontally or fit neatly in grids rather than overflowing).
- [ ] **No Layout Shifts**: Containers have defined min-height or aspect ratio to prevent sudden layout shifts (CLS) on dynamic load.
- [ ] **Consistency**: All colors, border radii, and spacing configurations are referenced from the central design system/variables rather than ad-hoc inline styles.
