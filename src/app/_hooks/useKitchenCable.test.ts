import {describe, expect, it} from "vitest";
import {
  kitchenCableSubscriptionParams,
  KITCHEN_CABLE_CHANNEL,
} from "@/app/_hooks/useKitchenCable";

describe("kitchenCableSubscriptionParams", () => {
  it("subscribes only to KitchenChannel without tenant params", () => {
    expect(kitchenCableSubscriptionParams()).toEqual({channel: KITCHEN_CABLE_CHANNEL});
    expect(kitchenCableSubscriptionParams()).not.toHaveProperty("organization_id");
  });
});
