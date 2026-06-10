import {describe, expect, it} from "vitest";
import {createTranslator} from "@/app/_lib/i18n";
import {
  formatDocumentTitle,
  formatEditTitle,
  getDocumentTitle,
  getPageTitle,
} from "@/app/_lib/page-titles";

const t = createTranslator("en");

describe("formatDocumentTitle", () => {
  it("prefixes labels with the app name", () => {
    expect(formatDocumentTitle("Orders")).toBe("uButeco | Orders");
  });

  it("returns the app name alone for empty or app-only labels", () => {
    expect(formatDocumentTitle("")).toBe("uButeco");
    expect(formatDocumentTitle("uButeco")).toBe("uButeco");
  });
});

describe("getPageTitle", () => {
  it("maps static routes", () => {
    expect(getPageTitle("/", t)).toBe("Dashboard");
    expect(getPageTitle("/orders", t)).toBe("Orders");
    expect(getPageTitle("/kitchen", t)).toBe("Kitchen");
    expect(getPageTitle("/login", t)).toBe("Sign in");
  });

  it("maps new and edit sub-routes", () => {
    expect(getPageTitle("/orders/new", t)).toBe("New order");
    expect(getPageTitle("/beers/new", t)).toBe("New Beer");
    expect(getPageTitle("/beers/42/edit", t)).toBe("Update Beer");
    expect(getPageTitle("/users/new", t)).toBe("New staff user");
  });

  it("maps order detail by id", () => {
    expect(getPageTitle("/orders/42", t)).toBe("Order #42");
  });

  it("maps generic detail routes with id fallback", () => {
    expect(getPageTitle("/beers/7", t)).toBe("Beers #7");
  });
});

describe("getDocumentTitle", () => {
  it("formats static routes for the browser tab", () => {
    expect(getDocumentTitle("/orders", t)).toBe("uButeco | Orders");
    expect(getDocumentTitle("/orders/new", t)).toBe("uButeco | New order");
  });
});

describe("formatEditTitle", () => {
  it("includes the entity name", () => {
    expect(formatEditTitle("IPA House", t)).toBe("Edit IPA House");
  });
});
