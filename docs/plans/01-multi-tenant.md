# Plan: Multi-tenant (frontend)

**Status:** completed  
**Project:** ubuteco-react  
**Backend:** [01-multi-tenant.md](../../../ubuteco_api/docs/plans/01-multi-tenant.md)  
**Priority:** P0  
**Branch:** merged via `feature/multi-tenant-complete`

**Tenant model (approved):** shared DB schema + `organization_id` on the API; front does not send tenant id in bodies. Schema-per-tenant is **not** planned — see backend [Architecture decision](../../../ubuteco_api/docs/plans/01-multi-tenant.md#architecture-decision-approved).

**Tenant source of truth:** JWT session user → `auth.user.organization` from API responses. Client never sends `organization_id` on org-scoped creates/updates.

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

## Phase 3 — Super admin

- [x] Platform routes: `/platform` (home), `/platform/organizations` (cross-org list)
- [x] Super admin blocked from org operational routes (`/orders`, `/kitchen`, `/tables`, `/inventory`) → `/platform`
- [x] Org admin `/organizations` unchanged; super admin redirected to platform list

---

## Phase 4 — Tests

- [x] MSW: cross-tenant order GET → 403 → `/forbidden`; create order without `organization_id`
- [x] Kitchen cable: `KitchenChannel` subscription without tenant params (server scopes by JWT org)
- [x] `auth-roles.test.ts`: platform + org operational path guards

---

## Definition of done

- [x] No client sends `organization_id` on create/update except explicit super-admin flows (platform org API only)
- [x] Documented in `docs/plans`, `docs/context/auth-and-roles.md`, and `docs/context/architecture.md`

---

## References

- `src/app/_lib/auth-roles.ts`, `src/app/_components/AuthGuard.tsx`
- `src/app/platform/page.tsx`, `src/app/platform/organizations/page.tsx`
- `src/app/_services/tenant-isolation.integration.test.ts`
- `src/app/_hooks/useKitchenCable.ts`
