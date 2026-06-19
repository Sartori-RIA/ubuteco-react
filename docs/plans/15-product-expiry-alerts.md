# Plan: Product expiry alerts (UI)

**Status:** not started  
**Project:** ubuteco-react  
**Backend:** [15-product-expiry-alerts](../../../ubuteco_api/docs/plans/15-product-expiry-alerts.md)  
**Branch:** `feature/product-expiry-alerts`  
**Priority:** P2  
**Depends on:** [11-inventory-ui](./11-inventory-ui.md), API plan 15 Phase 2  
**Estimated effort:** 0.5 sprint

---

## Goal

**Screen and navigation cues** for products whose `valid_until` date is approaching or past — so admins/cash staff act before spoilage. Complements existing food `valid_until` fields and the inventory area.

---

## Current state

- **Foods:** `valid_until` shown on list/detail; editable in `FoodForm` (`formatDate`, `toDateInputValue` — see [frontend-map.md](../context/frontend-map.md)).
- **Beers:** API supports `valid_until`; React catalog pages do **not** show/edit yet.
- **Inventory page** (`/inventory`): low stock only — no expiry section.
- No nav badge or dedicated expiry route.

---

## Product decisions (lock before coding)

| Decision | Recommendation (v1) |
|----------|---------------------|
| Primary UX | Dedicated section on `/inventory` **or** tab “Expiring” alongside low stock |
| Nav badge | Show count on **Inventory** nav item when `items.length > 0` (admin/cash only) |
| Visual urgency | Badge/chip: expiring (warning) vs expired (danger) — reuse design tokens from low stock |
| Roles | Same as inventory: `canViewInventory()` / adjust roles from [auth-roles.ts](../../src/app/_lib/auth-roles.ts) |
| Beer `valid_until` | Add to beer form/list in **same PR** (parity with food) |
| Deep link | Row links to product edit (`/beers/:id`, `/foods/:id`) |

---

## Out of scope (v1)

- Toast/popup on login
- Browser push notifications
- Blocking product from orders when expired

---

## Phase 1 — API client

- [ ] `inventoryService.fetchExpiring()` → `GET /api/v1/inventory/expiring`
- [ ] Types: `ExpiringProductItem` (`product_type`, `id`, `name`, `valid_until`, `days_remaining`, `status`)
- [ ] Error handling consistent with low stock (`resolveApiErrorMessages`)

---

## Phase 2 — Inventory screen

- [ ] Extend `/inventory` with **Expiring & expired** table (or tabs: Low stock | Expiry)
- [ ] Columns: name, type, valid until, days remaining, status chip
- [ ] Empty state i18n
- [ ] Loading/error states match existing inventory page

**Acceptance:** admin sees items from API; waiter/kitchen cannot access route.

---

## Phase 3 — Nav notification

- [ ] Fetch expiring count on app shell load (or when entering inventory routes) — avoid N+1; consider single hook `useInventoryAlerts()`
- [ ] Badge on sidebar **Inventory** link when count > 0
- [ ] Optional: include low_stock count in same badge (sum) or separate badges — **decision: separate counts or combined “alerts” total** (default: combined total for v1)

---

## Phase 4 — Beer catalog parity

- [ ] `BeerForm`: `valid_until` date input (mirror `FoodForm`)
- [ ] Beer list/detail: show valid until when present
- [ ] i18n keys under `catalog.validUntil` (reuse existing)

---

## Phase 5 — Tests

- [ ] MSW handler for expiring endpoint
- [ ] Page test: renders items, status chips, forbidden for wrong role
- [ ] Nav badge test (optional)

---

## Definition of done

- [ ] Staff with inventory access see expiring/expired products
- [ ] Nav reflects pending expiry alerts
- [ ] Beers support `valid_until` in UI like foods
- [ ] i18n for `pt-BR`, `en`, `es` (and `fr` if inventory strings exist there)

---

## References

- [11-inventory-ui.md](./11-inventory-ui.md)
- `src/app/inventory/page.tsx`
- `src/app/foods/components/FoodForm.tsx`
- `src/app/_services/inventory.ts`
- API: [15-product-expiry-alerts](../../../ubuteco_api/docs/plans/15-product-expiry-alerts.md)
