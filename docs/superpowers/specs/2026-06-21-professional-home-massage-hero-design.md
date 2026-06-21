# Professional Home Page + Massage Gun Hero — Design Spec

**Date:** 2026-06-21
**Status:** Approved
**Scope:** Redesign the Glowora home page (`/`) — add a massage-gun product photo to the hero with editorial framing, and bring the rest of the home sections up to the same professional standard. Purely presentational; no backend, API, or data-model changes.

## Goal

Make the home page professional, beautiful, and attractive. Add the percussive massage-gun product photo to the hero in a way that fits the existing rose/pink Glowora skincare brand. Elevate the supporting home sections so the whole page reads as one cohesive, premium design.

## Non-Goals

- No backend changes (no new endpoints, no DB changes, no Razorpay/payment touch).
- No changes to Product Detail, Cart, Checkout, Account, Admin pages.
- No fetching of copyrighted web images — the massage-gun photo is provided by the user into `public/massager.png`.
- No full design-system refactor of the entire site.

## Design Decision: Brand Fit (Approach B)

The massage gun is a black handheld device on a gray studio background; Glowora is soft rose/pink skincare. Rather than rebrand (Approach A) or drop it in raw (Approach C), we **keep the rose/pink identity and frame the device editorially**:
- Warm rose radial glow behind the product card bridges the cold device into the theme.
- Frosted light card frame → device sits on a "premium product stage," not floating raw.
- Hero copy pivots to wellness/recovery ("Restore. Relax. Renew.") so the device belongs; the rest of the site stays skincare.

## Hero Section — New Design

**Left column (content):**
- Eyebrow tag: `✦ New Arrival`
- Headline: **"Restore. Relax.** *Renew.*"** — third word in rose-gold highlight with sparkle accent
- Subhead: "Meet the Glowora percussive wellness massager — nine attachments, deep-tissue relief, and a moment of calm in your daily ritual."
- CTAs: **Shop the Massager** (primary, `#bestsellers`), **Explore Wellness** (ghost, `#categories`)
- Trust badges: 3 glass pills — "9 Interchangeable Heads", "Up to 6h Battery", "Whisper-Quiet"

**Right column (photo):**
- Massage-gun photo in rounded 3:4 card, warm-rose radial glow behind it.
- Floating glass pill: `★ 4.9 · 2,300+ reviews` (social proof).
- "Featured" corner ribbon.
- Existing parallax + float animation reused.

**Image handling:** `public/massager.png` is the slot. `<img onError>` swaps to an inline SVG placeholder so the page works before the user adds the file. Everything builds and runs immediately.

## Rest of Home — Polish (Section 2)

Elevate existing components to match the new hero. No data changes:

- **Section rhythm:** shared `.section` vertical padding; consistent `.section-label` + `.section-title` headers across all home sections.
- **About pillars → feature cards:** replace emoji blocks (`🌿 🔬 ♻️ 🐰`) with lucide-icon cards (`Leaf`, `FlaskConical`, `Recycle`, `Rabbit`) in frosted rounded cards matching the hero's glass aesthetic. Same 4 pillars.
- **TrustBar:** keep content, tighten styling to match hero's design language.
- **PromoBanner / Testimonials:** keep, restyle warmer (frosted card backgrounds, consistent radius/shadow tokens).
- **Closing CTA band:** new small section before footer — "Start your wellness ritual — Shop now" — gives the page a professional finish.

## Files Touched

- `frontend/public/` — add `massager.png` slot (user supplies file; SVG fallback built in)
- `frontend/src/components/shop/Hero.jsx` — swap copy constants + badges, wire image with onError fallback
- `frontend/src/components/shop/Hero.css` — warmer glow tints, tighten visual stage (no layout rewrite)
- `frontend/src/pages/shop/Home.jsx` — section rhythm wrappers, replace About emoji pillars with icon cards, add closing CTA band
- `frontend/src/pages/shop/Home.css` — feature-card styles, section spacing, CTA band styles
- Existing components (`TrustBar`, `Categories`, `Bestsellers`, `AllProducts`, `PromoBanner`, `Testimonials`) — minor CSS adjustments only if needed for consistency; structure untouched.

## What Does NOT Change

- Razorpay UPI payment flow (just shipped) — untouched.
- Backend, APIs, MongoDB models.
- Product Detail, Cart, Checkout, CheckoutSuccess, Account, Admin pages.
- Existing component data sources (fetchProducts, fetchBanner, etc.).

## Testing

Manual / visual:
1. `npm run build` succeeds with no errors.
2. Home page loads: hero shows massage-gun image (or SVG placeholder if file absent), copy reads wellness, CTAs scroll to correct sections.
3. Responsive check at desktop / tablet (960px) / mobile (640px) breakpoints — hero grid collapses, image reorders above content on mobile (existing behavior preserved).
4. About section shows 4 icon feature cards (no emojis).
5. Closing CTA band renders before footer.
6. No console errors; no broken image icons.
7. Existing sections (Categories, Bestsellers, AllProducts, Testimonials, PromoBanner) still render their data correctly.

## Rollback

All work on branch `feat/professional-home`. If the redesign has issues, the branch can be dropped without affecting `main` or the Razorpay work (which is on a separate branch / already separate commits).
