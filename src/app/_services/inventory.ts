import {apiFetch} from "@/app/_services/api-fetch";

export type StockableProductType = "beers" | "wines" | "drinks" | "foods";

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export type LowStockItem = {
  product_type: StockableProductType;
  id: number;
  name: string;
  quantity_stock: number;
  threshold: number;
};

export type LowStockResponse = {
  threshold: number;
  items: LowStockItem[];
};

export async function adjustStock<T extends { quantity_stock: number }>(
  productType: StockableProductType,
  id: number,
  adjustment: number,
  reason?: string
): Promise<T> {
  return apiFetch<T>(`v1/${productType}/${id}/stock`, {
    method: "PATCH",
    body: JSON.stringify({adjustment, reason: reason?.trim() || undefined}),
  });
}

export async function fetchLowStock(): Promise<LowStockResponse> {
  return apiFetch<LowStockResponse>("v1/inventory/low_stock");
}

export type ExpiryProductType = "beers" | "foods";
export type ExpiryStatus = "expiring" | "expired";

export type ExpiringProductItem = {
  product_type: ExpiryProductType;
  id: number;
  name: string;
  valid_until: string;
  days_remaining: number;
  status: ExpiryStatus;
};

export type ExpiringResponse = {
  warning_days: number;
  items: ExpiringProductItem[];
};

export async function fetchExpiring(): Promise<ExpiringResponse> {
  return apiFetch<ExpiringResponse>("v1/inventory/expiring");
}

export function lowStockCounts(items: LowStockItem[]): {runningLow: number; outOfStock: number} {
  return items.reduce(
    (counts, item) => {
      if (item.quantity_stock <= 0) counts.outOfStock += 1;
      else counts.runningLow += 1;
      return counts;
    },
    {runningLow: 0, outOfStock: 0},
  );
}

export function inventoryAlertTotal(lowStockCount: number, expiringCount: number): number {
  return lowStockCount + expiringCount;
}

export function expiryStatusCounts(items: ExpiringProductItem[]): {expiring: number; expired: number} {
  return items.reduce(
    (counts, item) => {
      if (item.status === "expired") counts.expired += 1;
      else counts.expiring += 1;
      return counts;
    },
    {expiring: 0, expired: 0},
  );
}
