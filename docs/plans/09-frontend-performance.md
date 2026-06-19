# Plan: Frontend performance

**Status:** in progress  
**Project:** ubuteco-react  
**Priority:** P2  
**Estimated effort:** ongoing (1 sprint for first pass)

**Branch:** `feature/frontend-performance`

---

## Goal

Faster perceived load, fewer unnecessary re-renders and network calls, especially on orders, kitchen (cable), and catalog lists.

---

## Current state

- Next.js 16 App Router, React 19, Redux Toolkit, React Compiler enabled (`reactCompiler: true`).
- Kitchen: fixed flicker issues (auth loop, cable reload); cable stable.
- Orders: race handling with `itemsRefreshRequestId`.
- No bundle analysis documented; images via `next/image` in places.

---

## Shipped (first pass — Jun 2026)

| Optimization | Area |
|--------------|------|
| `fetchCurrentUser` TTL (30s) + in-flight dedup | Auth / navigation |
| Kitchen page no longer refetches user (relies on `AuthHydrator`) | Kitchen |
| Orders list cache TTL (60s) on page-1 `fetchAll` | Orders list |
| `memo` + column grouping `useMemo` on kitchen board/cards | Kitchen rendering |

---

## Phase 1 — Measure

- [ ] Lighthouse on `/orders`, `/kitchen`, `/orders/[id]` (local prod build)
- [ ] React DevTools Profiler on add-item flow
- [ ] Next.js `bundle-analyzer` (one-off) — identify heavy imports (FontAwesome, motion)
- [ ] Record baseline metrics in this file when done

---

## Phase 2 — Data fetching

- [x] Avoid duplicate `fetchCurrentUser` on every navigation (audit `AuthGuard`, layout effects)
- [x] Orders list: stable pagination; don’t refetch full list when returning from detail if cache fresh (RTK cache TTL or keep slice)
- [x] Kitchen: no polling (already removed); confirm no stray `fetchTickets` on cable events except `ticketReceived`
- [ ] Prefetch order detail on list row hover (optional)

---

## Phase 3 — Rendering

- [ ] Split heavy pages: dynamic import for charts ([04-organization-dashboard](./04-organization-dashboard.md))
- [x] Memoize expensive list rows (`KitchenBoard`, order line items)
- [x] Review `useKitchenCable` deps — stable callbacks (`useCallback` refs already used)
- [ ] FontAwesome: import individual icons only (already per-icon imports — verify no full pack)

---

## Phase 4 — Network & assets

- [x] Image sizes: `sizes` prop on `ProductImage`; CDN/API host in `next.config` remotePatterns
- [x] API: request parallelization where sequential (`Promise.all` on order show — already on add item)
- [x] Debounce search inputs on list pages (users, beers, …)

---

## Phase 5 — Next.js config

- [ ] Review `reactStrictMode` double-mount in dev (acceptable); document cable reconnect behavior
- [ ] Production: enable compression, verify static generation for login/marketing pages if any

---

## Phase 6 — Monitoring (prod)

- [ ] Web Vitals reporting (Vercel analytics or custom)
- [ ] Error boundary on main layouts

---

## Anti-patterns to avoid

- Refetch entire order on every cable message when slice merge suffices
- Putting `user.organization` in effect deps causing auth loops (kitchen lesson)

---

## Definition of done (first pass)

- [ ] Baseline Lighthouse scores recorded
- [~] At least 3 concrete optimizations shipped (list in PR)
- [x] No regression on kitchen live updates

---

## References

- `next.config.ts`
- `src/app/kitchen/page.tsx`, `src/app/orders/[id]/page.tsx`
- `src/app/_hooks/useKitchenCable.ts`
- `src/app/_store/features/auth/auth-fetch-cache.ts`
- `src/app/_store/features/orders/orders-list-cache.ts`
