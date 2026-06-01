# Frontend map

## App Router structure

```
src/app/
  layout.tsx          # Server root: fonts, AppearanceScript, Providers
  providers.tsx       # Client: Redux, Auth, Sidebar shell
  globals.css         # Design tokens + dark mode
  page.tsx            # Dashboard (/)
  login/              # Public auth
  settings/           # Profile, appearance, regional settings, …
  kitchen/            # Real-time queue
  orders/             # Order CRUD + items
  beers/ wines/ …     # Catalog CRUD (resource pattern)
  _components/        # Shared UI (Buttons, Card, AuthGuard, …)
  _hooks/             # Reusable hooks
  _lib/               # Pure helpers (auth-roles, format, money, …)
  _services/          # API clients
  _store/             # Redux slices + thunks
  _types/             # TypeScript interfaces
```

## Naming patterns

| Pattern | Example |
|---------|---------|
| List page | `beers/page.tsx` |
| Detail | `beers/[id]/page.tsx` |
| New / edit | `beers/new/page.tsx`, `beers/[id]/edit/page.tsx` |
| Local components | `beers/components/` or colocated |
| API service | `_services/beers.service.ts` |
| Redux feature | `_store/features/beers/` |

## Shared components

Import from `@/app/_components` barrel when possible.

Key shells:

- `SidebarLayout` — authenticated chrome + nav
- `AuthGuard` — auth + org + role redirects
- `AuthHydrator` — restores session on load

## API calls

Always use `apiFetch` — handles base URL, JWT header, JSON errors (`ApiError`).

```typescript
import { apiFetch } from "@/app/_services/api-fetch";
```

## Money and dates

- Prefer `useMoneyFormat()` in client components
- `formatDate` in `_lib/format.ts` for datetimes with org timezone
- `_lib/format-date.ts` — calendar-day parsing for date-only fields (avoid TZ shift on `valid_until`)

## Do not use

- `ubuteco_spa` (Angular) patterns or paths
- Org theme color API (removed; dark mode is user-level)

## Plans

Feature work is tracked in [docs/plans/](../plans/README.md). One branch per plan.
