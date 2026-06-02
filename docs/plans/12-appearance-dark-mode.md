# Plan: Appearance — dark mode (user preference)

**Status:** completed  
**Project:** ubuteco-react (primary) + ubuteco_api (legacy removal)  
**Priority:** P2  
**Estimated effort:** 0.5 sprint

---

## Goal

Replace the abandoned **per-org theme customizer** (Angular-era header/sidebar/footer colors) with a **user-level dark mode**: Light, Dark, or System.

Org branding stays via **logo + name** on Organizations UI (plan 06), not sidebar colors.

---

## Decision (approved)

| Approach | Verdict |
|----------|---------|
| Per-org color presets (`Theme` model) | **Removed** — dead API, never used in React |
| RTL per org | **Removed** — never persisted correctly |
| User dark mode (localStorage) | **Ship** |
| Server-stored appearance | Deferred — localStorage first |

---

## Phase 1 — Remove org themes (API) ✅

- [x] Drop `themes` table migration
- [x] Delete `Theme` model, `ThemesController`, views, routes, specs, factory
- [x] Remove `organization.theme` from JSON; `set_default_theme` callback
- [x] Remove Theme abilities (admin, waiter, kitchen, cash)
- [x] Update Swagger helper (regenerate `swagger.yaml` when convenient)

---

## Phase 2 — Dark mode foundation (React) ✅

- [x] CSS tokens in `globals.css` + `@custom-variant dark`
- [x] `appearance.ts` — light / dark / system + localStorage
- [x] `AppearanceScript` — prevent flash on load
- [x] `AppearanceProvider` + `useAppearance`
- [x] Settings → Appearance card

---

## Phase 3 — Shell styling (core done; incremental polish optional)

- [x] Sidebar, header, Card, Buttons, Inputs, AuthShell
- [ ] Toolbar, Product lists, kitchen board (incremental as pages are touched)
- [ ] Audit remaining hardcoded `bg-white` / `text-gray-*` in app routes

## Phase 4 — Tests & docs (optional follow-up)

- [ ] Unit: `resolveDarkMode`, `readStoredAppearance`
- [ ] Optional E2E: toggle in settings persists after reload
- [ ] Remove theme references from plan 06 (Organizations UI)

---

## Definition of done

- [x] No `themes` API or DB table
- [x] User can pick Light / Dark / System in Settings
- [x] App shell readable in both modes
- [x] No references to org theme in active frontend types

---

## Follow-up (not blocking)

Phase 3 incremental page audits and Phase 4 unit/E2E tests can be picked up in backlog or when touching those pages.

---

## References

- Removed: `app/controllers/api/v1/organizations/themes_controller.rb`
- Added: `src/app/_lib/appearance.ts`, `AppearanceProvider.tsx`
- Angular legacy (ignored): `ubuteco_spa/.../theme-customizer`
