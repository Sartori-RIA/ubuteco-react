# Plan: AI product intake — label photo & invoice upload (frontend)

**Status:** completed  
**Project:** ubuteco-react  
**Backend:** [21-ai-product-intake](../../../ubuteco_api/docs/plans/21-ai-product-intake.md)  
**Branch:** `feature/ai-product-intake`  
**Priority:** P3  
**Depends on:** [11-inventory-ui](./11-inventory-ui.md), [16-ai-settings](./16-ai-settings.md), API plan 21 (Phase 1 for invoice, Phase 2 for label)  
**Estimated effort:** 1 sprint

---

## Goal

Two upload flows that pre-fill forms the user already knows:

1. **New beer/wine from a label photo** — upload or take a photo, review the pre-filled `BeerForm`/`WineForm`, save.
2. **Receive a delivery from an NF-e** — upload the XML (or a photo/PDF when AI is on), review matched lines, apply stock adjustments in one go.

Nothing is saved until the user clicks save/apply on the review screen.

---

## Product decisions (lock before coding)

| Decision | Recommendation (v1) |
|----------|---------------------|
| Who | `canAdjustStock()` roles (ADMIN, CASH_REGISTER) and not super admin (`canMutateOperationalData()`) |
| Label entry point | "Fill from photo" button on `/beers/new` and `/wines/new`, only with `useAiEnabled()` |
| Camera | `<input type="file" accept="image/*" capture="environment">` — works on phones without extra libs |
| Label review | Fill the **existing** form with draft values; fields filled by AI get a subtle highlight until edited |
| Unknown maker/style | Show suggestion text + `SearchableSelect` of existing options; never auto-create |
| Invoice entry point | "Receive invoice" button on `/inventory` → `/inventory/intake` |
| XML vs photo | XML always available (no AI). Photo/PDF option only with `useAiEnabled()` |
| Invoice review | Table: invoice line, matched product (editable `SearchableSelect`), quantity (editable), include checkbox. Unmatched lines unchecked by default. |
| Apply | Sequential `adjustStock` calls with reason `delivery`; progress + per-line result; partial failures listed, successful ones not retried |
| File limits | Check type and ≤ 5 MB client-side before upload (API validates again) |

---

## Out of scope

- Creating new products from invoice lines (link to `/beers/new` etc. instead)
- Batch photo upload
- Saving the uploaded label as product image (v2 — needs API support)

---

## Phase 1 — Services

- [ ] `src/app/_services/intake.service.ts`: `extractLabel(file, productType)`, `parseInvoice(file)` (multipart via `apiFetch` — confirm it supports `FormData` without forcing JSON headers; extend if not)
- [ ] Types `LabelDraft`, `InvoiceLine`, `InvoiceMatch`
- [ ] MSW handlers (good draft, low confidence, `ai_invalid_output`, `invalid_document`)

---

## Phase 2 — Label → form

- [ ] `LabelPhotoButton` component (file/camera input, upload, loading state)
- [ ] Integrate in `BeerForm` and `WineForm` via an `initialDraft` prop (no change for existing callers)
- [ ] Highlight AI-filled fields; clear highlight on edit
- [ ] Warnings from API shown above the form

**Acceptance:** draft fills form; nothing saved until submit; button hidden when AI off.

---

## Phase 3 — Invoice intake page

- [ ] Route `src/app/inventory/intake/page.tsx` guarded like `/inventory`
- [ ] Upload step → review table → apply step with progress
- [ ] Reuse `SearchableSelect` for product matching (catalog search endpoints)
- [ ] Summary at the end: applied N, failed M (with reasons), link back to `/inventory`

**Acceptance:** XML flow works with AI disabled; partial failure shows which lines failed.

---

## Phase 4 — Tests & i18n

- [ ] Tests: file validation, label draft fill, AI hidden when disabled, invoice review edits, apply with one failure
- [ ] Add route to `page-titles.ts` and `nav-config` if needed
- [ ] i18n keys `intake.*` in `pt-BR`, `en`, `es`, `fr`

---

## Definition of done

- [ ] Label photo pre-fills beer/wine forms (AI on)
- [ ] NF-e XML receive flow works without AI; photo/PDF with AI
- [ ] No data persisted without explicit user action
- [ ] Lint, tests, build pass

---

## References

- `src/app/beers/components/BeerForm.tsx`, `src/app/wines/`
- `src/app/inventory/page.tsx`
- `src/app/_components/SearchableSelect.tsx`, `StockAdjustmentPanel.tsx`
- `src/app/_services/api-fetch.ts`, `src/app/_services/inventory.ts`
- API: [21-ai-product-intake](../../../ubuteco_api/docs/plans/21-ai-product-intake.md)
