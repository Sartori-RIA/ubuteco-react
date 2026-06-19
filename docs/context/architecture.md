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

- **Tenant source of truth:** JWT user org from API (`auth.user.organization`) — never send `organization_id` on org-scoped creates/updates
- `requiresOrganization()` + `hasOrganization()` in `AuthGuard` → redirect `/forbidden`
- Super admin: platform console at `/platform` and `/platform/organizations`; blocked from `/orders`, `/kitchen`, `/tables`, `/inventory`
- Super admin: read-only catalog mutations blocked via `canMutateOperationalData()` and route guards
- Kitchen-only users: restricted to `/kitchen` and `/settings`
- Kitchen cable: subscribes to `KitchenChannel` only — server scopes stream by session org

## Appearance

- User preference (not org): Light / Dark / System in Settings
- `AppearanceScript` (beforeInteractive) + `AppearanceProvider`
- CSS variables in `globals.css`; Tailwind `@custom-variant dark`

## Regional settings (plan 02)

- Org-level locale, currency, timezone via `useOrganizationSettings()`
- Formatting: `useMoneyFormat()`, `_lib/format.ts`

## Related docs

- [frontend-map.md](./frontend-map.md)
- [auth-and-roles.md](./auth-and-roles.md)
- [catalog-and-inventory-ui.md](./catalog-and-inventory-ui.md)
- [i18n-and-formatting.md](./i18n-and-formatting.md)
- [testing.md](./testing.md)
- [common-ai-pitfalls.md](./common-ai-pitfalls.md)
- [dev-setup.md](../dev-setup.md)
- API architecture: [ubuteco_api/docs/context/architecture.md](../../../ubuteco_api/docs/context/architecture.md)

## Companion API context (by feature)

| UI area | API context doc |
|---------|-----------------|
| Inventory / stock | [inventory-stock.md](../../../ubuteco_api/docs/context/inventory-stock.md) |
| Orders / kitchen | [orders-lifecycle.md](../../../ubuteco_api/docs/context/orders-lifecycle.md) |
| Users / platform | [users-and-platform.md](../../../ubuteco_api/docs/context/users-and-platform.md) |
| Dashboard | [dashboard.md](../../../ubuteco_api/docs/context/dashboard.md) |
| Search (if exposed) | [search-and-opensearch.md](../../../ubuteco_api/docs/context/search-and-opensearch.md) |
| Locale / money (API) | [i18n-and-money.md](../../../ubuteco_api/docs/context/i18n-and-money.md) |
