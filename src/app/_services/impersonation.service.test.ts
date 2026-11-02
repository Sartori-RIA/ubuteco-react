import {http, HttpResponse} from "msw";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {apiUrl} from "@/test/msw/handlers";
import {server} from "@/test/msw/server";
import {leaveImpersonation, startImpersonation} from "@/app/_services/impersonation.service";

vi.mock("@/app/_lib/auth-storage", () => ({
  getAuthToken: () => "actor-token",
  getSupportToken: () => null,
  clearAuthToken: vi.fn(),
  clearAuthUser: vi.fn(),
  clearSupportSession: vi.fn(),
}));

describe("impersonation service", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
  });

  it("starts a session and does not keep a password", async () => {
    server.use(http.post(apiUrl("v1/platform/impersonations"), async ({request}) => {
      const body = await request.json() as {user_id: number; reason: string};
      expect(body).toEqual({user_id: 7, reason: "Reproduce the kitchen bug"});
      return HttpResponse.json({
        id: 3,
        token: "support-token",
        expires_at: "2026-11-02T16:00:00Z",
        user: {id: 7, name: "Ana", email: "ana@bar.com", role: {id: 2, name: "ADMIN"}},
        organization: {id: 4, name: "Bar"},
      }, {status: 201});
    }));

    const started = await startImpersonation(7, "Reproduce the kitchen bug");
    expect(started.token).toBe("support-token");
    expect(JSON.stringify(started)).not.toContain("password");
  });

  it("returns the super-admin target error", async () => {
    server.use(http.post(apiUrl("v1/platform/impersonations"), () => {
      return HttpResponse.json({errors: [{code: "impersonation_target_invalid", message: "no"}]}, {status: 422});
    }));

    await expect(startImpersonation(1, "Reproduce the kitchen bug")).rejects.toMatchObject({status: 422});
  });

  it("returns 403 when the support session cannot do that", async () => {
    server.use(http.post(apiUrl("v1/platform/impersonations"), () => {
      return HttpResponse.json({
        errors: [{code: "impersonation_forbidden", message: "blocked"}],
      }, {status: 403});
    }));

    await expect(startImpersonation(1, "Reproduce the kitchen bug")).rejects.toMatchObject({status: 403});
  });

  it("leaves with the super-admin token", async () => {
    let authorization = "";
    server.use(http.delete(apiUrl("v1/platform/impersonations/3"), ({request}) => {
      authorization = request.headers.get("authorization") ?? "";
      return new HttpResponse(null, {status: 204});
    }));

    await leaveImpersonation(3);
    expect(authorization).toBe("Bearer actor-token");
  });
});
