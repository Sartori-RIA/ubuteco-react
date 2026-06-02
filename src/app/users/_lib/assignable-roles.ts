import {Role} from "@/app/_types";

/** Staff roles an org admin may assign (excludes SUPER_ADMIN and CUSTOMER). */
export const ASSIGNABLE_ROLE_NAMES = [
  "KITCHEN",
  "WAITER",
  "CASH_REGISTER",
  "ADMIN",
] as const;

export type AssignableRoleName = (typeof ASSIGNABLE_ROLE_NAMES)[number];

export function filterAssignableRoles(roles: Role[]): Role[] {
  return roles.filter(
    (role) => role.name != null && ASSIGNABLE_ROLE_NAMES.includes(role.name as AssignableRoleName)
  );
}
