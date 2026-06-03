# Plan: Frontend testing

**Status:** completed  
**Project:** ubuteco-react  
**Backend:** [08-api-contract-and-ci](../../../ubuteco_api/docs/plans/08-api-contract-and-ci.md)  
**Branch:** `feature/testing`  
**Priority:** P1  
**Estimated effort:** 1 sprint

---

## Goal

Automated tests for critical flows: auth, orders, kitchen realtime, and Redux logic — run in CI.

---

## Current state

- **Vitest** configured with path alias, MSW setup, and 55+ unit/integration tests.
- **GitHub Actions** runs `npm ci`, `npm test`, and `npm run build` on push/PR.
- **Playwright E2E** deferred — manual smoke path documented below.

---

## Phase 1 — Tooling

- [x] Stack: **Vitest** + **Testing Library** (jsdom) for unit/integration; **Playwright** deferred for E2E
- [x] Scripts: `"test"`, `"test:watch"`, `"test:coverage"`
- [x] MSW for API mocking (`src/test/msw/`)

---

## Phase 2 — Unit tests (priority)

- [x] `parseKitchenCableMessage`, `normalizeKitchenTicket`
- [x] `auth-roles` helpers (`canAccessKitchen`, `canAccessDashboard`, …)
- [x] `kitchenSlice` — `ticketReceived`, cable connection flag
- [x] `ordersSlice` — `itemsRefreshRequestId` race fix behavior
- [x] `formatMoney` / date helpers ([02-locale-and-currency](./02-locale-and-currency.md))

---

## Phase 3 — Integration tests

- [x] Settings profile save (mock API) — `usersService.updateProfile`
- [x] Order add item updates state (mock API) — `ordersThunks.addOrderItem` + store
- [x] Kitchen page: cable message updates store — `applyKitchenCableMessage` + `ticketReceived`
- [x] `usersService.fetchAll` with MSW (no `organization_id` in query)

---

## Phase 4 — E2E (smoke)

- [ ] Login → open order → add dish → item in table (Playwright — deferred)
- [ ] Kitchen: second context or tab receives cable update (optional; flaky — deferred)

### Manual E2E happy path (until Playwright)

1. Start API + Redis (`CABLE_ADAPTER=redis`) and React (`npm run dev`).
2. Log in as waiter → **Orders** → open an open order.
3. Add a dish → confirm row appears in items table and total updates.
4. Open **Kitchen** in another browser/profile → confirm new ticket appears (ActionCable).

---

## Phase 5 — CI

- [x] GitHub Actions job runs `npm test` and `npm run build`
- [ ] E2E on main only or nightly (deferred with Playwright)

---

## Definition of done

- [x] `npm test` runs in CI
- [x] Coverage on kitchen + orders slices and cable parsers
- [x] At least one E2E happy path documented (manual smoke above)

---

## References

- `src/test/setup.ts`, `src/test/msw/`
- `src/app/kitchen/_lib/apply-kitchen-cable-message.ts`
- `src/app/_hooks/useKitchenCable.ts`
- `src/app/_store/features/orders/ordersSlice.ts`
- `.github/workflows/ci.yml`
