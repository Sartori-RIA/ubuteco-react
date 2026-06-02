import {describe, expect, it} from "vitest";
import {findMatchingOrderLine, isSameOrderLine} from "@/app/orders/_lib/order-items";
import {OrderItem} from "@/app/_types/order";

const line = (overrides: Partial<OrderItem>): OrderItem => ({
  id: 1,
  status: "awaiting",
  item_type: "Beer",
  item_id: 42,
  quantity: 2,
  ...overrides,
});

describe("isSameOrderLine", () => {
  it("matches type and id with numeric coercion", () => {
    expect(isSameOrderLine(line({item_id: 42}), "Beer", 42)).toBe(true);
    expect(isSameOrderLine(line({item_id: 42 as unknown as number}), "Beer", 42)).toBe(true);
  });

  it("rejects different type or id", () => {
    expect(isSameOrderLine(line({}), "Wine", 42)).toBe(false);
    expect(isSameOrderLine(line({}), "Beer", 99)).toBe(false);
  });
});

describe("findMatchingOrderLine", () => {
  it("returns the matching line", () => {
    const items = [line({id: 10}), line({id: 11, item_type: "Drink", item_id: 5})];
    expect(findMatchingOrderLine(items, {item_type: "Beer", item_id: 42})?.id).toBe(10);
  });
});
