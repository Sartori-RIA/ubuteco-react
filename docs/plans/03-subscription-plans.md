# Plan: Subscription plans (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [03-subscription-plans.md](../../../ubuteco_api/docs/plans/03-subscription-plans.md)  
**Priority:** P2

---

## Goal

Show current plan and usage; handle limit errors gracefully; optional upgrade/billing UI.

---

## Phase 1 — Data layer

- [ ] Types: `Plan`, `Subscription`, usage counters
- [ ] Service: `subscriptionsService.getCurrent()`
- [ ] Store slice or extend auth/org state with `subscription`

---

## Phase 2 — Limit UX

- [ ] Parse API errors `plan_limit` / `feature_disabled`
- [ ] Toast + inline message when create user/table blocked
- [ ] Kitchen route: redirect or banner if plan lacks `kitchen` feature

---

## Phase 3 — Settings / billing page

- [ ] `/settings/plan` (admin):
  - Current plan name, renewal date, usage bars (users, tables)
  - Compare plans table
- [ ] v1 manual: “Contact support to upgrade”
- [ ] v2: Stripe Checkout button → redirect URL from API

---

## Phase 4 — Trial & status banners

- [ ] Global banner: trial ends in N days, past_due warning
- [ ] Dismissible per session where appropriate

---

## Phase 5 — Tests

- [ ] Mock 402/403 limit responses on user create
- [ ] Plan page renders usage from fixture

---

## Definition of done (MVP)

- [ ] Admin sees plan + usage
- [ ] Limit errors show clear message
- [ ] Kitchen/locked features hidden or disabled when not entitled
