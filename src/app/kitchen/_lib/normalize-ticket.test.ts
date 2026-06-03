import {describe, expect, it} from "vitest";
import {normalizeKitchenStatus, normalizeKitchenTicket} from "@/app/kitchen/_lib/normalize-ticket";

describe("normalizeKitchenStatus", () => {
  it("maps numeric enum indexes to status strings", () => {
    expect(normalizeKitchenStatus(0)).toBe("awaiting");
    expect(normalizeKitchenStatus(2)).toBe("ready");
  });

  it("passes through string statuses", () => {
    expect(normalizeKitchenStatus("cooking")).toBe("cooking");
  });
});

describe("normalizeKitchenTicket", () => {
  it("coerces ids and normalizes status", () => {
    const ticket = normalizeKitchenTicket({
      id: "10",
      order_id: "5",
      quantity: "2",
      status: 1,
      item_type: "Dish",
    });

    expect(ticket).toMatchObject({
      id: 10,
      order_id: 5,
      quantity: 2,
      status: "cooking",
      item_type: "Dish",
    });
  });
});
