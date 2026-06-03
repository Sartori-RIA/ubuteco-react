# Plan: Organization dashboard (frontend)

**Status:** completed  
**Project:** ubuteco-react  
**Backend:** [04-organization-dashboard.md](../../../ubuteco_api/docs/plans/04-organization-dashboard.md)  
**Branch:** `feature/organization-dashboard`  
**Priority:** P1

---

## Phase 4 — Kitchen widget

- [x] `KitchenPanel`: open dish count + avg prep time from `dashboard/kitchen`

---

## Phase 5 — Tests

- [x] Service + date range + duration format unit tests
- [x] Role guard: waiter/kitchen nav + auth-roles
- [ ] Render dashboard with mocked summary/series (MSW — optional follow-up)

---

## Definition of done

- [x] Dashboard page with at least 4 KPIs + one time-series chart + kitchen panel
- [x] Respects org currency/timezone formatting
- [x] No N+1 client-side aggregation from raw orders list
