# Plan: Catalog CSV import (frontend)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [22-catalog-csv-import](../../../ubuteco_api/docs/plans/22-catalog-csv-import.md)  
**Branch:** `feature/catalog-csv-import`  
**Priority:** P2  
**Depends on:** [13-app-shell-navigation](./13-app-shell-navigation.md), API plan 22  
**Estimated effort:** 0.5–1 sprint

Scheduled after the AI track and before [03 Subscription plans](./03-subscription-plans.md).

---

## Goal

An admin uploads a CSV, reads which rows would be created and which would fail, and only then confirms. The screen covers beers, drinks, wines, foods, and dishes.

---

## Product decisions (lock before coding)

| Decision | Choice (v1) |
|----------|-------------|
| Who | `isAdmin()` only. Hide the entry point for every other role. Super admin does not see it |
| Entry | One page, `/catalog/import`, linked from the catalog section of the sidebar for admins |
| Flow | Choose the type, download the template, choose the file, **Preview**, then **Import** on the same result. Import sends the same file without `dry_run` |
| File check | `.csv`, at most 1 MB, before the request. The API checks again |
| Result | Table of line, name, status, and errors. A summary: would create N / failed M, then created N / failed M |
| Second click | After a successful import, the Import button is disabled until a new file is chosen, so a double click does not turn the first success into a duplicate error |
| Foods and dishes | Short note on the dish type: foods named in the file must already exist. Link to the food type on the same page |
| Copy | pt-BR, en, es, and fr under `catalogImport.*` |

---

## Out of scope

- Editing a cell in the browser and resubmitting that edit
- Dragging several files
- Showing photos
- Creating makers or styles from this screen. The error text tells the admin to create the maker or pick an existing style first

---

## Phase 1 — Service

- [ ] `src/app/_services/catalog-import.service.ts`: `previewImport(file, productType)`, `confirmImport(file, productType)`, `templateUrl(productType)`
- [ ] Multipart via `apiFetch` (`FormData`, no JSON content type)
- [ ] Types `ImportResult`, `ImportRow`
- [ ] MSW: preview with one error, confirm success, 403, 422 `invalid_csv`

**Acceptance:** the service test checks the 1 MB guard and that preview sends `dry_run`.

---

## Phase 2 — Page

- [ ] `src/app/catalog/import/page.tsx`
- [ ] Type select: beer, drink, wine, food, dish
- [ ] Template link hits `GET /api/v1/catalog/imports/template?product_type=`
- [ ] Preview and Import buttons. Import stays disabled until a preview of the current file has finished
- [ ] Changing the file or the type clears the previous result
- [ ] Guard: redirect anyone who is not an org admin. Add the path to the super-admin mutation guard if a direct URL would otherwise open the form

**Acceptance:** preview does not leave the page looking like a save. Import is unavailable until preview. A 422 shows the file error above the table.

---

## Phase 3 — Tests and i18n

- [ ] Page test: preview renders the failed line; Import stays disabled before preview; after preview, confirm calls the import without dry run
- [ ] Admin sees the nav link. Cash register and waiter do not
- [ ] `catalogImport.*` in `types.ts`, `en.ts`, `pt-BR.ts`, `es.ts`, and a full block in `fr.ts`
- [ ] Title for `/catalog/import` in `page-titles.ts`

---

## Definition of done

- [ ] An admin can preview and confirm a CSV for all five types
- [ ] Other roles do not get the link
- [ ] Failed rows stay visible after confirm
- [ ] Lint, tests, and build pass

---

## References

- `src/app/_services/api-fetch.ts` (FormData already skips the JSON header)
- `src/app/_lib/auth-roles.ts` (`isAdmin`, `OPERATIONAL_MUTATION_PATH`)
- `src/app/inventory/intake/page.tsx` (upload, then review — same shape, different endpoint)
- API: [22-catalog-csv-import](../../../ubuteco_api/docs/plans/22-catalog-csv-import.md)
