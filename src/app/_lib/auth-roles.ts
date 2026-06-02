import {User} from "@/app/_types";

export function getRoleName(user: User | null | undefined): string | undefined {
  return user?.role?.name;
}

export function isSuperAdmin(user: User | null | undefined): boolean {
  return getRoleName(user) === "SUPER_ADMIN";
}

const ORG_SCOPED_ROLES = new Set(["ADMIN", "KITCHEN", "WAITER", "CASH_REGISTER"]);

export function requiresOrganization(user: User | null | undefined): boolean {
  const role = getRoleName(user);
  return role != null && ORG_SCOPED_ROLES.has(role);
}

export function hasOrganization(user: User | null | undefined): boolean {
  return user?.organization_id != null || user?.organization?.id != null;
}

/** Super admin may view org catalog (beers, dishes, etc.) but not mutate it. */
export function canMutateOperationalData(user: User | null | undefined): boolean {
  return !isSuperAdmin(user);
}

/** Routes where super admin must not create or edit records. */
const OPERATIONAL_MUTATION_PATH =
  /^\/(beers|wines|drinks|foods|dishes|makers|orders|users)(\/new|\/[^/]+\/edit)\/?$/;

export function isOperationalMutationPath(pathname: string): boolean {
  return OPERATIONAL_MUTATION_PATH.test(pathname);
}

const KITCHEN_ACCESS_ROLES = new Set(["KITCHEN", "ADMIN", "WAITER", "CASH_REGISTER"]);

export function canAccessKitchen(user: User | null | undefined): boolean {
  const role = getRoleName(user);
  return role != null && KITCHEN_ACCESS_ROLES.has(role);
}

export function isKitchenStaff(user: User | null | undefined): boolean {
  return getRoleName(user) === "KITCHEN";
}

export function isAdmin(user: User | null | undefined): boolean {
  return getRoleName(user) === "ADMIN";
}

/** Org staff user management (list, create, edit, delete). */
export function canManageUsers(user: User | null | undefined): boolean {
  return isAdmin(user);
}

/** Org profile and operational settings for the authenticated tenant. */
export function canManageOrganization(user: User | null | undefined): boolean {
  return isAdmin(user);
}

/** Organization admin UI (own org for ADMIN, cross-org list for SUPER_ADMIN). */
export function canAccessOrganizations(user: User | null | undefined): boolean {
  return isSuperAdmin(user) || canManageOrganization(user);
}

const ORGANIZATION_PATH = /^\/organizations(\/|$)/;

export function isOrganizationPath(pathname: string): boolean {
  return ORGANIZATION_PATH.test(pathname);
}

/** Paths restricted to org admins (staff user management). */
const ADMIN_ONLY_PATH = /^\/users(\/|$)/;

export function isAdminOnlyPath(pathname: string): boolean {
  return ADMIN_ONLY_PATH.test(pathname);
}

/** Paths kitchen-only users may use (queue + account). */
const KITCHEN_ALLOWED_PATH = /^\/(kitchen|settings)(\/|$)/;

export function isKitchenAllowedPath(pathname: string): boolean {
  return KITCHEN_ALLOWED_PATH.test(pathname);
}
