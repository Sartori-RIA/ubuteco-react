import {describe, expect, it} from "vitest";
import {selectableOrderItemStatuses} from "@/app/orders/_lib/order-item-transitions";

describe("selectableOrderItemStatuses", () => {
  it("allows cooking → ready for dishes, not with_the_client", () => {
    expect(selectableOrderItemStatuses("cooking", true)).toEqual(["cooking", "ready", "canceled"]);
  });

  it("allows ready → with_the_client for dishes", () => {
    expect(selectableOrderItemStatuses("ready", true)).toEqual([
      "ready",
      "with_the_client",
      "canceled",
    ]);
  });

  it("allows awaiting → with_the_client for non-dish items", () => {
    expect(selectableOrderItemStatuses("awaiting", false)).toEqual([
      "awaiting",
      "with_the_client",
      "canceled",
      "empty_stock",
    ]);
  });
});
