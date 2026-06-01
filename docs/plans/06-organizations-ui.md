# Plan: Organizations UI

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [Organizations API](../../../ubuteco_api/app/controllers/api/v1/organizations_controller.rb), [02-locale-and-currency](../../../ubuteco_api/docs/plans/02-locale-and-currency.md)  
**Priority:** P1  
**Estimated effort:** 1–1.5 sprints

---

## Goal

Replace the **placeholder** `/organizations` page with a real admin experience: view and edit the current organization (and super-admin list/manage when applicable).

---

## Current state

- `src/app/organizations/page.tsx` — placeholder (`<h1>Tables index page</h1>` — copy-paste error).
- Sidebar links “Organizations” for privileged roles.
- API: `OrganizationsController`, `operational_status` on org.
- Kitchen page already PATCHes `operational_status` for open/closed kitchen.

---

## Phase 1 — Access & routing

- [ ] **Org ADMIN:** `/organizations` → edit **own** org (redirect `/organizations/current` or single org form)
- [ ] **SUPER_ADMIN:** list all orgs (search) + link to detail (future platform API from [01-multi-tenant](../../../ubuteco_api/docs/plans/01-multi-tenant.md))
- [ ] `canManageOrganization(user)` helper in `auth-roles.ts`
- [ ] Guard route; forbidden for kitchen-only staff

---

## Phase 2 — Organization profile UI

- [ ] Show: name, phone, logo, `operational_status`
- [ ] Edit form: name, phone, logo upload (match API multipart patterns from dishes/beers)

---

## Phase 3 — Operational settings

- [ ] Kitchen open/closed toggle (reuse logic from `kitchen/page.tsx` — extract shared hook/component `OrganizationOperationalToggle`)
- [ ] Confirm dialog when closing kitchen (closes open orders on API)
- [ ] When [02-locale-and-currency](./02-locale-and-currency.md) lands: locale, currency, timezone fields here or under settings

---

## Phase 4 — Services & state

- [ ] `organizationsService` — list, show, update (verify existing methods)
- [ ] After update: refresh `auth.user.organization` in Redux
- [ ] Toast success/error patterns (match orders/kitchen)

---

## Phase 5 — Super admin list (if in scope)

- [ ] Paginated table: name, phone, status, created_at
- [ ] Search via API if available
- [ ] Defer create org to registration flow unless product asks

---

## Phase 6 — Tests

- [ ] Role guard: kitchen cannot access `/organizations`
- [ ] Render org form with mocked org
- [ ] Toggle operational status calls API

---

## Definition of done

- [ ] No placeholder page; admin can manage org profile and kitchen status from org UI
- [ ] Shared operational toggle DRY with kitchen page
- [ ] Super admin has list view or documented deferral

---

## References

- `src/app/kitchen/page.tsx` — operational toggle
- `src/app/_services/organizations.service.ts`
- `src/app/_components/SidebarLayout.tsx` — menu visibility
