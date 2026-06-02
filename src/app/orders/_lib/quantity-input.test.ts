import {describe, expect, it} from "vitest";
import {shouldPersistDebouncedQuantity} from "@/app/orders/_lib/quantity-input";

describe("shouldPersistDebouncedQuantity", () => {
  it("persists when debounce caught up and differs from server", () => {
    expect(shouldPersistDebouncedQuantity(3, 3, 1)).toBe(true);
  });

  it("skips while debounce is catching up to a user edit", () => {
    expect(shouldPersistDebouncedQuantity(2, 1, 2)).toBe(false);
  });

  it("skips when debounced matches server", () => {
    expect(shouldPersistDebouncedQuantity(2, 2, 2)).toBe(false);
  });
});
