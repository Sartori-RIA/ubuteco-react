# Plan: Settings — account deletion policy

**Status:** not started  
**Project:** ubuteco-react (primary)  
**Backend:** [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md)  
**Priority:** P1  
**Estimated effort:** small (0.5 sprint with API)

---

## Goal

**Hide “Delete my account”** on `/settings` for everyone **except org `ADMIN`**, so kitchen/waiter/cash staff cannot remove their own login by mistake.

**`SUPER_ADMIN` must not delete their own account** — they are internal uButeco operators, not organization members; account lifecycle is handled outside self-service settings.

Org admins may delete their own account from settings; staff removal remains an **admin action** on [Users UI](./07-users-ui.md).

---

## Current state

- `src/app/settings/page.tsx` — “Danger zone” with delete account **visible to everyone** (lines 268–309).
- `usersService.destroy(sessionUser.id)` on confirm.
- API: `can_manage_self` allows `:destroy` on own user for any role.

---

## Product rule (approved)

| Role | Delete own account on Settings | Notes |
|------|--------------------------------|-------|
| ADMIN | Yes | Organization owner/admin |
| SUPER_ADMIN | **No** | Internal uButeco user; no self-service deletion |
| KITCHEN, WAITER, CASH_REGISTER, CUSTOMER | **No** | Contact org admin |

Staff who need removal → org **ADMIN** uses Users UI delete.  
`SUPER_ADMIN` provisioning/deprovisioning → platform process (another super admin or ops), not `/settings`.

---

## Phase 1 — Frontend

- [ ] Add `canDeleteOwnAccount(user)` in `auth-roles.ts`:
  ```ts
  return getRoleName(user) === "ADMIN";
  ```
- [ ] Wrap “Danger zone” card: render only when `canDeleteOwnAccount(sessionUser)`
- [ ] For non-admins (including `SUPER_ADMIN`): optional info text — “Contact your administrator to remove your account.” / super admin: internal support channel

---

## Phase 2 — Backend (required)

- [ ] Implement [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md) Phase 1 — `403` on self-delete unless org `ADMIN`
- [ ] `SUPER_ADMIN` self-delete always forbidden
- [ ] Do not rely on UI alone

---

## Phase 3 — Tests

- [ ] Unit: `canDeleteOwnAccount` — true only for `ADMIN`
- [ ] Settings: kitchen and super admin do not see danger zone
- [ ] API request spec: kitchen self-delete → 403; super admin self-delete → 403

---

## Definition of done

- [ ] Only org `ADMIN` sees delete account on settings
- [ ] `SUPER_ADMIN` cannot delete own account (UI + API)
- [ ] Kitchen/waiter/cash cannot self-delete
- [ ] Org admin self-delete flow unchanged

---

## References

- `src/app/settings/page.tsx` — `handleDeleteAccount`, danger zone UI
- `src/app/_lib/auth-roles.ts`
