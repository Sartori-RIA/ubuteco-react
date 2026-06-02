import {describe, expect, it} from "vitest";
import {
  isOrganizationKitchenOpen,
  nextOperationalStatus,
} from "@/app/_lib/organization-operational";

describe("organization-operational", () => {
  it("detects open kitchen from operational_status", () => {
    expect(isOrganizationKitchenOpen({operational_status: "open"})).toBe(true);
    expect(isOrganizationKitchenOpen({operational_status: "closed"})).toBe(false);
  });

  it("toggles operational status for API PATCH payload", () => {
    expect(nextOperationalStatus("open")).toBe("closed");
    expect(nextOperationalStatus("closed")).toBe("open");
    expect(nextOperationalStatus(undefined)).toBe("open");
  });
});
