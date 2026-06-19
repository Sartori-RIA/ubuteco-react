# i18n & formatting

UI strings and display formatting. Org-level locale/currency/timezone come from API — see API [i18n-and-money.md](../../../ubuteco_api/docs/context/i18n-and-money.md) and plan [02-locale-and-currency](../plans/02-locale-and-currency.md).

## i18n messages

| Path | Purpose |
|------|---------|
| `src/app/_lib/i18n/messages/en.ts` | English |
| `src/app/_lib/i18n/messages/pt-BR.ts` | Portuguese (Brazil) |
| `src/app/_lib/i18n/messages/es.ts` | Spanish |
| `src/app/_lib/i18n/messages/fr.ts` | French (partial — extend when touching FR UI) |
| `src/app/_lib/i18n/messages/types.ts` | Shared message shape |

Use `useI18n()` / `t("key.path")` in client components. Add keys to **all** active locales when introducing user-visible text.

## Money

- Hook: `useMoneyFormat()` from `_hooks/useMoneyFormat.ts`
- Helpers: `_lib/format.ts` (`formatMoney`, …)
- Org currency from `useOrganizationSettings()` / nested `user.organization`
- **Do not** hardcode `BRL` or `$` in components

## Dates & times

| Helper | Use |
|--------|-----|
| `formatDate` / `formatDateTime` in `_lib/format.ts` | Display with org timezone |
| `_lib/format-date.ts` | **Date-only** fields (`valid_until`) — `toDateInputValue`, calendar-day parsing |
| `_lib/dashboard-date-range.ts` | Dashboard `from`/`to` query params |

Avoid `new Date(isoString)` for date-only API fields without calendar-day helpers — timezone shift bugs.

## API errors in UI

- Structured errors: `_lib/api-errors.ts`, `resolveApiErrorMessages`, `localize-form-errors.ts`
- Map `code` + `field` to i18n — tests in `resolve-api-errors.test.ts`, `localize-form-errors.test.ts`

## Regional settings UI

- Settings pages under `src/app/settings/` — org locale, currency, timezone (admin)
- `useOrganizationSettings()` for formatting context after save

## Document titles

- `useDocumentTitle`, `_lib/page-titles.ts` — plan [10-document-titles](../plans/10-document-titles.md)

## AI pitfalls

- New page without i18n keys → incomplete UX; update message files.
- Copy English string inline in JSX → use `t()`.
- Format money with `toFixed(2)` + currency symbol → use `formatMoney`.

## References

- [frontend-map.md](./frontend-map.md)
- API plan [02-locale-and-currency](../../../ubuteco_api/docs/plans/02-locale-and-currency.md)
