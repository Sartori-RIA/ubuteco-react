import {describe, expect, it} from "vitest";
import {normalizeErrors} from "@/app/_lib/normalize-errors";

describe("normalizeErrors", () => {
  it("extracts messages from structured API errors response", () => {
    const messages = normalizeErrors({
      errors: [
        {code: "validation_error", field: "name", message: "Name não pode ficar em branco"},
        {code: "validation_error", field: "maker", message: "Maker é obrigatório(a)"},
      ],
    });

    expect(messages).toEqual([
      "Name não pode ficar em branco",
      "Maker é obrigatório(a)",
    ]);
  });

  it("extracts messages from a bare errors array", () => {
    const messages = normalizeErrors([
      {code: "insufficient_stock", message: "Insufficient stock"},
    ]);

    expect(messages).toEqual(["Insufficient stock"]);
  });

  it("supports legacy string arrays", () => {
    expect(normalizeErrors(["Email has already been taken", "Password is too short"])).toEqual([
      "Email has already been taken",
      "Password is too short",
    ]);
  });

  it("supports nested Devise-style field errors", () => {
    const messages = normalizeErrors({
      user: {
        email: ["can't be blank"],
      },
    });

    expect(messages).toEqual(["can't be blank"]);
  });

  it("returns empty array for nullish input", () => {
    expect(normalizeErrors(null)).toEqual([]);
    expect(normalizeErrors(undefined)).toEqual([]);
  });
});
