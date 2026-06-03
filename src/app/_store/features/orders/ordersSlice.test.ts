import {describe, expect, it} from "vitest";
import ordersReducer from "@/app/_store/features/orders/ordersSlice";
import {ordersThunks} from "@/app/_store/features/orders/ordersThunks";
import {Order, OrderItem} from "@/app/_types";

const order: Order = {id: 1, status: "open", total_cents: 1000};
const staleItems: OrderItem[] = [{id: 1, status: "awaiting", item_type: "Beer", item_id: 1, quantity: 1}];
const freshItems: OrderItem[] = [{id: 2, status: "awaiting", item_type: "Dish", item_id: 2, quantity: 3}];

describe("ordersSlice refreshOrder race guard", () => {
  it("ignores stale refreshOrder results when a newer refresh is pending", () => {
    let state = ordersReducer(undefined, {type: "@@INIT"});
    state = {
      ...state,
      orderItems: staleItems,
    };

    state = ordersReducer(state, ordersThunks.refreshOrder.pending("req-old", 1));
    state = ordersReducer(
      state,
      ordersThunks.refreshOrder.fulfilled({order, items: freshItems}, "req-new", 1)
    );

    expect(state.orderItems).toEqual(staleItems);
    expect(state.itemsRefreshRequestId).toBe("req-old");
  });

  it("applies items when refresh request ids match", () => {
    let state = ordersReducer(undefined, {type: "@@INIT"});
    state = ordersReducer(state, ordersThunks.refreshOrder.pending("req-1", 1));
    state = ordersReducer(
      state,
      ordersThunks.refreshOrder.fulfilled({order, items: freshItems}, "req-1", 1)
    );

    expect(state.orderItems).toEqual(freshItems);
    expect(state.itemsRefreshRequestId).toBeNull();
  });

  it("clears refresh tracking when addOrderItem starts", () => {
    let state = ordersReducer(undefined, {type: "@@INIT"});
    state = {
      ...state,
      itemsRefreshRequestId: "req-1",
    };

    state = ordersReducer(
      state,
      ordersThunks.addOrderItem.pending("", {orderId: 1, data: {item_type: "Beer", item_id: 1, quantity: 1}})
    );

    expect(state.itemsRefreshRequestId).toBeNull();
    expect(state.addingItem).toBe(true);
  });
});
