# Plan: Frontend performance

**Status:** completed  
**Project:** ubuteco-react  
**Priority:** P2  
**Estimated effort:** ongoing (1 sprint for first pass)

**Branch:** merged via [#33](https://github.com/Sartori-RIA/ubuteco-react/pull/33)

---

## Goal

Faster perceived load, fewer unnecessary re-renders and network calls, especially on orders, kitchen (cable), and catalog lists.

---

## Current state

- Next.js 16 App Router, React 19, Redux Toolkit, React Compiler enabled (`reactCompiler: true`).
- Kitchen: fixed flicker issues (auth loop, cable reload); cable stable.
- Orders: race handling with `itemsRefreshRequestId`; list cache TTL on page-1 `fetchAll`.
- Auth: `fetchCurrentUser` deduped (30s TTL + in-flight guard).

---

## Shipped (first pass — Jun 2026, PR #33)

| Optimization | Area |
|--------------|------|
| `fetchCurrentUser` TTL (30s) + in-flight dedup | Auth / navigation |
| Kitchen page no longer refetches user (relies on `AuthHydrator`) | Kitchen |
| Orders list cache TTL (60s) on page-1 `fetchAll` | Orders list |
| `memo` + column grouping `useMemo` on kitchen board/cards | Kitchen rendering |

---

## Phase 1 — Measure

- [ ] Lighthouse on `/orders`, `/kitchen`, `/orders/[id]` (local prod build) — *deferred*
- [ ] React DevTools Profiler on add-item flow — *deferred*
- [ ] Next.js `bundle-analyzer` (one-off) — *deferred*
- [ ] Record baseline metrics in this file — *deferred*

---

## Phase 2 — Data fetching

- [x] Avoid duplicate `fetchCurrentUser` on every navigation (audit `AuthGuard`, layout effects)
- [x] Orders list: stable pagination; don’t refetch full list when returning from detail if cache fresh (RTK cache TTL or keep slice)
- [x] Kitchen: no polling (already removed); confirm no stray `fetchTickets` on cable events except `ticketReceived`
- [ ] Prefetch order detail on list row hover (optional — *deferred*)

---

## Phase 3 — Rendering

- [ ] Split heavy pages: dynamic import for charts ([04-organization-dashboard](./04-organization-dashboard.md)) — *deferred*
- [x] Memoize expensive list rows (`KitchenBoard`, order line items)
- [x] Review `useKitchenCable` deps — stable callbacks (`useCallback` refs already used)
- [x] FontAwesome: per-icon imports (no full pack in use)

---

## Phase 4 — Network & assets

- [x] Image sizes: `sizes` prop on `ProductImage`; CDN/API host in `next.config` remotePatterns
- [x] API: request parallelization where sequential (`Promise.all` on order show — already on add item)
- [x] Debounce search inputs on list pages (users, beers, …)

---

## Phase 5 — Next.js config

- [ ] Review `reactStrictMode` double-mount in dev — *deferred*
- [ ] Production compression / static generation audit — *deferred*

---

## Phase 6 — Monitoring (prod)

- [ ] Web Vitals reporting — *deferred*
- [ ] Error boundary on main layouts — *deferred*

---

## Anti-patterns to avoid

- Refetch entire order on every cable message when slice merge suffices
- Putting `user.organization` in effect deps causing auth loops (kitchen lesson)

---

## Definition of done (first pass)

- [x] At least 3 concrete optimizations shipped (PR #33)
- [x] No regression on kitchen live updates
- [x] First-pass scope accepted; measurement/monitoring items deferred to backlog

---

## References

- `next.config.ts`
- `src/app/kitchen/page.tsx`, `src/app/orders/[id]/page.tsx`
- `src/app/_hooks/useKitchenCable.ts`
- `src/app/_store/features/auth/auth-fetch-cache.ts`
- `src/app/_store/features/orders/orders-list-cache.ts`
