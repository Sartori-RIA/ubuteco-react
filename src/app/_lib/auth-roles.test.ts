import {describe, expect, it} from "vitest";
import {
  canAccessOrganizations,
  canAccessDashboard,
  canManageOrganization,
  isOrganizationPath,
} from "@/app/_lib/auth-roles";
import {User} from "@/app/_types";

function userWithRole(role: string): User {
  return {
    id: 1,
    name: "Test",
    email: "test@example.com",
    role: {id: 1, name: role},
  } as User;
}

describe("organization access", () => {
  it("allows org admin and super admin to access organizations UI", () => {
    expect(canManageOrganization(userWithRole("ADMIN"))).toBe(true);
    expect(canAccessOrganizations(userWithRole("ADMIN"))).toBe(true);
    expect(canAccessOrganizations(userWithRole("SUPER_ADMIN"))).toBe(true);
  });

  it("denies kitchen and waiter roles", () => {
    expect(canAccessOrganizations(userWithRole("KITCHEN"))).toBe(false);
    expect(canAccessOrganizations(userWithRole("WAITER"))).toBe(false);
    expect(canAccessOrganizations(userWithRole("CASH_REGISTER"))).toBe(false);
    expect(canAccessDashboard(userWithRole("KITCHEN"))).toBe(false);
    expect(canAccessDashboard(userWithRole("WAITER"))).toBe(false);
  });

  it("allows admin and cash register on dashboard", () => {
    expect(canAccessDashboard(userWithRole("ADMIN"))).toBe(true);
    expect(canAccessDashboard(userWithRole("CASH_REGISTER"))).toBe(true);
  });

  it("matches organization routes", () => {
    expect(isOrganizationPath("/organizations")).toBe(true);
    expect(isOrganizationPath("/organizations/42")).toBe(true);
    expect(isOrganizationPath("/orders")).toBe(false);
  });
});
