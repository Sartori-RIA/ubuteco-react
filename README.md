# ubuteco-react

[![CI](https://github.com/Sartori-RIA/ubuteco-react/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Sartori-RIA/ubuteco-react/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Sartori-RIA/ubuteco-react/graph/badge.svg)](https://codecov.io/gh/Sartori-RIA/ubuteco-react)
[![Tests](https://img.shields.io/badge/tests-54_passing-brightgreen)](https://github.com/Sartori-RIA/ubuteco-react/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/badge/node-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![API](https://img.shields.io/badge/API-ubuteco__api-CC342D?logo=rubyonrails&logoColor=white)](https://github.com/Sartori-RIA/ubuteco_api)

Staff UI for **uButeco** — orders, kitchen queue, catalog, inventory, and organization settings. Built with **Next.js** (App Router) and **Redux Toolkit**.

### Product surface

Shipped screens. When a plan in [docs/plans/README.md](docs/plans/README.md) is marked completed, add its row here in the same change.

| Area | Where |
|------|--------|
| Dashboard | `/` — KPIs, date range, daily brief, low-stock and expiry counts |
| Orders, kitchen, tables | `/orders`, `/kitchen`, `/tables` |
| Catalog | Beers, drinks, wines, dishes, foods, makers, and their styles |
| Inventory | `/inventory` — stock, expiry, restock suggestions |
| Receive a delivery | `/inventory/intake` — NF-e XML always; photo or PDF when the organization has AI on |
| Label photo | New beer and new wine forms. The button is hidden while AI is off for the organization |
| Catalog CSV | `/catalog/import` — admin only |
| Assistant | Drawer in the app shell |
| Settings | `/settings` — profile, password, appearance, regional settings, AI opt-in |
| Support | Organization screen. A super admin can open a session as a staff user |
| Auth | Sign-in, sign-up, forgot/reset password. New passwords follow the API policy (12+ characters) |

Semantic menu search has no separate screen. The API uses embeddings when `VOYAGE_API_KEY` is set and otherwise stays on keyword search.

> **Badges:** CI runs on every push/PR. Coverage is reported to [Codecov](https://codecov.io/gh/Sartori-RIA/ubuteco-react) (scoped to business-logic modules — see `vitest.config.ts`).

The previous Angular app ([ubuteco_spa](https://github.com/Sartori-RIA/ubuteco_spa)) is **abandoned**. New features and fixes belong here only.

## Architecture

Business rules live in **[ubuteco_api](https://github.com/Sartori-RIA/ubuteco_api)**. This app handles auth, routing, formatting, and UX.

```
page.tsx → hooks / Redux thunks → _services/*.ts → api-fetch.ts → Rails API
                ↓
         AuthGuard / role helpers (client-side only)
```

Kitchen real-time updates: `useKitchenCable` → AnyCable WebSocket (`CABLE_URL`).

### Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15+ (App Router) |
| State | Redux Toolkit (`_store/features/*`) |
| Styling | Tailwind CSS + CSS variables (light/dark) |
| i18n | Org locale via `useTranslations()` + message catalogs (`_lib/i18n/`) |
| Money / dates | Org currency & timezone via `useMoneyFormat()` / `_lib/format.ts` |
| API | JWT in `Authorization` header; `apiFetch` wrapper |

### Folder layout

```
src/app/
  layout.tsx, providers.tsx   # Root shell, Redux, auth hydration
  page.tsx                    # Dashboard (/)
  login/, signup/, …          # Public routes
  orders/, kitchen/, beers/…  # Feature routes (list / [id] / new / edit)
  inventory/, catalog/import/ # Stock, delivery intake, CSV import
  settings/                   # Profile, password, appearance, regional settings, AI opt-in
  _components/                # Shared UI (Buttons, Card, AuthGuard, SidebarLayout, …)
  _hooks/                     # useAuthCapabilities, useMoneyFormat, useTranslations, …
  _lib/                       # Pure helpers (auth-roles, format, i18n, appearance)
  _services/                  # API clients + api-fetch.ts
  _store/                     # Redux slices and thunks
  _types/                     # TypeScript interfaces
```

Naming pattern per resource: `beers/page.tsx` (list), `beers/[id]/page.tsx` (detail), `beers/new/page.tsx`, `_store/features/beers/`, etc.

### Auth & multi-tenant UX

- Session: Redux `authSlice` + JWT in `localStorage` (`_lib/auth-storage.ts`)
- `AuthGuard` — unauthenticated → `/login`; org-scoped role without org → `/forbidden`
- `useAuthCapabilities()` — kitchen-only routes, super-admin read-only catalog, operational mutations
- Appearance (light / dark / system) is **user-level**; locale/currency/timezone are **org-level**

Full detail: [docs/context/architecture.md](docs/context/architecture.md) · [docs/context/frontend-map.md](docs/context/frontend-map.md)

## Getting started

See [docs/dev-setup.md](docs/dev-setup.md) for env vars, API URL, and ports.

```bash
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001). The API defaults to port 3000 (see dev-setup).

```bash
npm run build    # production build
npm test         # vitest
npm run test:coverage  # vitest + coverage report
npm run lint     # eslint
```

## Docs

| Doc | Purpose |
|-----|---------|
| [AGENTS.md](AGENTS.md) | Instructions for AI assistants |
| [CLAUDE.md](CLAUDE.md) | Claude Code entry (→ AGENTS.md) |
| [docs/plans/README.md](docs/plans/README.md) | Feature plans + status tracker |
| [docs/backlog/](docs/backlog/) | Small bugs and UX fixes |
| [docs/dev-setup.md](docs/dev-setup.md) | Local development |
| [docs/context/](docs/context/) | Architecture, auth, i18n, testing, pitfalls |

## Improvement plans

Tracked in [docs/plans/README.md](docs/plans/README.md) — locale, app shell, landing page, testing, dashboard, and more. One `feature/<slug>` branch per plan; plan doc updates go to `main`.
