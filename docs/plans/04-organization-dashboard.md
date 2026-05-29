# Plan: Organization dashboard (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [04-organization-dashboard.md](../../../ubuteco_api/docs/plans/04-organization-dashboard.md)  
**Priority:** P1

---

## Goal

Admin dashboard page with KPI cards and charts fed by dedicated dashboard API (not order list hacks).

---

## Phase 1 — Routing & access

- [ ] Route `/dashboard` (or `/` for admin landing)
- [ ] `canAccessDashboard` by role (admin, cash_register)
- [ ] Sidebar entry; hide if plan lacks feature (when plans exist)

---

## Phase 2 — Data fetching

- [ ] `dashboardService.fetchSummary({ from, to })`
- [ ] `dashboardService.fetchSeries({ from, to, grain, metric })`
- [ ] Redux slice or React Query with cache keyed by date range
- [ ] Default range: last 7 days; date pickers with org timezone ([02-locale-and-currency](./02-locale-and-currency.md))

---

## Phase 3 — UI components

- [ ] KPI cards: revenue, orders, avg ticket, open orders
- [ ] Line/bar chart: revenue over time (Recharts, Chart.js, or similar — match project stack)
- [ ] Optional pie: items by type
- [ ] Loading / empty / error states
- [ ] Use `formatMoney` / `formatDate` helpers

---

## Phase 4 — Kitchen widget (optional MVP+)

- [ ] Small panel: avg prep time or open dish count (if API `dashboard/kitchen` exists)

---

## Phase 5 — Tests

- [ ] Render dashboard with mocked summary/series
- [ ] Date range change triggers new fetch

---

## Definition of done

- [ ] Dashboard page with at least 4 KPIs + one time-series chart
- [ ] Respects org currency/timezone formatting
- [ ] No N+1 client-side aggregation from raw orders list

---

## Library note

Pick chart library already in deps or add one lightweight dependency; document choice in PR when implementing.
