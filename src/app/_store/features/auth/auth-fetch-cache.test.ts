import {describe, expect, it} from "vitest";
import {isCurrentUserFetchFresh} from "./auth-fetch-cache";

describe("isCurrentUserFetchFresh", () => {
  it("returns false when never fetched", () => {
    expect(isCurrentUserFetchFresh(null)).toBe(false);
  });

  it("returns true inside the TTL window", () => {
    expect(isCurrentUserFetchFresh(Date.now() - 5_000)).toBe(true);
  });

  it("returns false after the TTL window", () => {
    expect(isCurrentUserFetchFresh(Date.now() - 31_000)).toBe(false);
  });
});
