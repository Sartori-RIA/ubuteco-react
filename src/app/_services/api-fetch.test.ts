import {beforeEach, describe, expect, it, vi} from "vitest";
import {apiFetch, ApiError} from "@/app/_services/api-fetch";

describe("apiFetch AI errors", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("returns the AI kill-switch error instead of sending the user to forbidden", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 403,
      json: async () => ({errors: [{code: "ai_disabled", message: "off"}]}),
    } as Response);

    await expect(apiFetch("v1/organizations/1", {method: "PATCH"})).rejects.toBeInstanceOf(ApiError);
  });
});
