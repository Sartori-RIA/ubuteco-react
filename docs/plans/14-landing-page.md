# Plan: Marketing landing page (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** — (optional: public stats or lead capture API later)  
**Branch:** `feature/landing-page`  
**Priority:** P2

---

## Goal

Public marketing site that explains uButeco to bar and restaurant owners, drives sign-ups, and separates **product marketing** from the **authenticated app**. Must be **fully responsive** (mobile, tablet, desktop) — unlike the operational app, which targets desktop only.

---

## Current state

- Root `/` is the authenticated dashboard inside `SidebarLayout`.
- Public routes today: `/login`, `/signup`, `/forgot-password`, `/reset-password` only (`auth-routes.ts`).
- No public homepage, pricing page, or product narrative.
- Sign-up flow already creates org + user — landing CTA can point to `/signup`.

---

## Phase 1 — Routing & shell split

- [ ] Add public route group (e.g. `(marketing)/`) with its own layout — **no** sidebar, no auth guard chrome.
- [ ] Decide entry URLs (recommendation):
  - `/` → landing (logged-out) or redirect to dashboard (logged-in)
  - `/app` or keep dashboard at `/` for authed users via redirect in `page.tsx`
- [ ] Extend `isAuthPublicPath` / `AuthGuard` so marketing pages are public.
- [ ] Header: logo, “Sign in”, primary CTA “Start free” → `/signup`.

**Files:** `src/app/(marketing)/layout.tsx`, `src/app/page.tsx` (or split), `auth-routes.ts`, `AuthGuard.tsx`

---

## Phase 2 — Page content (MVP)

Single long-scroll landing or few sections on one page:

- [ ] **Hero** — headline, subhead, CTA, optional product screenshot/mock.
- [ ] **Problem / solution** — orders, kitchen queue, catalog, multi-tenant org.
- [ ] **Feature blocks** (3–4) — Operations, Menu & catalog, Kitchen, Settings/regional.
- [ ] **Social proof placeholder** — testimonials or “built for bars & restaurants” (copy only until real quotes).
- [ ] **Footer** — links Sign in, Sign up, contact placeholder.

Copy in **pt-BR** first (primary market); **en** optional in same phase or Phase 4.

---

## Phase 3 — Visual design & assets

- [ ] Reuse design tokens (`bg-background`, `text-foreground`, brand blue) for consistency with app.
- [ ] **Responsive layout:** stack sections on mobile, multi-column on `md`/`lg`; readable typography and tap targets on small screens.
- [ ] Hero illustration or screenshot from staging (orders + kitchen).
- [ ] Light mode default; dark mode support if trivial with existing tokens.
- [ ] Favicon / OG meta for link previews (`metadata` in layout).

---

## Phase 4 — i18n & SEO

- [ ] Marketing strings in i18n catalog (`marketing.*`) or static MDX — align with plan 02 locale hook where useful; default pt-BR for anonymous visitors.
- [ ] `metadata`: title, description, Open Graph, locale.
- [ ] Optional: `/en` prefix or `?lang=` — only if needed; defer until copy exists in both languages.

---

## Phase 5 — Analytics & conversion (optional)

- [ ] UTM-friendly signup links.
- [ ] Simple event hooks (CTA clicks) — no third-party until privacy policy exists.
- [ ] Optional waitlist / contact form → API or external form service (out of scope until legal review).

---

## Out of scope (v1)

- Full CMS or blog.
- Custom domain split (marketing `ubuteco.com` vs app `app.…`) — document as future DevOps task.

Note: the **authenticated app** remains desktop-focused (see plan 13); only the **marketing site** requires full responsiveness.

---

## Definition of done

- [ ] Anonymous visitor at `/` sees a polished landing with clear CTA to `/signup`.
- [ ] Authenticated user hitting `/` goes to dashboard (no marketing flash).
- [ ] Marketing pages work without sidebar; app routes unchanged.
- [ ] Layout verified on mobile (~375px), tablet, and desktop breakpoints.
- [ ] Plan linked from [README](./README.md).

---

## References

- `src/app/login/page.tsx`, `src/app/signup/page.tsx` — existing auth UX
- `src/app/_components/SidebarLayout.tsx` — app shell to exclude from marketing
- Plan [02-locale-and-currency](./02-locale-and-currency.md) — i18n patterns
- Plan [03-subscription-plans](./03-subscription-plans.md) — future pricing section
