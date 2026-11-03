# Plan: AI daily brief card (frontend)

**Status:** completed  
**Project:** ubuteco-react  
**Backend:** [18-ai-daily-brief](../../../ubuteco_api/docs/plans/18-ai-daily-brief.md)  
**Branch:** `feature/ai-daily-brief`  
**Priority:** P2  
**Depends on:** [04-organization-dashboard](./04-organization-dashboard.md), [16-ai-settings](./16-ai-settings.md), API plan 18 Phase 3  
**Estimated effort:** 0.25–0.5 sprint

---

## Goal

Show the daily brief paragraph at the top of the organization dashboard, so the owner reads the day in 10 seconds before looking at charts.

---

## Product decisions (lock before coding)

| Decision | Recommendation (v1) |
|----------|---------------------|
| Placement | Card in `OrganizationDashboard` directly under the page title and **above** `DashboardDateRange`. Above the KPIs but under the date control reads as if the brief followed the selected range. |
| Who | Same as dashboard (`canAccessDashboard()`) |
| AI off | Still show the card — API returns `source: "template"` text. Card is useful without AI. |
| Source label | Small badge "AI-generated" only when `source === "ai"` |
| Refresh | Icon button → `?refresh=1`; disabled for 60 s after click |
| Independence from date range | Brief is always "yesterday + today", **not** tied to `DashboardDateRange` — say so in the card subtitle |
| Failure | Card hides itself on error (dashboard must never break because of the brief) |

---

## Out of scope

- Email/push brief
- Expandable "see the numbers" view (the `facts` payload) — v2

---

## Phase 1 — Service & state

- [x] `dashboardService.fetchBrief({refresh?})` → `GET /api/v1/dashboard/brief`
- [x] Type `DashboardBrief { text, source: "ai" | "template", generated_at }`
- [x] Add `brief` + `briefLoading` to `dashboardSlice`; separate thunk (not part of `fetchAll`, which depends on the date range)
- [x] MSW handler (ai + template variants)

---

## Phase 2 — Card

- [x] `src/app/dashboard/components/DailyBriefCard.tsx` using `Card`
- [x] Skeleton while loading; text as plain paragraphs (no HTML)
- [x] "AI-generated" badge + generated time via `formatDate` (org timezone)
- [x] Refresh button with cooldown

**Acceptance:** renders template text when AI disabled; hidden on API error; refresh triggers one request.

---

## Phase 3 — Tests & i18n

- [x] Component tests: ai source, template source, error hidden, refresh cooldown
- [x] i18n keys `dashboard.brief.*` in `pt-BR`, `en`, `es`, `fr`

---

## Definition of done

- [x] Brief card visible on dashboard for allowed roles
- [x] Works with AI on (badge) and off (template)
- [x] Lint, tests, build pass

---

## References

- `src/app/dashboard/OrganizationDashboard.tsx`
- `src/app/dashboard/components/DashboardKpiCards.tsx`
- `src/app/_services/dashboard.service.ts`, `src/app/_store/features/dashboard/`
- API: [18-ai-daily-brief](../../../ubuteco_api/docs/plans/18-ai-daily-brief.md)
