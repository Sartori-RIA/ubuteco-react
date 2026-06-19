import {configureStore} from "@reduxjs/toolkit";
import {beforeEach, describe, expect, it, vi} from "vitest";
import authReducer, {setAuthenticatedUser} from "./authSlice";
import {fetchCurrentUser} from "./authThunks";

vi.mock("@/app/_lib/auth-storage", () => ({
  getAuthUser: () => ({id: 1}),
}));

const show = vi.fn();

vi.mock("@/app/_services/users.service", () => ({
  usersService: {
    show: (...args: unknown[]) => show(...args),
  },
}));

describe("fetchCurrentUser", () => {
  beforeEach(() => {
    show.mockReset();
    show.mockResolvedValue({id: 1, name: "Test User"});
  });

  it("dedupes in-flight and fresh cached requests", async () => {
    const store = configureStore({reducer: {auth: authReducer}});
    store.dispatch(setAuthenticatedUser({id: 1, name: "Cached"}));

    await Promise.all([
      store.dispatch(fetchCurrentUser()),
      store.dispatch(fetchCurrentUser()),
    ]);
    expect(show).toHaveBeenCalledTimes(1);

    await store.dispatch(fetchCurrentUser());
    expect(show).toHaveBeenCalledTimes(1);
  });
});
