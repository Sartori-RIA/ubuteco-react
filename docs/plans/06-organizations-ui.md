# Plan: Organizations UI

**Status:** completed  
**Branch:** `feature/organizations-ui` (merged)  
**Priority:** P1  
**Estimated effort:** 1–1.5 sprints

---

## Goal

Replace the **placeholder** `/organizations` page with a real admin experience: view and edit the current organization (and super-admin list/manage when applicable).

---

## Current state

- `src/app/organizations/page.tsx` — admin profile + super-admin list (replaces placeholder).
- Sidebar “Organizations” for org ADMIN and SUPER_ADMIN (administration group).
- API: `OrganizationsController`, `operational_status` on org; platform list at `v1/platform/organizations`.
- Kitchen page uses shared `OrganizationOperationalToggle`.

---

## Phase 1 — Access & routing

- [x] **Org ADMIN:** `/organizations` → edit **own** org (single org form)
- [x] **SUPER_ADMIN:** list all orgs (search) + link to detail at `/organizations/[id]`
- [x] `canManageOrganization(user)` helper in `auth-roles.ts`
- [x] Guard route; forbidden for kitchen-only staff and non-admin roles

---

## Phase 2 — Organization profile UI

- [x] Show: name, phone, logo, `operational_status`
- [x] Edit form: name, phone, logo upload (multipart PATCH)

---

## Phase 3 — Operational settings

- [x] Kitchen open/closed toggle — shared `OrganizationOperationalToggle` + `useOrganizationOperationalToggle`
- [x] Confirm dialog when closing kitchen (closes open orders on API)
- [x] Locale, currency, timezone via reused `LocaleSettings` on org admin page (also in settings)

---

## Phase 4 — Services & state

- [x] `organizationsService` — paginated index, show, update, updateForm
- [x] `platformOrganizationsService` — super-admin list/show/update
- [x] After update: refresh `auth.user.organization` in Redux
- [x] Toast success/error patterns (match kitchen)

---

## Phase 5 — Super admin list

- [x] Paginated table: name, phone, status, created_at
- [x] Search via API (`q` param)
- [x] Defer create org to registration flow

---

## Phase 6 — Tests

- [x] Role guard: kitchen cannot access `/organizations` (nav + auth-roles)
- [x] Operational toggle hook calls API
- [ ] Render org form with mocked org (MSW — optional follow-up)

---

## Definition of done

- [x] No placeholder page; admin can manage org profile and kitchen status from org UI
- [x] Shared operational toggle DRY with kitchen page
- [x] Super admin has list view + detail edit via platform API

---

## References

- `src/app/kitchen/page.tsx` — operational toggle (uses shared component)
- `src/app/_services/organizations.service.ts`
- `src/app/_services/platform-organizations.service.ts`
- `src/app/_components/SidebarLayout.tsx` — menu visibility
