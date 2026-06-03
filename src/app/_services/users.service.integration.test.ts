import {beforeEach, describe, expect, it, vi} from "vitest";
import {http, HttpResponse} from "msw";
import {server} from "@/test/msw/server";
import {apiUrl} from "@/test/msw/handlers";
import {usersService} from "@/app/_services/users.service";

vi.mock("@/app/_lib/auth-storage", () => ({
  getAuthToken: () => "test-token",
}));

describe("usersService integration (MSW)", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3000";
  });

  it("fetches paginated users from the API", async () => {
    const result = await usersService.fetchAll({search: "", page: 1});

    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.email).toBe("kitchen@example.com");
  });

  it("does not send organization_id in list requests", async () => {
    let requestUrl = "";

    server.use(
      http.get(apiUrl("v1/users"), ({request}) => {
        requestUrl = request.url;
        return HttpResponse.json({data: [], meta: {count: 0, page: 1, pages: 1, last: 0, previous: null}});
      })
    );

    await usersService.fetchAll({page: 1});

    expect(requestUrl).not.toContain("organization_id");
  });
});
