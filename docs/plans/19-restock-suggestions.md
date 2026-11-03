# Plan: Restock suggestions (frontend)

**Status:** completed  
**Project:** ubuteco-react  
**Backend:** [19-restock-suggestions](../../../ubuteco_api/docs/plans/19-restock-suggestions.md)  
**Branch:** `feature/restock-suggestions`  
**Priority:** P2  
**Depends on:** [11-inventory-ui](./11-inventory-ui.md), API plan 19 Phase 2 (Phase 3 for explanations)  
**Estimated effort:** 0.5 sprint

---

## Goal

On `/inventory`, show **what to buy and how much**, ranked by how soon each product runs out — the shopping list the owner currently does in their head.

---

## Product decisions (lock before coding)

| Decision | Recommendation (v1) |
|----------|---------------------|
| Placement | New **Restock** tab on `/inventory` next to low stock (and expiry, if plan 15 shipped first — keep one tab component) |
| Who | `canAccessInventory()` |
| Columns | Product, type, in stock, sells/day, days left, suggested qty, confidence |
| Low confidence | Row shown greyed with "not enough history" and no quantity |
| Controls | "Cover N days" select (3, 7, 14, 30) → `cover_days` param |
| Act on it | Row action "Adjust stock" opens the existing `StockAdjustmentPanel` prefilled with suggested qty and reason `delivery` |
| AI explanation | Only when `useAiEnabled()`: "Explain" toggle fetches `?explain=1` and shows one sentence under each row. Without AI, the tab works fully. |
| Export | Copy list to clipboard as text (for WhatsApp to supplier) — cheap and useful |

---

## Out of scope

- Purchase orders, supplier contacts
- Charts of consumption history

---

## Phase 1 — Service

- [x] `fetchRestockSuggestions({coverDays, explain})` in `src/app/_services/inventory.ts`
- [x] Types `RestockSuggestion`, `RestockSuggestionsResponse`
- [x] MSW handler (with and without `explanation`)

---

## Phase 2 — Tab & table

- [x] Tabs on `src/app/inventory/page.tsx` (extract existing low stock table into a component first, no behaviour change)
- [x] `RestockSuggestionsTable` with sort by days left, low-confidence styling, empty state
- [x] Cover-days select; numbers via existing format helpers

**Acceptance:** admin and cash register see suggestions; waiter/kitchen blocked (existing guard).

---

## Phase 3 — Actions

- [x] "Adjust stock" → `StockAdjustmentPanel` with prefilled adjustment; refresh list after save
- [x] "Copy list" → clipboard text `Product — quantity`, translated header; toast on success

---

## Phase 4 — AI explanation (optional)

- [x] "Explain" toggle visible only with `useAiEnabled()`
- [x] Explanation rendered as plain text, muted style, "AI" badge
- [x] If explain request fails → keep table, show inline notice

---

## Phase 5 — Tests & i18n

- [x] Tests: table render, low confidence, cover-days change refetches, prefilled adjust, AI toggle hidden when disabled
- [x] i18n keys `inventory.restock.*` in `pt-BR`, `en`, `es`, `fr`
- [x] Update `docs/context/catalog-and-inventory-ui.md`

---

## Definition of done

- [x] Restock tab live with actionable suggestions
- [x] Works without AI; explanation appears only when enabled
- [x] Lint, tests, build pass

---

## References

- `src/app/inventory/page.tsx`
- `src/app/_components/StockAdjustmentPanel.tsx`, `StockDisplay.tsx`
- `src/app/_services/inventory.ts`
- API: [19-restock-suggestions](../../../ubuteco_api/docs/plans/19-restock-suggestions.md)
