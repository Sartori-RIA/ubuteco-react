import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {http, HttpResponse} from "msw";
import {server} from "@/test/msw/server";
import {apiUrl} from "@/test/msw/handlers";
import ordersReducer from "@/app/_store/features/orders/ordersSlice";
import {ordersThunks} from "@/app/_store/features/orders/ordersThunks";

vi.mock("@/app/_lib/auth-storage", () => ({
  getAuthToken: () => "test-token",
}));

describe("orders add item integration (MSW + store)", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
  });

  it("addOrderItem updates activeOrder and orderItems from the API", async () => {
    const order = {
      id: 1,
      status: "open" as const,
      total_cents: 1500,
      order_items_count: 1,
    };
    const newItem = {
      id: 99,
      quantity: 1,
      item_type: "Dish" as const,
      item_id: 5,
      status: "awaiting" as const,
      order_id: 1,
    };

    server.use(
      http.post(apiUrl("v1/orders/1/items"), () => HttpResponse.json(newItem)),
      http.get(apiUrl("v1/orders/1"), () => HttpResponse.json(order)),
      http.get(apiUrl("v1/orders/1/items"), () => HttpResponse.json([newItem]))
    );

    const store = configureStore({reducer: {orders: ordersReducer}});
    await store.dispatch(
      ordersThunks.addOrderItem({
        orderId: 1,
        data: {item_id: 5, quantity: 1, item_type: "Dish"},
      })
    );

    const state = store.getState().orders;
    expect(state.addingItem).toBe(false);
    expect(state.activeOrder?.id).toBe(1);
    expect(state.orderItems).toHaveLength(1);
    expect(state.orderItems[0]?.id).toBe(99);
  });
});
