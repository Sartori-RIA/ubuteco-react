import {Organization, OrganizationOperationalStatus} from "@/app/_types/organization";

export function isOrganizationKitchenOpen(
  organization: Organization | null | undefined
): boolean {
  return organization?.operational_status === "open";
}

export function nextOperationalStatus(
  current: OrganizationOperationalStatus | undefined
): OrganizationOperationalStatus {
  return current === "open" ? "closed" : "open";
}
