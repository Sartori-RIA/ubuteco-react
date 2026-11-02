import {describe, expect, it} from "vitest";
import {intakeFileError} from "@/app/_services/intake.service";

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
});
