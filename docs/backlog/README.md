# Backlog — bugs & quick improvements

Lightweight triage for **small, scoped** UX fixes, regressions, and polish — without the full multi-phase structure of [plans](../plans/README.md).

## When to use what

| Situation | Where |
|-----------|--------|
| Multi-phase feature, new domain, API + React pairing | [docs/plans/](../plans/README.md) |
| Single bug, UX polish, refactor of one component | **This backlog** |
| Architectural decision with long-term impact | [docs/decisions/](../decisions/) (API repo has examples) |

If a backlog item grows beyond ~1 sprint or needs phased rollout, **promote it to a plan** (copy [TEMPLATE](../plans/TEMPLATE.md), add to plans README, open `feature/<slug>` branch).

## Entry format

One file per item: `NNN-short-slug.md` (zero-padded number, kebab slug).

```markdown
# <Title>

**Status:** open | in progress | done | wontfix  
**Priority:** P0 | P1 | P2 | P3  
**Area:** e.g. navigation, orders, settings  
**Plan:** link if promoted, or —  
**Branch:** `fix/<slug>` or `feature/<plan-slug>`

## Problem

What the user sees / what breaks.

## Expected

Correct behavior.

## Notes

Files, screenshots, related issues.
```

## Status legend

`open` · `in progress` · `done` · `wontfix`

## Index

| # | Item | Priority | Status |
|---|------|----------|--------|
| 001 | [Sidebar nav overflow](./001-sidebar-nav-overflow.md) | P1 | open → [plan 13](../plans/13-app-shell-navigation.md) |
