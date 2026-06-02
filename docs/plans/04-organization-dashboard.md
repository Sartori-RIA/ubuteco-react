# Plan: Organization dashboard (frontend)

**Status:** in progress  
**Project:** ubuteco-react  
**Backend:** [04-organization-dashboard.md](../../../ubuteco_api/docs/plans/04-organization-dashboard.md)  
**Branch:** `feature/organization-dashboard`  
**Priority:** P1

---

## Goal

Admin dashboard page with KPI cards and charts fed by dedicated dashboard API (not order list hacks).

---

## Phase 1 — Routing & access

- [x] Route `/` for admin/cash_register landing (dashboard)
- [x] `canAccessDashboard` by role (admin, cash_register)
- [x] Sidebar entry hidden for waiter/kitchen; super admin sees platform home at `/`

---

## Phase 2 — Data fetching

- [x] `dashboardService.fetchSummary({ from, to })`
- [x] `dashboardService.fetchSeries({ from, to, grain, metric })`
- [x] Redux `dashboardSlice` with cache keyed by date range
- [x] Default range: last 7 days; date pickers with org timezone

---

## Phase 3 — UI components

- [x] KPI cards: revenue, orders, avg ticket, open orders
- [x] CSS bar chart: revenue over time (no extra chart dependency — lightweight SVG/CSS bars)
- [x] Items-by-type panel (horizontal bars)
- [x] Loading / empty / error states
- [x] Use `formatMoney` / `formatDate` helpers

---

## Phase 4 — Kitchen widget (optional MVP+)

- [ ] Small panel: avg prep time or open dish count (if API `dashboard/kitchen` exists)

---

## Phase 5 — Tests

- [x] Service + date range unit tests
- [x] Role guard: waiter/kitchen nav + auth-roles
- [ ] Render dashboard with mocked summary/series (MSW — optional follow-up)

---

## Definition of done

- [x] Dashboard page with at least 4 KPIs + one time-series chart
- [x] Respects org currency/timezone formatting
- [x] No N+1 client-side aggregation from raw orders list

---

## Library note

MVP uses a lightweight CSS bar chart (no Recharts/Chart.js) to avoid a new dependency; can swap later if needed.
