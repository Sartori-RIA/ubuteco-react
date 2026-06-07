# Plan: Settings — account deletion policy

**Status:** completed  
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

- `canDeleteOwnAccount()` in `auth-roles.ts` — true only for org `ADMIN`.
- Danger zone hidden for kitchen, waiter, cash, super admin; info card with contact message.
- API enforces same policy with `account_deletion_forbidden`.

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

- [x] Add `canDeleteOwnAccount(user)` in `auth-roles.ts`:
  ```ts
  return getRoleName(user) === "ADMIN";
  ```
- [x] Wrap “Danger zone” card: render only when `canDeleteOwnAccount(sessionUser)`
- [x] For non-admins (including `SUPER_ADMIN`): info text — contact administrator / internal support

---

## Phase 2 — Backend (required)

- [x] Implement [10-users-admin-api](../../../ubuteco_api/docs/plans/10-users-admin-api.md) Phase 1 — `403` on self-delete unless org `ADMIN`
- [x] `SUPER_ADMIN` self-delete always forbidden
- [x] Do not rely on UI alone

---

## Phase 3 — Tests

- [x] Unit: `canDeleteOwnAccount` — true only for `ADMIN`
- [ ] Settings: kitchen and super admin do not see danger zone (component test — optional)
- [x] API request spec: kitchen self-delete → 403; super admin self-delete → 403

---

## Definition of done

- [x] Only org `ADMIN` sees delete account on settings
- [x] `SUPER_ADMIN` cannot delete own account (UI + API)
- [x] Kitchen/waiter/cash cannot self-delete
- [x] Org admin self-delete flow unchanged

---

## References

- `src/app/settings/page.tsx` — `handleDeleteAccount`, danger zone UI
- `src/app/_lib/auth-roles.ts`
