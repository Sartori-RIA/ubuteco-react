import {User} from "@/app/_types";

export function getRoleName(user: User | null | undefined): string | undefined {
  return user?.role?.name;
}

export function isSuperAdmin(user: User | null | undefined): boolean {
  return getRoleName(user) === "SUPER_ADMIN";
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
