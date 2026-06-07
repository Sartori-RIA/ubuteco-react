import {describe, expect, it} from "vitest";
import {resolveApiErrorMessages} from "@/app/_lib/resolve-api-errors";
import {createTranslator} from "@/app/_lib/i18n";

describe("resolveApiErrorMessages", () => {
  const tPt = createTranslator("pt-BR");

  it("maps known API error codes to client i18n", () => {
    const messages = resolveApiErrorMessages(
      {
        errors: [
          {code: "insufficient_stock", message: "Insufficient stock"},
          {code: "adjustment_zero", message: "Adjustment can't be zero"},
        ],
      },
      tPt
    );

    expect(messages).toEqual([
      "Estoque insuficiente para este ajuste.",
      "Informe um ajuste diferente de zero (+ ou −).",
    ]);
  });

  it("falls back to server message for unknown codes", () => {
    const messages = resolveApiErrorMessages(
      {errors: [{code: "validation_error", message: "Name não pode ficar em branco"}]},
      tPt
    );

    expect(messages).toEqual(["Name não pode ficar em branco"]);
  });
});
