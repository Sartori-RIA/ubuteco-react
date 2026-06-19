# Auth & roles (UX)

Client-side route and action guards. **Not a security boundary** — API CanCan abilities are authoritative. API reference: [roles-and-access.md](../../../ubuteco_api/docs/context/roles-and-access.md).

## Source of truth (UI)

`src/app/_lib/auth-roles.ts` — pure helpers tested in `auth-roles.test.ts`.

`src/app/_components/AuthGuard.tsx` — redirects based on auth state + helpers.

`src/app/_hooks/useAuthCapabilities.ts` — exposes user + `canMutateOperationalData` to components.

## Role helpers (summary)

| Helper | Who |
|--------|-----|
| `canAccessDashboard` | ADMIN, CASH_REGISTER |
| `canManageUsers` / `isAdminOnlyPath` | ADMIN (`/users/*`) |
| `canDeleteOwnAccount` | ADMIN only (settings) |
| `canAdjustStock` / `canAccessInventory` | ADMIN, CASH_REGISTER (`/inventory`) |
| `canAccessKitchen` | KITCHEN, ADMIN, WAITER, CASH_REGISTER |
| `isKitchenStaff` | KITCHEN — restricted to `/kitchen`, `/settings` |
| `canMutateOperationalData` | All except SUPER_ADMIN |
| `canAccessOrganizations` | ADMIN (own org), SUPER_ADMIN (cross-org list) |
| `requiresOrganization` + `hasOrganization` | Org-scoped roles without org → `/forbidden` |

## AuthGuard redirect rules

1. Unauthenticated → `/login`
2. Org-scoped role without org → `/forbidden`
3. Super admin on operational create/edit paths → list page for that resource
4. Kitchen staff off allowed paths → `/kitchen`
5. Non-admin on `/users` → `/`
6. Non inventory role on `/inventory` → `/`
7. Non org-access on `/organizations` → `/`
8. Non dashboard role on `/` → `/orders` (super admin may view dashboard)

Public/marketing routes: `isMarketingShellPath()` in `_lib/auth-routes.ts` — skip guard.

## JWT storage

- Token + user snapshot: `_lib/auth-storage.ts` (localStorage)
- Redux: `authSlice` + `authThunks` — hydrate via `AuthHydrator`

## Adding a new protected route

1. Add path check helper in `auth-roles.ts` if needed
2. Wire redirect in `AuthGuard.tsx`
3. Hide nav links in sidebar config (`_lib/nav-config.ts`) using same helpers
4. Add tests in `auth-roles.test.ts`
5. Verify API still enforces access (request spec on API side)

## AI pitfalls

- Do not add role checks only in JSX — update `auth-roles.ts` + `AuthGuard` + nav.
- Do not assume waiter can access `/users` or `/inventory`.
- Super admin read-only catalog: list OK, `/new` and `/*/edit` blocked.

## References

- [08-settings-account-deletion.md](../plans/08-settings-account-deletion.md)
- [07-users-ui.md](../plans/07-users-ui.md)
- API: [users-and-platform.md](../../../ubuteco_api/docs/context/users-and-platform.md)
