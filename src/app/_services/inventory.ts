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
