import {describe, expect, it} from "vitest";
import {filterAssignableRoles} from "@/app/users/_lib/assignable-roles";

describe("filterAssignableRoles", () => {
  it("returns only staff roles assignable by org admin", () => {
    const roles = [
      {id: 1, name: "ADMIN"},
      {id: 2, name: "WAITER"},
      {id: 3, name: "SUPER_ADMIN"},
      {id: 4, name: "CUSTOMER"},
    ];

    expect(filterAssignableRoles(roles).map((role) => role.name)).toEqual(["ADMIN", "WAITER"]);
  });
});
