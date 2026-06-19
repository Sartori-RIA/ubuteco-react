import {beforeEach, describe, expect, it, vi} from "vitest";
import {http, HttpResponse} from "msw";
import {server} from "@/test/msw/server";
import {apiUrl} from "@/test/msw/handlers";
import {ordersService} from "@/app/_services/orders.service";

vi.mock("@/app/_lib/auth-storage", () => ({
  getAuthToken: () => "org-a-token",
}));

describe("tenant isolation (MSW)", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
    vi.stubGlobal("window", {location: {href: ""}});
  });

  it("redirects to forbidden when API returns 403 for another org order", async () => {
    server.use(
      http.get(apiUrl("v1/orders/999"), () => new HttpResponse(null, {status: 403}))
    );

    await ordersService.show(999);

    expect(window.location.href).toBe("/forbidden");
  });

  it("creates an order without sending organization_id in the body", async () => {
    let capturedBody: Record<string, unknown> | undefined;

    server.use(
      http.post(apiUrl("v1/orders"), async ({request}) => {
        capturedBody = (await request.json()) as Record<string, unknown>;
        return HttpResponse.json({id: 10, status: "open"});
      })
    );

    await ordersService.create({table_id: 3});

    expect(capturedBody).toEqual({table_id: 3});
    expect(capturedBody).not.toHaveProperty("organization_id");
  });
});
