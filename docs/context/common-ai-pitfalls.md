# Common AI pitfalls — ubuteco-react

Lessons from real mistakes when using agents on this frontend. Read before large changes.

## Legacy & scope

| Pitfall | Correct approach |
|---------|------------------|
| Port from Angular `ubuteco_spa` | **Abandoned.** Follow App Router patterns in [frontend-map.md](./frontend-map.md). |
| Reintroduce org theme/color customizer | Removed — user-level dark mode in Settings only. |
| Broad refactors outside active plan | One plan → `feature/<slug>` → one PR. |
| Implement business rules only in UI | API enforces auth and domain — UI mirrors UX; see API [roles-and-access](../../../ubuteco_api/docs/context/roles-and-access.md). |

## Multi-tenant & auth

| Pitfall | Correct approach |
|---------|------------------|
| Send `organization_id` in POST/PATCH bodies | Omit tenant id — API scopes from JWT. See plan [01-multi-tenant](../plans/01-multi-tenant.md). |
| Rely on `AuthGuard` as security | Client guards are UX only — API must enforce. |
| Skip `auth-roles.ts` when adding routes | Update helpers + `AuthGuard` + tests in `auth-roles.test.ts`. |
| Super admin editing catalog | Block mutations via `canMutateOperationalData()` + `isOperationalMutationPath()`. |

## API & errors

| Pitfall | Correct approach |
|---------|------------------|
| Raw `fetch` to Rails | Use `apiFetch` from `_services/api-fetch.ts`. |
| Hardcode API base URL | `NEXT_PUBLIC_API_URL` — see [dev-setup.md](../dev-setup.md). |
| Assume string-array API errors | API returns structured `{ errors: [{ code, field?, message }] }` — use `resolveApiErrorMessages` / `localize-form-errors`. |
| Invent endpoints | Check API OpenAPI or companion plan in [ubuteco_api/docs/plans](../../../ubuteco_api/docs/plans/README.md). |

## i18n & formatting

| Pitfall | Correct approach |
|---------|------------------|
| Hardcode `BRL`, `USD`, or English strings | `useMoneyFormat()`, `_lib/i18n/messages/*` — see [i18n-and-formatting.md](./i18n-and-formatting.md). |
| Parse `valid_until` as UTC datetime | Use `_lib/format-date.ts` (`toDateInputValue`, calendar-day) to avoid TZ shift. |
| Add locale without updating all message files | Update `pt-BR`, `en`, `es` at minimum (and `fr` if nav/settings strings exist). |

## Next.js / React

| Pitfall | Correct approach |
|---------|------------------|
| Hydration mismatch on public pages | Server/client must agree on initial render — see landing plan fixes. |
| `useEffect` setState without guard | Follow ESLint `react-hooks` rules; CI fails on violations. |
| Put server-only logic in client components | App Router: keep `"use client"` boundary clear; layout/providers pattern in [architecture.md](./architecture.md). |
| Skip tests for TS/TSX changes | Run `npm test`; add MSW handler when adding API calls. |

## Process

| Pitfall | Correct approach |
|---------|------------------|
| Open PR without updating plan | Update plan + `docs/plans/README.md` on same branch. |
| Skip quality gates | `npm run lint`, `npm test`, `npm run test:coverage`, `npm run build` before push. |
| Plan README status ≠ plan header | Run `bin/plans_drift_check` after editing plan docs. |
| Cross-stack feature without companion PR | Link API PR in React PR body when endpoints change. |

## When to read API context

| Working on | Read (API repo) |
|------------|-----------------|
| Inventory / stock UI | [inventory-stock.md](../../../ubuteco_api/docs/context/inventory-stock.md) |
| Orders / kitchen | [orders-lifecycle.md](../../../ubuteco_api/docs/context/orders-lifecycle.md) |
| Users / settings delete | [users-and-platform.md](../../../ubuteco_api/docs/context/users-and-platform.md) |
| Dashboard charts | [dashboard.md](../../../ubuteco_api/docs/context/dashboard.md) |
| Locale / money API fields | [i18n-and-money.md](../../../ubuteco_api/docs/context/i18n-and-money.md) |
