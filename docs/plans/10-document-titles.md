# Plan: Browser document titles

**Status:** not started  
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
| Root `layout.tsx` | `"use client"` — default `metadata` is **commented out** |
| ~37/40 `page.tsx` | `"use client"` — cannot export static `metadata` |
| 3 server pages only | `tables`, `beer-styles`, `wine-styles` export `title: "uButeco \| …"` |
| `page-titles.ts` | Maps pathname → label for **in-app topbar** (`SidebarLayout` h2) only |
| Browser tab | No `document.title` updates → Next/default shows **URL-like titles** on most routes |

In-app heading and browser title are **decoupled** today; fixing the topbar alone is not enough.

---

## Product rule

- **Format:** `uButeco | {Page}` (match existing style pages)
- **Static routes:** segment label from `page-titles.ts` (single source of truth)
- **Dynamic routes:** `{Entity name}` or `{Type} #{id}` when name unavailable yet, e.g. `uButeco | Order #42`, `uButeco | IPA House`
- **Auth routes:** `Sign in`, `Create account`, etc. (no sidebar)
- **Fallback:** `uButeco` (never raw path)

---

## Phase 1 — Shared title helper

- [ ] Extend `src/app/_lib/page-titles.ts`:
  - `formatDocumentTitle(label: string): string` → `uButeco | ${label}`
  - `getPageTitle(pathname)` — keep for topbar; add `getDocumentTitle(pathname)` for static segments
  - Map sub-routes: `/orders/new` → `New order`, `/beers/new` → `New beer`, `…/edit` → `Edit beer`, etc.
- [ ] Unit tests for pathname → title mapping (including dynamic segment patterns)

---

## Phase 2 — Client-side title sync (most pages)

Because most routes are client components, set `document.title` on navigation.

- [ ] Add `useDocumentTitle(title: string)` hook (`useEffect` → `document.title`, restore optional on unmount)
- [ ] Call from `SidebarLayout` with `formatDocumentTitle(getPageTitle(pathname))` for all authenticated shell routes
- [ ] Auth pages (`login`, `signup`, `forgot-password`, `reset-password`, `forbidden`): call hook with static labels (no sidebar)
- [ ] Verify tab title updates on client navigation without full reload

**Alternative (preferred long-term):** split root layout — server `layout.tsx` with `metadata.title.template = "%s | uButeco"` + client `Providers.tsx` for Redux/auth. Keeps default for any future server pages. Can combine with Phase 2 for client-only routes.

---

## Phase 3 — Dynamic entity titles

After data fetch on detail/edit pages, override generic title:

| Route pattern | Title when loaded |
|---------------|-------------------|
| `/orders/[id]` | `Order #${id}` or table/customer hint if available |
| `/beers/[id]`, `/wines/…`, etc. | Product/maker/dish **name** |
| `…/[id]/edit` | `Edit {name}` |

- [ ] Small helper or per-page `useDocumentTitle(formatDocumentTitle(name))` once Redux/query has entity
- [ ] Loading state: keep static segment title until name resolves (avoid flicker `undefined`)

---

## Phase 4 — Consistency & cleanup

- [ ] Remove duplicate `export const metadata` from `tables`, `beer-styles`, `wine-styles` **or** migrate them to shared layout metadata (avoid two sources)
- [ ] Uncomment / implement root default:
  ```ts
  export const metadata: Metadata = {
    title: { default: "uButeco", template: "uButeco | %s" },
  };
  ```
  (only after server/client layout split)
- [ ] Align topbar h2 with document title where both show the same static label (optional: topbar shows short label without prefix)

---

## Phase 5 — Tests

- [ ] Unit: `getDocumentTitle`, `formatDocumentTitle`, edit/new sub-routes
- [ ] Optional E2E (Playwright): navigate to `/orders`, assert `page.title()` matches `/uButeco \| Orders/`

---

## Definition of done

- [ ] No route shows raw URL path in the browser tab
- [ ] Static list/settings pages show correct `uButeco | …` title
- [ ] Detail pages show entity name (or sensible id fallback) after load
- [ ] Single mapping module; no one-off `metadata` strings scattered per page
- [ ] Auth and kitchen-only flows covered

---

## References

- `src/app/layout.tsx` — client root, metadata commented
- `src/app/_lib/page-titles.ts` — segment map (reuse)
- `src/app/_components/SidebarLayout.tsx` — topbar `getPageTitle(pathname)`
- `src/app/tables/page.tsx` — only page with working metadata today
