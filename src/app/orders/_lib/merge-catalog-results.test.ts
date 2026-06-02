import {describe, expect, it} from "vitest";
import {mergeCatalogResults} from "@/app/orders/_lib/merge-catalog-results";
import {Beer} from "@/app/_types/beer";

const beer = (id: number, name: string): Beer => ({
  id,
  name,
  ibu: 10,
  abv: 5,
  image_url: "",
});

describe("mergeCatalogResults", () => {
  it("merges store products missing from API when query matches name", () => {
    const api = [beer(1, "Existing IPA")];
    const store = [beer(2, "Fresh Lager")];

    const merged = mergeCatalogResults(api, store, "lager");

    expect(merged).toHaveLength(2);
    expect(merged.map((item) => item.id)).toEqual([1, 2]);
  });

  it("does not duplicate products already returned by the API", () => {
    const api = [beer(1, "Existing IPA")];
    const store = [beer(1, "Existing IPA")];

    expect(mergeCatalogResults(api, store, "ipa")).toHaveLength(1);
  });

  it("ignores store products that do not match the query", () => {
    const store = [beer(2, "Fresh Lager")];

    expect(mergeCatalogResults([], store, "stout")).toHaveLength(0);
  });
});
