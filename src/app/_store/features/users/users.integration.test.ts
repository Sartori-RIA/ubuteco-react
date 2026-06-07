import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, it, vi} from "vitest";
import usersReducer from "@/app/_store/features/users/usersSlice";
import {usersThunks} from "@/app/_store/features/users/usersThunks";

vi.mock("@/app/_lib/auth-storage", () => ({
  getAuthToken: () => "test-token",
}));

describe("users list integration (MSW + store)", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
  });

  it("fetchAll populates users from the API", async () => {
    const store = configureStore({reducer: {users: usersReducer}});
    await store.dispatch(usersThunks.fetchAll({page: 1}));

    const state = store.getState().users;
    expect(state.loading).toBe(false);
    expect(state.users).toHaveLength(1);
    expect(state.users[0]?.email).toBe("kitchen@example.com");
    expect(state.meta.count).toBe(1);
  });
});
