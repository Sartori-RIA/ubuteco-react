import {describe, expect, it} from "vitest";
import {defaultDashboardRange, isValidDashboardRange} from "@/app/_lib/dashboard-date-range";

describe("dashboard-date-range", () => {
  it("returns a 7-day inclusive range", () => {
    const range = defaultDashboardRange("UTC");
    expect(range.from <= range.to).toBe(true);
    expect(isValidDashboardRange(range.from, range.to)).toBe(true);
  });

  it("rejects invalid or oversized ranges", () => {
    expect(isValidDashboardRange("2026-05-10", "2026-05-01")).toBe(false);
    expect(isValidDashboardRange("2026-01-01", "2026-05-01")).toBe(false);
  });
});
