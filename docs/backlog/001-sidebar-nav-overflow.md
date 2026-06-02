# Sidebar navigation overflow

**Status:** done  
**Priority:** P1  
**Area:** navigation / app shell  
**Plan:** [13-app-shell-navigation](../plans/13-app-shell-navigation.md)  
**Branch:** `feature/app-shell-navigation` (merged — PR #19)

## Problem

The left sidebar lists **15+ flat menu items** with generous padding. On typical laptop viewports (1080p, 100% zoom), lower items (Users, Settings, Sign out) are **cut off**. Users must reduce browser zoom to reach hidden links.

## Root cause (code)

`SidebarLayout.tsx`:

- Aside uses `overflow-hidden` and `justify-between` without a scrollable nav region.
- Each link uses `py-3`, `rounded-2xl`, large header block (`p-6`).
- All catalog entities are top-level peers (Beers, Beer Styles, Drinks, Wines, …) with no grouping or role-based trimming beyond kitchen-only mode.

## Expected

- All navigation targets reachable at **100% zoom** on a 768px-tall viewport (common laptop).
- Clear grouping so operators find Orders/Kitchen vs catalog admin vs platform admin.
- No loss of role-based visibility (kitchen staff, super-admin read-only banner).

## Resolution

Shipped in PR #19: scrollable nav region (`flex-1 min-h-0 overflow-y-auto`), compact density, grouped menu via `nav-config.ts`, role filters unchanged.

## Notes

- Primary file: `src/app/_components/SidebarLayout.tsx`
- Optional follow-up: collapsed sidebar rail (plan 13 Phase 3).
