import {beforeEach, describe, expect, it, vi} from "vitest";
import {apiFetch} from "@/app/_services/api-fetch";
import {extractLabel, intakeFileError, parseInvoice, searchCatalog} from "@/app/_services/intake.service";

vi.mock("@/app/_services/api-fetch", () => ({
  apiFetch: vi.fn(),
}));

function file(size: number, type: string, name = "label.png"): File {
  return new File([new Uint8Array(size)], name, {type});
}

describe("intakeFileError", () => {
  it("accepts a small jpeg label", () => {
    expect(intakeFileError(file(100, "image/jpeg"), "label")).toBeNull();
  });

  it("rejects a label over 5 MB", () => {
    expect(intakeFileError(file(6 * 1024 * 1024, "image/jpeg"), "label")).toBe("fileTooBig");
  });

  it("rejects a pdf as a label and accepts it as an invoice", () => {
    const pdf = file(100, "application/pdf", "nota.pdf");
    expect(intakeFileError(pdf, "label")).toBe("fileType");
    expect(intakeFileError(pdf, "invoice")).toBeNull();
  });

  it("accepts an xml invoice even when the browser reports another type", () => {
    const xml = file(100, "application/octet-stream", "nota.XML");
    expect(intakeFileError(xml, "invoice")).toBeNull();
  });

  it("rejects a label with no type and accepts an invoice with no type", () => {
    const blank = file(100, "", "scan");
    expect(intakeFileError(blank, "label")).toBe("fileType");
    expect(intakeFileError(blank, "invoice")).toBeNull();
  });

  it("accepts a jpeg when the browser omits the type or reports image/jpg", () => {
    expect(intakeFileError(file(100, "", "trapel.jpg"), "label")).toBeNull();
    expect(intakeFileError(file(100, "image/jpg", "trapel.jpg"), "label")).toBeNull();
  });
});

describe("extractLabel", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("posts the photo and the product type", async () => {
    const photo = file(100, "image/jpeg");
    vi.mocked(apiFetch).mockResolvedValue({draft: {name: "Lager"}, confidence: "high", warnings: []});

    await extractLabel(photo, "beer");

    expect(apiFetch).toHaveBeenCalledWith("v1/catalog/intake/label", {
      method: "POST",
      body: expect.any(FormData),
    });
    const body = vi.mocked(apiFetch).mock.calls[0][1]?.body as FormData;
    expect(body.get("file")).toBe(photo);
    expect(body.get("product_type")).toBe("beer");
  });
});

describe("parseInvoice", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("sends an xml file to the nf-e endpoint", async () => {
    const xml = file(100, "text/xml", "nota.xml");
    vi.mocked(apiFetch).mockResolvedValue({lines: []});

    await parseInvoice(xml);

    expect(apiFetch).toHaveBeenCalledWith("v1/inventory/intake/nfe", {
      method: "POST",
      body: expect.any(FormData),
    });
  });

  it("sends a photo to the document endpoint", async () => {
    const photo = file(100, "image/png", "nota.png");
    vi.mocked(apiFetch).mockResolvedValue({lines: []});

    await parseInvoice(photo);

    expect(apiFetch).toHaveBeenCalledWith("v1/inventory/intake/document", {
      method: "POST",
      body: expect.any(FormData),
    });
  });

  it("treats an xml filename as nf-e when the type does not say xml", async () => {
    const xml = file(100, "application/octet-stream", "nota.xml");
    vi.mocked(apiFetch).mockResolvedValue({lines: []});

    await parseInvoice(xml);

    expect(apiFetch).toHaveBeenCalledWith("v1/inventory/intake/nfe", expect.any(Object));
  });
});

describe("searchCatalog", () => {
  beforeEach(() => {
    vi.mocked(apiFetch).mockReset();
  });

  it("returns the catalog rows for the query", async () => {
    vi.mocked(apiFetch).mockResolvedValue({data: [{id: 4, name: "Lager"}]});

    await expect(searchCatalog("beers", "lag")).resolves.toEqual([{id: 4, name: "Lager"}]);
    expect(apiFetch).toHaveBeenCalledWith("v1/beers?q=lag");
  });

  it("returns an empty list when the payload has no data", async () => {
    vi.mocked(apiFetch).mockResolvedValue({});

    await expect(searchCatalog("foods", "bread")).resolves.toEqual([]);
  });
});
