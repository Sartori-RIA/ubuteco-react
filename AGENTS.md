# AGENTS.md — ubuteco-react

Instructions for AI assistants working in this repository.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS 4, Redux Toolkit, Font Awesome
- Real-time: `@rails/actioncable` → AnyCable (not Puma directly)

## Backend

All data comes from **[ubuteco_api](../ubuteco_api)** (`/api/v1/...`). See API [AGENTS.md](../ubuteco_api/AGENTS.md) and [docs/context](../ubuteco_api/docs/context/).

Angular `ubuteco_spa` is **abandoned** — do not reference or port from it.

## Before you code

1. Read [docs/plans/README.md](docs/plans/README.md) — pick **one plan**, check status and companion API plan.
2. Read [docs/context/frontend-map.md](docs/context/frontend-map.md) for folder conventions.
3. Read [docs/dev-setup.md](docs/dev-setup.md) for ports and env vars.

## Branching

- **One plan = one branch:** `feature/<plan-slug>` (e.g. `feature/locale-and-currency`).
- Do not mix unrelated plans on the same branch.
- Docs-only changes: `docs/<topic>` (e.g. `docs/ai-context`).

## Do not (unless explicitly asked)

- Commit secrets (`.env`).
- Force-push to `main`.
- Run broad UI refactors outside the active plan scope.
- Reintroduce org theme/color customizer (removed; use user dark mode in settings).

## Conventions

- Server layout: `src/app/layout.tsx` (AppearanceScript + Providers).
- Client providers: `src/app/providers.tsx`.
- Auth: JWT in localStorage; `AuthGuard` + `useAuthCapabilities()`.
- Roles: `src/app/_lib/auth-roles.ts` — mirror API abilities in UX, not as security boundary.
- API calls: `src/app/_services/api-fetch.ts` + domain services.
- Money display: prefer `useMoneyFormat()` / `formatMoney` from `_lib/format.ts` — avoid hardcoded `BRL`/`USD`.
- Dark mode: class `dark` on `<html>`, tokens in `globals.css`.

## Key paths

| Area | Path |
|------|------|
| Plans | `docs/plans/` |
| Context | `docs/context/` |
| Pages | `src/app/**/page.tsx` |
| Shared UI | `src/app/_components/` |
| Hooks | `src/app/_hooks/` |
| Redux | `src/app/_store/` |

## Companion repo

API plans and endpoints: [ubuteco_api/docs/plans](../ubuteco_api/docs/plans/README.md)
