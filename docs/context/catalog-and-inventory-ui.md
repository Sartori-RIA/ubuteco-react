# Catalog & inventory UI

Patterns for stockable product CRUD and inventory alerts. API: [inventory-stock.md](../../../ubuteco_api/docs/context/inventory-stock.md), plan [11-inventory-ui](../plans/11-inventory-ui.md).

## Catalog resource pattern

Each stockable type follows the same App Router layout:

```
src/app/{beers|wines|drinks|foods}/
  page.tsx           # list
  new/page.tsx       # create
  [id]/page.tsx      # detail
  [id]/edit/page.tsx # edit
  components/        # Form, etc.
```

Services: `src/app/_services/{resource}.service.ts` (or domain naming in codebase).

Types: `src/app/_types/product.ts` and resource-specific types.

**Dishes** — not stockable; no `quantity_stock` / inventory adjust.

## Stock display & adjust

| Feature | Where |
|---------|--------|
| Show `quantity_stock` | List + detail on beer/wine/drink/food |
| Low stock badge | Client threshold + API `low_stock` endpoint |
| Adjust stock modal/field | Admin/cash on edit — `inventory.adjustStock()` |
| Low stock page | `/inventory` — `fetchLowStock()` |

Service: `src/app/_services/inventory.ts`

```typescript
adjustStock(productType, id, adjustment, reason?)
fetchLowStock()
```

Roles: `canAdjustStock`, `canAccessInventory` in `auth-roles.ts`.

## valid_until (expiry)

| Product | UI today |
|---------|----------|
| Food | form + list (`FoodForm`, `formatDate`) |
| Beer | API field exists — UI parity planned in [15-product-expiry-alerts](../plans/15-product-expiry-alerts.md) |

Use `_lib/format-date.ts` for date inputs.

## API error codes (inventory)

Handle via `resolveApiErrorMessages` — e.g. `insufficient_stock` from order flows.

## Nav

- Inventory link in sidebar when `canAccessInventory(user)`
- Future expiry badge — plan 15

## AI pitfalls

- Do not add stock adjust UI without `canAdjustStock` guard.
- Do not call PATCH stock on dishes.
- New catalog resource: copy beers/foods pattern end-to-end (service, pages, types, i18n, auth if needed).
- Companion API plan required if new endpoints.

## References

- [frontend-map.md](./frontend-map.md)
- [09-inventory-stock](../../../ubuteco_api/docs/plans/09-inventory-stock.md) (API)
- [15-product-expiry-alerts](../plans/15-product-expiry-alerts.md)
