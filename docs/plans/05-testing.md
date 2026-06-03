# Plan: Frontend testing

**Status:** in progress  
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

- **Vitest** configured with path alias, MSW setup, and 50+ unit/integration tests.
- **GitHub Actions** runs `npm test` + `npm run build` on push/PR.
- E2E (Playwright) not yet added — deferred.

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

- [ ] Settings profile save (mock API)
- [ ] Order add item updates state (mock API)
- [ ] Kitchen page: cable message updates store (mock ActionCable)
- [x] `usersService.fetchAll` with MSW (no `organization_id` in query)

---

## Phase 4 — E2E (smoke)

- [ ] Login → open order → add dish → item in table (API test env or docker)
- [ ] Kitchen: second context or tab receives cable update (optional; flaky — mark optional)

---

## Phase 5 — CI

- [x] GitHub Actions job runs `npm test` and `npm run build`
- [ ] E2E on main only or nightly

---

## Definition of done

- [x] `npm test` runs in CI
- [x] Coverage on kitchen + orders slices and cable parsers
- [ ] At least one E2E happy path documented

---

## References

- `src/test/setup.ts`, `src/test/msw/`
- `src/app/_hooks/useKitchenCable.ts`
- `src/app/_store/features/orders/ordersSlice.ts`
