# Architecture — React (frontend)

Staff UI for restaurants: orders, kitchen, catalog, settings. All business rules are enforced by **ubuteco_api** — this app handles auth, routing, formatting, and UX.

## Data flow

```
page.tsx → hooks / Redux thunks → _services/*.ts → api-fetch.ts → Rails API
                ↓
         AuthGuard / role helpers (client-side only)
```

Real-time kitchen: `useKitchenCable` → AnyCable WebSocket (`CABLE_URL`).

## Auth state

- Redux: `authSlice` + `authThunks` (`signIn`, `fetchCurrentUser`, …)
- Persistence: `localStorage` via `_lib/auth-storage.ts`
- Current user includes nested `organization` when API embeds it

## Multi-tenant UX

- `requiresOrganization()` + `hasOrganization()` in `AuthGuard` → redirect `/forbidden`
- Super admin: read-only catalog mutations blocked via `canMutateOperationalData()` and route guards
- Kitchen-only users: restricted to `/kitchen` and `/settings`

## Appearance

- User preference (not org): Light / Dark / System in Settings
- `AppearanceScript` (beforeInteractive) + `AppearanceProvider`
- CSS variables in `globals.css`; Tailwind `@custom-variant dark`

## Regional settings (plan 02)

- Org-level locale, currency, timezone via `useOrganizationSettings()`
- Formatting: `useMoneyFormat()`, `_lib/format.ts`

## Related docs

- [frontend-map.md](./frontend-map.md)
- [dev-setup.md](../dev-setup.md)
- API architecture: [ubuteco_api/docs/context/architecture.md](../../../ubuteco_api/docs/context/architecture.md)
