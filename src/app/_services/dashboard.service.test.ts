import {beforeEach, describe, expect, it, vi} from "vitest";
import {dashboardService} from "@/app/_services/dashboard.service";
import {apiFetch} from "@/app/_services/api-fetch";

vi.mock("@/app/_services/api-fetch", () => ({
  apiFetch: vi.fn(),
}));

describe("dashboardService", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("fetches summary with date params", async () => {
    vi.mocked(apiFetch).mockResolvedValue({revenue_cents: 1000});

    await dashboardService.fetchSummary({from: "2026-05-01", to: "2026-05-07"});

    expect(apiFetch).toHaveBeenCalledWith("v1/dashboard/summary?from=2026-05-01&to=2026-05-07");
  });

  it("fetches revenue series", async () => {
    vi.mocked(apiFetch).mockResolvedValue({points: []});

    await dashboardService.fetchSeries({from: "2026-05-01", to: "2026-05-07"});

    expect(apiFetch).toHaveBeenCalledWith(
      "v1/dashboard/series?from=2026-05-01&to=2026-05-07&grain=day&metric=revenue"
    );
  });
});
