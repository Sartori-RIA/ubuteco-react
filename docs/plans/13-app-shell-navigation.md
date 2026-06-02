# Plan: App shell & navigation (frontend)

**Status:** in progress  
**Project:** ubuteco-react  
**Backend:** —  
**Branch:** `feature/app-shell-navigation`  
**Priority:** P1  
**Backlog:** [001-sidebar-nav-overflow](../backlog/001-sidebar-nav-overflow.md)

---

## Goal

Redesign the authenticated app shell so navigation scales as the product grows: grouped menu, scrollable nav, compact density, and role-aware sections — without requiring browser zoom to reach Settings or Sign out.

**Platform:** desktop only (operators use laptops/desktops in the bar). Mobile layouts and responsive shell behavior are out of scope for this plan.

---

## Current state

- Single flat list of 15 items in `SidebarLayout.tsx`.
- Sidebar fixed at 260px; nav area does not scroll (`overflow-hidden` on aside).
- Large vertical padding per item and header block consume ~600–700px before footer.
- Kitchen staff already get a filtered list (Kitchen + Settings).
- Super-admin sees Organizations + platform banner; org admins see full catalog CRUD links.

---

## Phase 1 — Fix overflow (ship first)

Minimal diff; unblocks users immediately.

- [x] Restructure aside: `flex flex-col h-full` with three zones — **header** (shrink-0), **nav** (`flex-1 min-h-0 overflow-y-auto`), **footer** (shrink-0, Sign out).
- [x] Reduce nav item density: `py-2` (or `py-2.5`), `rounded-lg`, slightly smaller gap — match header/toolbar visual weight.
- [x] Compact header: `p-4` instead of `p-6`; optional single-line subtitle with truncate.
- [ ] Verify at 100% zoom, viewport height **768px**: Dashboard through Sign out all reachable via scroll.
- [ ] Manual check: kitchen-only user, org admin, super-admin.

**Files:** `src/app/_components/SidebarLayout.tsx`

---

## Phase 2 — Grouped information architecture

Reduce cognitive load; shorten visible list height.

- [x] Define nav groups (config object, not hardcoded JSX repetition):

  | Group | Items (default org admin) |
  |-------|---------------------------|
  | Operations | Dashboard, Orders, Kitchen (if allowed), Tables |
  | Menu & catalog | Beers, Beer Styles, Drinks, Wines, Wine Styles, Dishes, Food, Makers |
  | Administration | Users, Settings |
  | Platform | Organizations (super-admin only) |

- [x] Render group labels (small caps / muted) with `space-y-1` within group, `space-y-4` between groups.
- [x] Filter groups/items with existing `useAuthCapabilities` / `canAccessKitchen` / `isKitchenStaff` — no new API.
- [x] Active route styling unchanged in behavior; test nested paths if any share prefix.

**Optional follow-up:** extract `src/app/_lib/nav-config.ts` for testability — done in `nav-config.ts`.

---

## Phase 3 — Collapsed sidebar (desktop, optional)

Nice-to-have for smaller laptop screens; not required to close backlog 001.

- [ ] **Collapsed rail** (~56px): icons only + tooltips; expand on hover or pin (persist preference in `localStorage`, key e.g. `ubuteco.sidebar.expanded`).
- [ ] Hamburger in header toggles sidebar open/closed — collapsed rail is separate from hide/show; don’t duplicate two competing toggles.
- [ ] Keyboard: expanded nav links tabbable; collapsed icons have `aria-label`.

**Deferred / not planned:** viewport-based auto-collapse (`< lg`), touch targets, or any mobile-first shell work.

---

## Phase 4 — Polish & consistency

- [ ] Align Settings entry: sidebar link + header avatar both go to `/settings` — keep both or demote sidebar Settings to group footer only (decide in PR; prefer keeping in Administration group).
- [ ] Dark mode: verify group labels and scroll shadow at bottom of nav (`mask` or subtle gradient) if needed.
- [ ] Document nav config in [frontend-map.md](../context/frontend-map.md).

---

## Out of scope (for this plan)

- Mobile / tablet app shell (responsive breakpoints, hamburger-as-primary-nav, etc.).
- Command palette / global search (future plan).
- Moving catalog CRUD to a single “Catalog” hub page (would need routing + list UX — separate plan).
- Backend permission changes.

---

## Definition of done

- [ ] Phase 1 merged — no zoom required for full nav on 768px-tall **desktop** viewport.
- [ ] Phase 2 merged — grouped nav, roles respected.
- [ ] Backlog [001](../backlog/001-sidebar-nav-overflow.md) marked `done`.
- [ ] No regression for kitchen staff or super-admin banner.

Phase 3 (collapsed rail) is optional; not part of definition of done unless explicitly requested.

---

## References

- `src/app/_components/SidebarLayout.tsx`
- `src/app/_hooks/useAuthCapabilities.ts`
- `src/app/_lib/auth-roles.ts`
- `src/app/_lib/page-titles.ts` (header titles stay in sync with routes)
