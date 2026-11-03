import {beforeEach, describe, expect, it, vi} from "vitest";
import {apiFetch} from "@/app/_services/api-fetch";
import {expiryStatusCounts, fetchExpiring, inventoryAlertTotal, lowStockCounts} from "@/app/_services/inventory";

vi.mock("@/app/_services/api-fetch", () => ({
  apiFetch: vi.fn(),
}));

describe("fetchExpiring", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("requests the expiring inventory endpoint", async () => {
    vi.mocked(apiFetch).mockResolvedValue({warning_days: 7, items: []});

    await fetchExpiring();

    expect(apiFetch).toHaveBeenCalledWith("v1/inventory/expiring");
  });
});

describe("inventoryAlertTotal", () => {
  it("adds low-stock and expiry counts", () => {
    expect(inventoryAlertTotal(2, 3)).toBe(5);
    expect(inventoryAlertTotal(0, 0)).toBe(0);
  });
});

describe("lowStockCounts", () => {
  it("splits products that are running low from those already at zero", () => {
    expect(lowStockCounts([
      {product_type: "beers", id: 1, name: "IPA", quantity_stock: 2, threshold: 5},
      {product_type: "foods", id: 2, name: "Bread", quantity_stock: 0, threshold: 5},
      {product_type: "wines", id: 3, name: "Red", quantity_stock: 0, threshold: 5},
    ])).toEqual({runningLow: 1, outOfStock: 2});
    expect(lowStockCounts([])).toEqual({runningLow: 0, outOfStock: 0});
  });
});

describe("expiryStatusCounts", () => {
  it("counts expiring and expired items separately", () => {
    expect(expiryStatusCounts([
      {product_type: "beers", id: 1, name: "Old", valid_until: "2026-11-01", days_remaining: -1, status: "expired"},
      {product_type: "foods", id: 2, name: "Bread", valid_until: "2026-11-03", days_remaining: 1, status: "expiring"},
      {product_type: "beers", id: 3, name: "Stale", valid_until: "2026-10-30", days_remaining: -3, status: "expired"},
    ])).toEqual({expiring: 1, expired: 2});
    expect(expiryStatusCounts([])).toEqual({expiring: 0, expired: 0});
  });
});
