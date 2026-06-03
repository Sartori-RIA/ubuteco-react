import {configureStore} from "@reduxjs/toolkit";
import {describe, expect, it} from "vitest";
import kitchenReducer, {ticketReceived} from "@/app/_store/features/kitchen/kitchenSlice";
import {applyKitchenCableMessage} from "@/app/kitchen/_lib/apply-kitchen-cable-message";

describe("kitchen cable → store integration", () => {
  it("updates the kitchen queue when a cable payload is applied", () => {
    const store = configureStore({reducer: {kitchen: kitchenReducer}});

    const raw = {
      action: "create",
      obj: {id: 42, status: "awaiting", item_type: "Dish", order_id: 7, quantity: 1},
    };

    const message = applyKitchenCableMessage(raw);
    expect(message?.obj).toBeDefined();
    store.dispatch(ticketReceived(message!.obj!));

    const {tickets} = store.getState().kitchen;
    expect(tickets).toHaveLength(1);
    expect(tickets[0]).toMatchObject({id: 42, status: "awaiting", order_id: 7});
  });

  it("upserts an existing ticket when cable sends an update", () => {
    const store = configureStore({reducer: {kitchen: kitchenReducer}});
    store.dispatch(
      ticketReceived({id: 42, status: "awaiting", item_type: "Dish", order_id: 7, quantity: 1})
    );

    const updated = applyKitchenCableMessage({
      action: "update",
      obj: {id: 42, status: "cooking", item_type: "Dish", order_id: 7, quantity: 1},
    });
    store.dispatch(ticketReceived(updated!.obj!));

    const {tickets} = store.getState().kitchen;
    expect(tickets).toHaveLength(1);
    expect(tickets[0]?.status).toBe("cooking");
  });
});
