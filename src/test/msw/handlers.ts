import {http, HttpResponse} from "msw";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/+$/, "");
  const normalized = path.replace(/^\/+/, "");
  return `${base}/${normalized}`;
}

export const handlers = [
  http.get(apiUrl("v1/inventory/low_stock"), () => {
    return HttpResponse.json({
      threshold: 5,
      items: [
        {product_type: "beers", id: 2, name: "Low IPA", quantity_stock: 1, threshold: 5},
      ],
    });
  }),
  http.get(apiUrl("v1/inventory/expiring"), () => {
    return HttpResponse.json({
      warning_days: 7,
      items: [
        {
          product_type: "beers",
          id: 1,
          name: "Old IPA",
          valid_until: "2026-11-01T00:00:00Z",
          days_remaining: -1,
          status: "expired",
        },
        {
          product_type: "foods",
          id: 4,
          name: "Bread",
          valid_until: "2026-11-05T00:00:00Z",
          days_remaining: 3,
          status: "expiring",
        },
      ],
    });
  }),
  http.patch(apiUrl("v1/organizations/:id"), async ({request}) => {
    const body = await request.json() as {ai_enabled?: boolean};
    return HttpResponse.json({
      id: 1,
      name: "Bar",
      locale: "pt-BR",
      default_currency: "BRL",
      timezone: "America/Sao_Paulo",
      ai_enabled: body.ai_enabled ?? false,
    });
  }),
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
