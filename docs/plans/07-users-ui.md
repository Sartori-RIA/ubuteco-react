# Plan: Users admin UI

**Status:** in progress  
**Project:** ubuteco-react  
**Backend:** [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md), existing `UsersController`  
**Branch:** `feature/users-ui`  
**Priority:** P1

---

## Goal

Full **staff user management** for org admins: list, search, create, edit roles, deactivate/delete — aligned with API tenant rules.

---

## Current state

- Full staff CRUD at `/users` for org ADMIN (merged).
- Phase 7 MSW/UI tests partially covered by [05-testing](./05-testing.md) (`usersService` integration).

---

## Phase 1 — Access

- [x] `canManageUsers(user)` — ADMIN (and SUPER_ADMIN for platform list later)
- [x] Hide `/users` from kitchen, waiter (unless product wants waiter read-only — default: admin only)
- [x] Route guard + sidebar filter

---

## Phase 2 — Users list

- [x] Search input → API index with `q` param (Searchkick)
- [x] Table: name, email, role, created_at, actions
- [x] Pagination (Pagy headers from API — match existing list pages pattern e.g. beers)
- [x] Empty state

---

## Phase 3 — Create user

- [x] `/users/new` — name, email, password, role select
- [x] Role options: KITCHEN, WAITER, CASH_REGISTER, ADMIN (not SUPER_ADMIN)
- [x] POST create; success → list or show

---

## Phase 4 — Edit user

- [x] `/users/[id]/edit` — name, email, role, optional password reset
- [x] Cannot edit users outside org (API 403)
- [ ] Admin cannot edit self role to remove last admin (if API guard exists)

---

## Phase 5 — Delete user (admin action)

- [x] Delete button on edit row — confirm dialog
- [x] **Admin deletes staff** (e.g. remove kitchen user) — distinct from self-delete in settings
- [x] Calls `DELETE /users/:id`; handle 403/errors

---

## Phase 6 — Redux / services

- [x] `usersSlice` + thunks (mirror `beers` or `makers` pattern) OR thin page-level fetch
- [x] `usersService` — index, show, create, update, destroy

---

## Phase 7 — Tests

- [ ] List renders with MSW
- [ ] Non-admin redirected from `/users`
- [ ] Create user submits correct payload (no client `organization_id`)

---

## Definition of done

- [x] Admin can CRUD staff in their organization
- [x] Search and pagination work
- [x] Placeholder page removed

---

## References

- `src/app/beers/page.tsx` — list pattern
- `src/app/settings/page.tsx` — profile fields
- `app/models/abilities/admin_ability.rb`
