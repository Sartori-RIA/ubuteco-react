import {describe, expect, it} from "vitest";
import {
  buildOrdersListCacheKey,
  isOrdersListCacheFresh,
  ORDERS_LIST_CACHE_TTL_MS,
} from "./orders-list-cache";

describe("orders list cache helpers", () => {
  it("builds a stable cache key from filters", () => {
    expect(buildOrdersListCacheKey({search: "table", status: "open", page: 2})).toBe(
      "table|open|2"
    );
    expect(buildOrdersListCacheKey()).toBe("||1");
  });

  it("detects a fresh cache entry", () => {
    const key = buildOrdersListCacheKey({search: "", status: "", page: 1});
    expect(isOrdersListCacheFresh(key, Date.now() - 1_000, {})).toBe(true);
  });

  it("rejects stale or mismatched cache entries", () => {
    const key = buildOrdersListCacheKey({});
    expect(
      isOrdersListCacheFresh(key, Date.now() - ORDERS_LIST_CACHE_TTL_MS - 1, {})
    ).toBe(false);
    expect(isOrdersListCacheFresh(key, Date.now(), {search: "other"})).toBe(false);
  });
});
