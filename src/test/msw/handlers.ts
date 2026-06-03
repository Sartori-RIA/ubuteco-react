import {http, HttpResponse} from "msw";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/+$/, "");
  const normalized = path.replace(/^\/+/, "");
  return `${base}/${normalized}`;
}

export const handlers = [
  http.get(apiUrl("v1/users"), () => {
    return HttpResponse.json({
      data: [
        {
          id: 1,
          name: "Kitchen User",
          email: "kitchen@example.com",
          role: {id: 2, name: "KITCHEN"},
        },
      ],
      meta: {count: 1, page: 1, pages: 1, last: 1, previous: null},
    });
  }),
];
