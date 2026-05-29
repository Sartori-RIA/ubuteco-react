# Plan: Frontend testing

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [08-api-contract-and-ci](../../../ubuteco_api/docs/plans/08-api-contract-and-ci.md)  
**Priority:** P1  
**Estimated effort:** 1 sprint

---

## Goal

Automated tests for critical flows: auth, orders, kitchen realtime, and Redux logic — run in CI.

---

## Current state

- No test runner in `package.json` (no Vitest/Jest/Playwright).
- Manual testing only; regressions on orders/cable already occurred.

---

## Phase 1 — Tooling

- [ ] Choose stack: **Vitest** + **Testing Library** for unit/integration; **Playwright** for E2E (recommended)
- [ ] Scripts: `"test"`, `"test:e2e"`, CI integration
- [ ] MSW for API mocking in unit tests

---

## Phase 2 — Unit tests (priority)

- [ ] `parseKitchenCableMessage`, `normalizeKitchenTicket`
- [ ] `auth-roles` helpers (`canAccessKitchen`, `isKitchenStaff`, …)
- [ ] `kitchenSlice` — `ticketReceived`, loading flags
- [ ] `ordersSlice` — `itemsRefreshRequestId` race fix behavior
- [ ] `formatMoney` / date helpers (when [02-locale-and-currency](./02-locale-and-currency.md) adds them)

---

## Phase 3 — Integration tests

- [ ] Settings profile save (mock API)
- [ ] Order add item updates state (mock API)
- [ ] Kitchen page: cable message updates store (mock ActionCable)

---

## Phase 4 — E2E (smoke)

- [ ] Login → open order → add dish → item in table (API test env or docker)
- [ ] Kitchen: second context or tab receives cable update (optional; flaky — mark optional)

---

## Phase 5 — CI

- [ ] GitHub Actions job runs `npm test` and `npm run build`
- [ ] E2E on main only or nightly

---

## Definition of done

- [ ] `npm test` runs in CI
- [ ] Coverage on kitchen + orders slices and cable parsers
- [ ] At least one E2E happy path documented

---

## References

- `src/app/_hooks/useKitchenCable.ts`
- `src/app/_store/features/orders/ordersSlice.ts`
