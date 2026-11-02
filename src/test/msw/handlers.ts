import {http, HttpResponse} from "msw";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export function apiUrl(path: string): string {
  const base = API_BASE.replace(/\/+$/, "");
  const normalized = path.replace(/^\/+/, "");
  return `${base}/${normalized}`;
}

export const handlers = [
  http.get(apiUrl("v1/dashboard/brief"), () => {
    return HttpResponse.json({
      text: "Ontem R$ 10,00.",
      source: "template",
      generated_at: "2026-11-02T12:00:00Z",
    });
  }),
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
  http.get(apiUrl("v1/inventory/restock_suggestions"), ({request}) => {
    const coverDays = Number(new URL(request.url).searchParams.get("cover_days") ?? 7);
    const explain = new URL(request.url).searchParams.get("explain") === "1";
    return HttpResponse.json({
      cover_days: coverDays,
      window_days: 28,
      items: [
        {
          product_type: "beers",
          id: 9,
          name: "House lager",
          quantity_stock: 4,
          avg_daily: 6,
          days_of_cover: 0.7,
          suggested_quantity: 38,
          confidence: "ok",
          ...(explain ? {explanation: "Sells about 6 a day."} : {}),
        },
        {
          product_type: "foods",
          id: 3,
          name: "New bread",
          quantity_stock: 2,
          avg_daily: 0,
          days_of_cover: null,
          suggested_quantity: null,
          confidence: "low",
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
