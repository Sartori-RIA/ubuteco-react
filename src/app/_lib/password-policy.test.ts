import {describe, expect, it} from "vitest";
import {passwordIssue} from "@/app/_lib/password-policy";

describe("password forms", () => {
  it("asks for the current password when a new one is filled in", () => {
    expect(passwordIssue({
      password: "brand-new-secret",
      confirmation: "brand-new-secret",
      requireCurrent: true,
    })).toBe("current_required");
  });

  it("rejects a password shorter than 12 characters", () => {
    expect(passwordIssue({
      password: "123123123",
      confirmation: "123123123",
      currentPassword: "factory-secret",
      requireCurrent: true,
    })).toBe("too_short");
  });

  it("rejects a confirmation that does not match", () => {
    expect(passwordIssue({
      password: "brand-new-secret",
      confirmation: "other-new-secret",
      currentPassword: "factory-secret",
      requireCurrent: true,
    })).toBe("mismatch");
  });

  it("leaves the password alone when the new one is blank", () => {
    expect(passwordIssue({
      password: "",
      confirmation: "",
      requireCurrent: true,
    })).toBeNull();
  });
});
