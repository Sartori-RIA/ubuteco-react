# Plan: Browser document titles

**Status:** completed  
**Project:** ubuteco-react  
**Priority:** P2  
**Estimated effort:** small (0.25–0.5 sprint)

---

## Goal

Every route should show a **human-readable browser tab title** (e.g. `uButeco | Orders`), not the raw URL path (`/orders`, `/beers/42/edit`).

Titles must stay in sync with navigation, including dynamic detail/edit pages once entity data loads.

---

## Current state

| Area | Behavior |
|------|----------|
| Root `layout.tsx` | `metadata.title` default + template |
| ~37/40 `page.tsx` | `"use client"` — `useDocumentTitle` / `useEntityDocumentTitle` |
| `page-titles.ts` | Pathname → label; `formatDocumentTitle` for browser tab |
| `SidebarLayout` | Syncs tab title on navigation for shell routes |
| Browser tab | `uButeco \| …` on static, auth, and entity routes |

---

## Product rule

- **Format:** `uButeco | {Page}` (match existing style pages)
- **Static routes:** segment label from `page-titles.ts` (single source of truth)
- **Dynamic routes:** `{Entity name}` or `{Type} #{id}` when name unavailable yet, e.g. `uButeco | Order #42`, `uButeco | IPA House`
- **Auth routes:** `Sign in`, `Create account`, etc. (no sidebar)
- **Fallback:** `uButeco` (never raw path)

---

## Phase 1 — Shared title helper

- [x] Extend `src/app/_lib/page-titles.ts`:
  - `formatDocumentTitle(label: string): string` → `uButeco | ${label}`
  - `getPageTitle(pathname)` — keep for topbar; `getDocumentTitle(pathname)` for static segments
  - Map sub-routes: `/orders/new` → `New order`, `/beers/new` → `New beer`, `…/edit` → `Edit beer`, etc.
- [x] Unit tests for pathname → title mapping (including dynamic segment patterns)

---

## Phase 2 — Client-side title sync (most pages)

Because most routes are client components, set `document.title` on navigation.

- [x] Add `useDocumentTitle(title: string)` hook (`useEffect` → `document.title`)
- [x] Call from `SidebarLayout` with `usePageTitle()` for all authenticated shell routes
- [x] Auth pages (`login`, `signup`, `forgot-password`, `reset-password`, `forbidden`): title via `SidebarLayout` pathname map
- [x] Verify tab title updates on client navigation without full reload

---

## Phase 3 — Dynamic entity titles

After data fetch on detail/edit pages, override generic title:

| Route pattern | Title when loaded |
|---------------|-------------------|
| `/orders/[id]` | `Order #${id}` or table/customer hint if available |
| `/beers/[id]`, `/wines/…`, etc. | Product/maker/dish **name** |
| `…/[id]/edit` | `Edit {name}` |

- [x] `useEntityDocumentTitle` + per-page hook once Redux has entity
- [x] Loading state: keep static segment title until name resolves (avoid flicker `undefined`)

---

## Phase 4 — Consistency & cleanup

- [x] Server pages (`tables`, `beer-styles`, `wine-styles`) use client title sync — no duplicate `metadata` per page
- [x] Root default metadata in `layout.tsx`
- [x] Topbar h2 unchanged (`usePageTitle()`)

---

## Phase 5 — Tests

- [x] Unit: `getDocumentTitle`, `formatDocumentTitle`, edit/new sub-routes
- [ ] Optional E2E (Playwright): navigate to `/orders`, assert `page.title()` matches `/uButeco \| Orders/`

---

## Definition of done

- [x] No route shows raw URL path in the browser tab
- [x] Static list/settings pages show correct `uButeco | …` title
- [x] Detail pages show entity name (or sensible id fallback) after load
- [x] Single mapping module; no one-off `metadata` strings scattered per page
- [x] Auth and kitchen-only flows covered

---

## References

- `src/app/layout.tsx` — root metadata
- `src/app/_lib/page-titles.ts` — segment map
- `src/app/_hooks/useDocumentTitle.ts` — client sync
- `src/app/_components/SidebarLayout.tsx` — shell routes
