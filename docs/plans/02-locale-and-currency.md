# Plan: Organization locale & currency (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [02-locale-and-currency.md](../../../ubuteco_api/docs/plans/02-locale-and-currency.md)  
**Priority:** P1

---

## Goal

Settings UI for org locale/currency/timezone; format money and dates consistently across the app.

---

## Phase 1 — Types & store

- [ ] Extend `Organization` type: `locale`, `default_currency`, `timezone`
- [ ] Hydrate from `fetchCurrentUser` / organization endpoint
- [ ] Redux or context: `useOrganizationSettings()` hook

---

## Phase 2 — Formatting utilities

- [ ] `formatMoney(cents, currency?)` using `Intl.NumberFormat` + org default
- [ ] `formatDate(date, options?)` using org `timezone` (e.g. `date-fns-tz` or `Intl`)
- [ ] Replace ad-hoc formatting in orders, kitchen, catalog pages incrementally

---

## Phase 3 — Settings UI

- [ ] Page or section under `/settings` (admin only):
  - Locale select (`pt-BR`, `en`, …)
  - Currency select (ISO list, curated)
  - Timezone select
- [ ] PATCH organization via `organizationsService`
- [ ] Confirm dialog if changing currency (explain effect on new orders only)

---

## Phase 4 — i18n (optional v1.1)

- [ ] If UI strings should follow org locale: integrate `next-intl` or similar keyed to org locale
- [ ] v1 minimum: API error messages already localized; UI can stay single language until i18n pass

---

## Phase 5 — Tests

- [ ] Unit tests for format helpers
- [ ] Settings form validation + successful PATCH mock

---

## Definition of done

- [ ] Admin can change locale/currency/timezone
- [ ] Money and dates on orders/kitchen reflect org settings
- [ ] No hardcoded `BRL`/`R$` in new code
