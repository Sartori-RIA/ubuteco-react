# Plan: Inventory UI

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [09-inventory-stock](../../../ubuteco_api/docs/plans/09-inventory-stock.md)  
**Priority:** P2  
**Estimated effort:** 0.5–1 sprint (after API Phase 2)

---

## Goal

Surface **stock levels** in catalog UI and allow admins to adjust quantity without raw API calls.

---

## Phase 1 — Display

- [ ] Show `quantity_stock` on beer/wine/drink/food list and detail pages
- [ ] Badge “Low stock” when below threshold (when API provides threshold or client default)

---

## Phase 2 — Adjust stock (admin)

- [ ] On product edit page: stock adjustment field (+/-) or modal “Receive stock”
- [ ] Calls inventory API from [09-inventory-stock](../../../ubuteco_api/docs/plans/09-inventory-stock.md)

---

## Phase 3 — Low stock view (optional)

- [ ] `/inventory` or filter on catalog “Low stock items”
- [ ] Link from org dashboard when built

---

## Definition of done

- [ ] Stock visible on stockable products
- [ ] Admin can increment/decrement stock from UI

---

## References

- Product pages under `src/app/beers`, `wines`, `drinks`, `foods`
