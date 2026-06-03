import {describe, expect, it} from "vitest";
import kitchenReducer, {setCableConnected, ticketReceived} from "@/app/_store/features/kitchen/kitchenSlice";

describe("kitchenSlice", () => {
  it("upserts tickets on ticketReceived", () => {
    const first = kitchenReducer(
      undefined,
      ticketReceived({id: 1, status: "awaiting", item_type: "Dish", quantity: 1})
    );
    expect(first.tickets).toHaveLength(1);

    const updated = kitchenReducer(
      first,
      ticketReceived({id: 1, status: "cooking", item_type: "Dish", quantity: 1})
    );
    expect(updated.tickets).toHaveLength(1);
    expect(updated.tickets[0]?.status).toBe("cooking");
  });

  it("tracks cable connection state", () => {
    const state = kitchenReducer(undefined, setCableConnected(true));
    expect(state.cableConnected).toBe(true);
  });
});
