import {beforeEach, describe, expect, it, vi} from "vitest";
import {organizationsService} from "@/app/_services/organizations.service";
import {apiFetch} from "@/app/_services/api-fetch";

vi.mock("@/app/_services/api-fetch", () => ({
  apiFetch: vi.fn(),
}));

describe("organizationsService.update", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("PATCHes regional settings to the organization endpoint", async () => {
    const payload = {
      locale: "pt-BR",
      default_currency: "BRL",
      timezone: "America/Sao_Paulo",
    };
    const updated = {id: 42, name: "Bar", ...payload};
    vi.mocked(apiFetch).mockResolvedValue(updated);

    const result = await organizationsService.update(42, payload);

    expect(apiFetch).toHaveBeenCalledWith("v1/organizations/42", {
      body: JSON.stringify(payload),
      method: "PATCH",
    });
    expect(result).toEqual(updated);
  });

  it("PATCHes multipart profile updates", async () => {
    const formData = new FormData();
    formData.set("name", "Bar");
    const updated = {id: 42, name: "Bar"};
    vi.mocked(apiFetch).mockResolvedValue(updated);

    const result = await organizationsService.updateForm(42, formData);

    expect(apiFetch).toHaveBeenCalledWith("v1/organizations/42", {
      body: formData,
      method: "PATCH",
    });
    expect(result).toEqual(updated);
  });
});
