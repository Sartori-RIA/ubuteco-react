import {describe, expect, it} from "vitest";
import {formatDurationSeconds} from "@/app/_lib/format-duration";

describe("formatDurationSeconds", () => {
  it("formats minutes and seconds", () => {
    expect(formatDurationSeconds(610)).toBe("10m 10s");
    expect(formatDurationSeconds(45)).toBe("45s");
    expect(formatDurationSeconds(0)).toBe("—");
  });
});
