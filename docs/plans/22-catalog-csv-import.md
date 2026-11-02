# Plan: Catalog CSV import (frontend)

**Status:** completed  
**Project:** ubuteco-react  
**Backend:** [22-catalog-csv-import](../../../ubuteco_api/docs/plans/22-catalog-csv-import.md)  
**Branch:** `feature/catalog-csv-import`  
**Priority:** P2  
**Depends on:** [13-app-shell-navigation](./13-app-shell-navigation.md), API plan 22  
**Estimated effort:** 0.5–1 sprint

Scheduled after the AI track and before [03 Subscription plans](./03-subscription-plans.md).

---

## Goal

An admin uploads a CSV and leaves the page if they want. A status screen shows whether the import is in the queue, running, finished, or failed, and the estimated start time while it is waiting. The result of each line is on that screen. The email is sent by the API. This app does not send it.

---

## Product decisions (lock before coding)

| Decision | Choice (v1) |
|----------|-------------|
| Who | `isAdmin()` only. Hide the entry point for every other role, including super admin |
| Entry | `/catalog/import`, linked from the catalog section of the sidebar for admins |
| Upload | Choose the type, download the English template, choose the file, submit. The button stays disabled while this organization already has an import queued or running |
| After submit | Go to the import detail. Do not wait on the upload request for the rows to be created |
| Status | Poll `GET /api/v1/catalog/imports/:id` every few seconds while `queued` or `running`. Stop when `completed` or `failed` |
| Queue copy | `queued` shows "Na fila" and, when `estimated_start_at` is present, the local time. When it is null, say there is no estimate yet |
| Running copy | `processed_rows` / `total_rows` |
| Result | On `completed`, list failed lines with the cause. Created count is the summary. On `failed`, show `error_message` and any rows already logged |
| List | The same page shows recent imports for this organization and their status |
| File check | `.csv`, at most 1 MB, before the request. The API checks again |
| Headers | The template and the help text use the English column names. Do not offer a Portuguese header |
| Copy | `catalogImport.*` in pt-BR, en, es, and a full block in fr |

---

## Out of scope

- Editing a cell and resubmitting that edit
- Several files at once
- Photos
- Creating makers or styles from this screen. The line error tells the admin what was missing
- Sending the email from the browser

---

## Phase 1 — Service

- [x] `src/app/_services/catalog-import.service.ts`: `createImport(file, productType)`, `listImports()`, `getImport(id)`, `templateUrl(productType)`
- [x] Multipart via `apiFetch` (`FormData`, no JSON content type)
- [x] Types for status `queued | running | completed | failed`, counts, `estimated_start_at`, and `row_log`
- [x] MSW: 202 queued, 409 already running, 403, 422 `invalid_csv`, a show payload that moves from queued to completed with one failed line

**Acceptance:** the service test checks the 1 MB guard and that create does not send a dry-run flag.

---

## Phase 2 — Page

- [x] `src/app/catalog/import/page.tsx` with the form and the recent list
- [x] `src/app/catalog/import/[id]/page.tsx` for one import
- [x] Template link hits `GET /api/v1/catalog/imports/template?product_type=`
- [x] Poll only while the status is `queued` or `running`
- [x] Guard: redirect anyone who is not an org admin. A direct URL must not open the form for a super admin
- [x] 409 explains that an import is already waiting or running and links to it

**Acceptance:** submitting a file lands on the detail page with status queued. A completed payload shows the failed line and its cause. Polling stops after `completed`.

---

## Phase 3 — Tests and i18n

- [x] Detail test: queued shows the estimate when the API sends one, and the no-estimate sentence when it does not
- [x] Completed test renders the line number and the cause
- [x] Admin sees the nav link. Cash register and waiter do not
- [x] `catalogImport.*` in `types.ts`, `en.ts`, `pt-BR.ts`, `es.ts`, and `fr.ts`
- [x] Titles for `/catalog/import` and `/catalog/import/:id` in `page-titles.ts`

---

## Definition of done

- [x] An admin can enqueue a CSV for all five types and watch the status
- [x] Other roles do not get the link
- [x] The screen shows queued, running, completed, and failed, including the start estimate when the API has one
- [x] Failed lines stay visible after the job finishes
- [x] Lint, tests, and build pass

---

## References

- `src/app/_services/api-fetch.ts` (FormData already skips the JSON header)
- `src/app/_lib/auth-roles.ts` (`isAdmin`, `OPERATIONAL_MUTATION_PATH`)
- API: [22-catalog-csv-import](../../../ubuteco_api/docs/plans/22-catalog-csv-import.md)
