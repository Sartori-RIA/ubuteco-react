# Plan: Organization locale & currency (frontend)

**Status:** completed  
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
- [x] Kitchen and catalog pages use `useMoneyFormat()` for prices and dates

---

## Phase 3 — Settings UI

- [x] Page or section under `/settings` (admin only):
  - Locale select (`pt-BR`, `en`, `es`, `fr`, `en-CA`, `fr-CA`, …)
  - Currency select (ISO list, curated)
  - Timezone select
- [x] PATCH organization via `organizationsService`
- [x] Confirm dialog if changing currency (explain effect on new orders only)

---

## Phase 4 — i18n (org locale)

- [x] Lightweight catalog in `src/app/_lib/i18n/` keyed to org `locale` (no `next-intl` — avoids App Router middleware/routing churn)
- [x] `useTranslations()` hook reads locale from `useOrganizationSettings()`
- [x] Orders module strings in `en` + `pt-BR` (list, detail, items table, add panel, toasts, confirms)
- [x] Full-app i18n (settings, auth, catalog, kitchen, forms, detail pages)

**Note on sub-plans:** keep phases inside this plan while work stays one branch/PR. Create a sub-plan (or new numbered plan) only when a phase becomes its own epic — e.g. `next-intl` migration across all routes.

---

## Phase 5 — Tests

- [x] Unit tests for format helpers (`src/app/_lib/format.test.ts`)
- [x] Settings PATCH mock (`src/app/_services/organizations.service.test.ts`)

---

## Definition of done

- [x] Admin can change locale/currency/timezone (UI ready; requires API migration)
- [x] Money and dates on orders reflect org settings
- [x] No hardcoded `BRL`/`R$` in new code

---

## Also shipped (post–PR #27)

- [x] Locales: `es`, `fr`, `fr-CA`, `en-CA` (+ existing `pt-BR`, `en`)
- [x] Currencies: CLP, MXN, COP, ARS, CAD (+ BRL, USD, EUR)
- [x] Timezones: all Brazil offsets, Canada, `Europe/Paris`, `Europe/Madrid`
- [x] Order/kitchen status select: API-valid transitions only; localized transition errors
- [x] `localizeFormErrors` in `FormErrors` app-wide
