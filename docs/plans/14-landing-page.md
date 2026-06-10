# Plan: Marketing landing page (frontend)

**Status:** in progress  
**Project:** ubuteco-react  
**Backend:** — (optional: public stats or lead capture API later)  
**Branch:** `feature/landing-page`  
**Priority:** P2

---

## Goal

Public marketing site that explains uButeco to bar and restaurant owners, drives sign-ups, and separates **product marketing** from the **authenticated app**. Must be **fully responsive** (mobile, tablet, desktop) — unlike the operational app, which targets desktop only.

---

## Phase 1 — Routing & shell split

- [x] Public landing at `/` when logged out — no sidebar (`isMarketingShellPath`)
- [x] Authenticated `/` → dashboard (existing behavior)
- [x] `AuthGuard` + `SidebarLayout` skip app shell for marketing/auth paths
- [x] Header: logo, “Sign in”, primary CTA “Start free” → `/signup`

**Files:** `src/app/_components/marketing/*`, `auth-routes.ts`, `AuthGuard.tsx`, `SidebarLayout.tsx`, `page.tsx`

---

## Phase 2 — Page content (MVP)

- [x] **Hero** — headline, subhead, CTA, kitchen queue mock
- [x] **Problem / solution** — orders, kitchen queue, catalog, multi-tenant org
- [x] **Feature blocks** (4) — Operations, Menu & catalog, Kitchen, Settings/regional
- [x] **Social proof placeholder** — “built for bars & restaurants”
- [x] **Footer** — Sign in, Sign up, contact placeholder

Copy in **pt-BR** (+ en, es, fr in i18n catalog).

---

## Phase 3 — Visual design & assets

- [x] Design tokens (`bg-background`, `text-foreground`, brand blue)
- [x] **Responsive layout:** stack on mobile, grid on `md`/`lg`
- [x] Hero kitchen-board mock (CSS, no external asset)
- [x] Dark mode via existing tokens
- [x] Root `metadata` + OG defaults in `layout.tsx`

---

## Phase 4 — i18n & SEO

- [x] Marketing strings in i18n catalog (`marketing.*`); default locale pt-BR for anonymous visitors
- [x] `metadata`: title, description, Open Graph, `lang="pt-BR"`
- [ ] Optional: `/en` prefix — deferred

---

## Phase 5 — Analytics & conversion (optional)

- [ ] UTM-friendly signup links
- [ ] Simple event hooks (CTA clicks)
- [ ] Contact form — out of scope until legal review

---

## Definition of done

- [x] Anonymous visitor at `/` sees landing with CTA to `/signup`
- [x] Authenticated user at `/` sees dashboard
- [x] Marketing pages work without sidebar; app routes unchanged
- [ ] Layout verified on mobile (~375px), tablet, and desktop breakpoints (manual QA)
- [x] Plan linked from [README](./README.md)

---

## References

- `src/app/_components/marketing/LandingPage.tsx`
- `src/app/login/page.tsx`, `src/app/signup/page.tsx`
- Plan [02-locale-and-currency](./02-locale-and-currency.md)
