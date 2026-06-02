import {describe, expect, it} from "vitest";
import {formatAmount, formatDate, formatMoney} from "@/app/_lib/format";

describe("formatMoney", () => {
  it("formats cents with org locale and currency", () => {
    const result = formatMoney(12345, {locale: "en", currency: "USD"});
    expect(result).toBe("$123.45");
  });

  it("formats BRL in pt-BR locale", () => {
    const result = formatMoney(999, {locale: "pt-BR", currency: "BRL"});
    expect(result.replace(/\u00a0/g, " ")).toMatch(/R\$\s?9,99/);
  });

  it("returns em dash for nullish values", () => {
    expect(formatMoney(null)).toBe("—");
    expect(formatMoney(undefined)).toBe("—");
  });
});

describe("formatAmount", () => {
  it("formats decimal amounts", () => {
    const result = formatAmount(12.5, {locale: "en", currency: "EUR"});
    expect(result).toMatch(/12\.50|12,50/);
  });
});

describe("formatDate", () => {
  it("formats dates in org timezone", () => {
    const result = formatDate("2026-05-27T15:00:00.000Z", {
      locale: "en",
      timezone: "America/Sao_Paulo",
      dateStyle: "medium",
    });
    expect(result).toMatch(/May|27|2026/);
  });

  it("returns em dash for invalid dates", () => {
    expect(formatDate("")).toBe("—");
    expect(formatDate("not-a-date")).toBe("—");
  });
});
