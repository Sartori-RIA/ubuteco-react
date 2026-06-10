import {describe, expect, it} from "vitest";
import {isAuthPublicPath, isMarketingShellPath} from "@/app/_lib/auth-routes";

describe("auth-routes", () => {
  it("marks auth pages as public", () => {
    expect(isAuthPublicPath("/login")).toBe(true);
    expect(isAuthPublicPath("/orders")).toBe(false);
  });

  it("skips app shell for auth routes and logged-out home", () => {
    expect(isMarketingShellPath("/login", {ready: true, authenticated: false})).toBe(true);
    expect(isMarketingShellPath("/login", {ready: true, authenticated: true})).toBe(true);
    expect(isMarketingShellPath("/", {ready: true, authenticated: false})).toBe(true);
    expect(isMarketingShellPath("/", {ready: true, authenticated: true})).toBe(false);
    expect(isMarketingShellPath("/orders", {ready: true, authenticated: false})).toBe(false);
    expect(isMarketingShellPath("/terms", {ready: true, authenticated: true})).toBe(true);
    expect(isMarketingShellPath("/privacy", {ready: true, authenticated: false})).toBe(true);
  });

  it("treats home as marketing shell until client is ready", () => {
    expect(isMarketingShellPath("/", {ready: false, authenticated: false})).toBe(true);
    expect(isMarketingShellPath("/", {ready: false, authenticated: true})).toBe(true);
  });
});
