import {describe, expect, it} from "vitest";
import {createTranslator} from "@/app/_lib/i18n";
import {localizeFormErrors} from "@/app/_lib/localize-form-errors";

describe("localizeFormErrors", () => {
  const tPt = createTranslator("pt-BR");
  const tEs = createTranslator("es");

  it("localizes dish status transition errors with translated status labels", () => {
    const messages = localizeFormErrors(
      [{field: "status", message: "Status não é possível alterar de cooking para with_the_client"}],
      "pt-BR",
      tPt
    );

    expect(messages).toEqual(["Não é possível alterar de Preparando para Com o cliente"]);
  });

  it("localizes Spanish API messages", () => {
    const messages = localizeFormErrors(
      [{field: "status", message: "Status no se puede cambiar de cooking a with_the_client"}],
      "es",
      tEs
    );

    expect(messages).toEqual(["No se puede cambiar de Cocinando a Con el cliente"]);
  });
});
