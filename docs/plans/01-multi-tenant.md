# Plan: Multi-tenant (frontend)

**Status:** in progress (Phases 1–2 done; Phases 3–4 pending)  
**Project:** ubuteco-react  
**Backend:** [01-multi-tenant.md](../../../ubuteco_api/docs/plans/01-multi-tenant.md)  
**Priority:** P0 (after / in parallel with API Phase 1–2)

**Tenant model (approved):** shared DB schema + `organization_id` on the API; front does not send tenant id in bodies. Schema-per-tenant is **not** planned — see backend [Architecture decision](../../../ubuteco_api/docs/plans/01-multi-tenant.md#architecture-decision-approved).

---

## Goal

Frontend must not rely on sending `organization_id` for scoped operations; use the authenticated user’s organization from API responses only.

---

## Phase 1 — Audit API calls

- [x] Grep `organization_id` in services/thunks/forms — no writes send tenant id
- [x] Client already omits `organization_id` on POST/PATCH (orders, users, products)
- [x] Read-only display of org from `auth.user.organization`

---

## Phase 2 — Auth state

- [x] `fetchCurrentUser` hydrates nested `organization` (via AuthHydrator)
- [x] Guard routes: `AuthGuard` redirects to `/forbidden` when org-scoped role lacks organization

---

## Phase 3 — Super admin (future)

- [ ] When platform API exists, separate `/platform/*` routes or admin-only section
- [ ] Do not reuse org-scoped order/kitchen pages for cross-org browsing without org switcher

---

## Phase 4 — Tests

- [ ] MSW/fixtures: user org A cannot request org B resource ids (expect 403 from API)
- [ ] Kitchen cable: subscription uses same session org only

---

## Definition of done

- [ ] No client sends `organization_id` on create/update except explicit super-admin flows (when built)
- [ ] Documented in `docs/plans` and team knows tenant source of truth is JWT user org
