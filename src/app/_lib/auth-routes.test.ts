import {describe, expect, it} from "vitest";
import {isAuthPublicPath, isMarketingShellPath} from "@/app/_lib/auth-routes";

describe("auth-routes", () => {
  it("marks auth pages as public", () => {
    expect(isAuthPublicPath("/login")).toBe(true);
    expect(isAuthPublicPath("/orders")).toBe(false);
  });

  it("skips app shell for auth routes and logged-out home", () => {
    expect(isMarketingShellPath("/login", false)).toBe(true);
    expect(isMarketingShellPath("/login", true)).toBe(true);
    expect(isMarketingShellPath("/", false)).toBe(true);
    expect(isMarketingShellPath("/", true)).toBe(false);
    expect(isMarketingShellPath("/orders", false)).toBe(false);
  });
});
