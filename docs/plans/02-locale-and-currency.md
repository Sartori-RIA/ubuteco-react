# Plan: Organization locale & currency (frontend)

**Status:** in progress  
**Project:** ubuteco-react  
**Backend:** [02-locale-and-currency.md](../../../ubuteco_api/docs/plans/02-locale-and-currency.md)  
**Branch:** `feature/locale-and-currency`  
**Priority:** P1

---

## Goal

Settings UI for org locale/currency/timezone; format money and dates consistently across the app.

---

## Phase 1 — Types & store

- [x] Extend `Organization` type: `locale`, `default_currency`, `timezone`
- [x] Hydrate from `fetchCurrentUser` / organization endpoint
- [x] Redux or context: `useOrganizationSettings()` hook

---

## Phase 2 — Formatting utilities

- [x] `formatMoney(cents, currency?)` using `Intl.NumberFormat` + org default
- [x] `formatDate(date, options?)` using org `timezone` (via `Intl`)
- [x] Orders pages use `useMoneyFormat()` for dates and money display
- [ ] Kitchen and catalog pages (incremental)

---

## Phase 3 — Settings UI

- [x] Page or section under `/settings` (admin only):
  - Locale select (`pt-BR`, `en`, …)
  - Currency select (ISO list, curated)
  - Timezone select
- [x] PATCH organization via `organizationsService`
- [x] Confirm dialog if changing currency (explain effect on new orders only)

---

## Phase 4 — i18n (org locale)

- [x] Lightweight catalog in `src/app/_lib/i18n/` keyed to org `locale` (no `next-intl` — avoids App Router middleware/routing churn)
- [x] `useTranslations()` hook reads locale from `useOrganizationSettings()`
- [x] Orders module strings in `en` + `pt-BR` (list, detail, items table, add panel, toasts, confirms)
- [ ] Full-app i18n pass (settings, catalog, kitchen, …) — separate increment or plan 02 phase extension

**Note on sub-plans:** keep phases inside this plan while work stays one branch/PR. Create a sub-plan (or new numbered plan) only when a phase becomes its own epic — e.g. `next-intl` migration across all routes, or kitchen i18n with live cable labels.

---

## Phase 5 — Tests

- [ ] Unit tests for format helpers
- [ ] Settings form validation + successful PATCH mock

---

## Definition of done

- [x] Admin can change locale/currency/timezone (UI ready; requires API migration)
- [x] Money and dates on orders reflect org settings
- [x] No hardcoded `BRL`/`R$` in new code
