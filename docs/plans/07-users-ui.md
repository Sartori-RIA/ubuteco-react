# Plan: Users admin UI

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md), existing `UsersController`  
**Priority:** P1  
**Depends on:** [01-multi-tenant](../../../ubuteco_api/docs/plans/01-multi-tenant.md), [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md)  
**Estimated effort:** 1.5–2 sprints

---

## Goal

Full **staff user management** for org admins: list, search, create, edit roles, deactivate/delete — aligned with API tenant rules.

---

## Current state

- `src/app/users/page.tsx` — placeholder (`<h1>Users index page</h1>`).
- Sidebar “Users” for admins.
- API: CRUD + Searchkick index on users in org.
- Settings page: self-service profile for any logged-in user.

---

## Phase 1 — Access

- [ ] `canManageUsers(user)` — ADMIN (and SUPER_ADMIN for platform list later)
- [ ] Hide `/users` from kitchen, waiter (unless product wants waiter read-only — default: admin only)
- [ ] Route guard + sidebar filter

---

## Phase 2 — Users list

- [ ] Search input → API index with `q` param (Searchkick)
- [ ] Table: name, email, role, created_at, actions
- [ ] Pagination (Pagy headers from API — match existing list pages pattern e.g. beers)
- [ ] Empty state

---

## Phase 3 — Create user

- [ ] `/users/new` — name, email, password, role select
- [ ] Role options: KITCHEN, WAITER, CASH_REGISTER, ADMIN (not SUPER_ADMIN)
- [ ] POST create; success → list or show

---

## Phase 4 — Edit user

- [ ] `/users/[id]/edit` — name, email, role, optional password reset
- [ ] Cannot edit users outside org (API 403)
- [ ] Admin cannot edit self role to remove last admin (if API guard exists)

---

## Phase 5 — Delete user (admin action)

- [ ] Delete button on edit row — confirm dialog
- [ ] **Admin deletes staff** (e.g. remove kitchen user) — distinct from self-delete in settings
- [ ] Calls `DELETE /users/:id`; handle 403/errors

---

## Phase 6 — Redux / services

- [ ] `usersSlice` + thunks (mirror `beers` or `makers` pattern) OR thin page-level fetch
- [ ] `usersService` — index, show, create, update, destroy

---

## Phase 7 — Tests

- [ ] List renders with MSW
- [ ] Non-admin redirected from `/users`
- [ ] Create user submits correct payload (no client `organization_id`)

---

## Definition of done

- [ ] Admin can CRUD staff in their organization
- [ ] Search and pagination work
- [ ] Placeholder page removed

---

## References

- `src/app/beers/page.tsx` — list pattern
- `src/app/settings/page.tsx` — profile fields
- `app/models/abilities/admin_ability.rb`
