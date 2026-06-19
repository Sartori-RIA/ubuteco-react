import type {FetchOrdersParams} from "./ordersThunks";

export const ORDERS_LIST_CACHE_TTL_MS = 60_000;

export function buildOrdersListCacheKey(params: FetchOrdersParams = {}): string {
  const {search = "", page = 1, status = ""} = params;
  return `${search}|${status}|${page}`;
}

export function isOrdersListCacheFresh(
  cacheKey: string | null,
  fetchedAt: number | null,
  params: FetchOrdersParams = {}
): boolean {
  if (cacheKey == null || fetchedAt == null) return false;
  return (
    cacheKey === buildOrdersListCacheKey(params) &&
    Date.now() - fetchedAt < ORDERS_LIST_CACHE_TTL_MS
  );
}
