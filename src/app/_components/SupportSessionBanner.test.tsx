/**
 * @vitest-environment jsdom
 */
import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {SupportSessionBanner} from "@/app/_components/SupportSessionBanner";

vi.mock("@/app/_hooks/useTranslations", () => ({
  useTranslations: () => (key: string, vars?: Record<string, string>) => {
    if (key === "supportSession.leave") return "Leave";
    return `${vars?.name ?? ""} ${vars?.organization ?? ""}`.trim();
  },
}));
import {
  clearSupportSession,
  getAuthUser,
  setAuthUser,
  setSupportSession,
  SupportSessionState,
} from "@/app/_lib/auth-storage";

const actor = {id: 1, name: "Support"};
const session: SupportSessionState = {
  id: 3,
  token: "support-token",
  expiresAt: "2026-11-02T16:00:00Z",
  userName: "Ana",
  organizationName: "Bar",
  actorUser: actor,
  targetUser: {id: 7, name: "Ana"},
};

describe("support session banner", () => {
  it("shows the target and the leave button", () => {
    const onLeave = vi.fn();
    render(<SupportSessionBanner session={session} onLeave={onLeave}/>);

    expect(screen.getByText(/Ana/)).toBeInTheDocument();
    expect(screen.getByText(/Bar/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button"));
    expect(onLeave).toHaveBeenCalled();
  });

  it("restores the super admin when the session ends", () => {
    setAuthUser(actor);
    setSupportSession(session);

    expect(getAuthUser()?.name).toBe("Ana");
    expect(clearSupportSession()?.name).toBe("Support");
    expect(getAuthUser()?.name).toBe("Support");
  });
});
