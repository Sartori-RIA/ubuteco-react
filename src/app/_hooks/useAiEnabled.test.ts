import {describe, expect, it} from "vitest";
import {aiEnabledFor} from "@/app/_hooks/useAiEnabled";
import {User} from "@/app/_types";

function user(partial: Partial<User>): User {
  return {id: 1, name: "Test", email: "test@example.com", ...partial} as User;
}

describe("aiEnabledFor", () => {
  it("is false when the organization is missing", () => {
    expect(aiEnabledFor(null)).toBe(false);
    expect(aiEnabledFor(user({role: {id: 1, name: "ADMIN"}}))).toBe(false);
  });

  it("is false for a super admin without an organization", () => {
    expect(aiEnabledFor(user({role: {id: 1, name: "SUPER_ADMIN"}, organization: undefined}))).toBe(false);
  });

  it("is true only when the organization flag is on", () => {
    expect(aiEnabledFor(user({
      role: {id: 1, name: "ADMIN"},
      organization: {id: 4, ai_enabled: true},
    }))).toBe(true);
    expect(aiEnabledFor(user({
      role: {id: 1, name: "ADMIN"},
      organization: {id: 4, ai_enabled: false},
    }))).toBe(false);
  });
});
