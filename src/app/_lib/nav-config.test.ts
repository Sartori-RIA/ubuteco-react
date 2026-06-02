import {describe, expect, it} from "vitest";
import {getVisibleNavGroups} from "@/app/_lib/nav-config";
import {User} from "@/app/_types";

function userWithRole(role: string): User {
  return {
    id: 1,
    name: "Test",
    email: "test@example.com",
    role: {id: 1, name: role},
  } as User;
}

describe("getVisibleNavGroups", () => {
  it("shows only kitchen and settings for kitchen staff", () => {
    const groups = getVisibleNavGroups(userWithRole("KITCHEN"));
    const links = groups.flatMap((group) => group.items.map((item) => item.link));
    expect(links).toEqual(["/kitchen", "/settings"]);
  });

  it("shows organizations for org admin", () => {
    const groups = getVisibleNavGroups(userWithRole("ADMIN"));
    const links = groups.flatMap((group) => group.items.map((item) => item.link));
    expect(links).toContain("/organizations");
    expect(links).toContain("/orders");
  });

  it("shows organizations for super admin", () => {
    const groups = getVisibleNavGroups(userWithRole("SUPER_ADMIN"));
    const links = groups.flatMap((group) => group.items.map((item) => item.link));
    expect(links).toContain("/organizations");
  });

  it("hides users for non-admin roles", () => {
    for (const role of ["WAITER", "KITCHEN", "CASH_REGISTER", "SUPER_ADMIN"]) {
      const links = getVisibleNavGroups(userWithRole(role)).flatMap((group) =>
        group.items.map((item) => item.link)
      );
      expect(links).not.toContain("/users");
    }
  });

  it("hides organizations for kitchen staff", () => {
    const links = getVisibleNavGroups(userWithRole("KITCHEN")).flatMap((group) =>
      group.items.map((item) => item.link)
    );
    expect(links).not.toContain("/organizations");
  });

  it("hides dashboard for waiter", () => {
    const links = getVisibleNavGroups(userWithRole("WAITER")).flatMap((group) =>
      group.items.map((item) => item.link)
    );
    expect(links).not.toContain("/");
  });

  it("shows users for org admin", () => {
    const links = getVisibleNavGroups(userWithRole("ADMIN")).flatMap((group) =>
      group.items.map((item) => item.link)
    );
    expect(links).toContain("/users");
  });
});
