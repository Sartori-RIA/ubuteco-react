import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {http, HttpResponse} from "msw";
import {server} from "@/test/msw/server";
import {apiUrl} from "@/test/msw/handlers";
import ordersReducer from "./ordersSlice";
import {ordersThunks} from "./ordersThunks";

vi.mock("@/app/_lib/auth-storage", () => ({
  getAuthToken: () => "test-token",
}));

describe("ordersThunks.fetchAll cache", () => {
  const listResponse = {
    data: [{id: 1, status: "open" as const}],
    meta: {count: 1, page: 1, pages: 1, last: 1, previous: null},
  };

  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
  });

  it("skips refetch when the first page cache is still fresh", async () => {
    let fetchCount = 0;
    server.use(
      http.get(apiUrl("v1/orders"), () => {
        fetchCount += 1;
        return HttpResponse.json(listResponse);
      })
    );

    const store = configureStore({reducer: {orders: ordersReducer}});

    await store.dispatch(ordersThunks.fetchAll({}));
    await store.dispatch(ordersThunks.fetchAll({}));

    expect(fetchCount).toBe(1);
    expect(store.getState().orders.orders).toHaveLength(1);
  });

  it("refetches when filters change or pagination appends", async () => {
    let fetchCount = 0;
    server.use(
      http.get(apiUrl("v1/orders"), ({request}) => {
        fetchCount += 1;
        const url = new URL(request.url);
        if (url.searchParams.get("page") === "2") {
          return HttpResponse.json({
            data: [{id: 2, status: "open" as const}],
            meta: {count: 2, page: 2, pages: 2, last: 2, previous: 1},
          });
        }
        return HttpResponse.json(listResponse);
      })
    );

    const store = configureStore({reducer: {orders: ordersReducer}});

    await store.dispatch(ordersThunks.fetchAll({}));
    await store.dispatch(ordersThunks.fetchAll({search: "table 3"}));
    await store.dispatch(ordersThunks.fetchAll({page: 2, append: true}));

    expect(fetchCount).toBe(3);
  });
});
