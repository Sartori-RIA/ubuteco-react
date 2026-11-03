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
  http.post(apiUrl("v1/catalog/intake/label"), () => {
    return HttpResponse.json({
      draft: {
        name: "Loba IPA",
        description: "Cítrica",
        abv: 6.5,
        ibu: 40,
        maker_name: "Loba",
        maker_id: null,
        style_name: "IPA",
        beer_style_id: null,
      },
      confidence: "low",
      warnings: ["unknown_maker", "unknown_style"],
    });
  }),
  http.post(apiUrl("v1/inventory/intake/nfe"), () => {
    return HttpResponse.json({
      lines: [
        {
          description: "Cerveja Lager",
          ean: null,
          quantity: 12,
          unit: "UN",
          unit_cost_cents: 850,
          source: "xml",
          match: {product_type: "beers", id: 1, name: "Cerveja Lager", confidence: "high"},
        },
      ],
    });
  }),
  http.post(apiUrl("v1/inventory/intake/document"), () => {
    return HttpResponse.json({
      errors: [{code: "ai_invalid_output", message: "AI returned a response that could not be used"}],
    }, {status: 502});
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
  http.get(apiUrl("v1/assistant/conversations"), () => {
    return HttpResponse.json({data: []});
  }),
  http.post(apiUrl("v1/assistant/conversations"), () => {
    return HttpResponse.json(
      {id: 1, title: null, updated_at: "2026-11-02T12:00:00Z"},
      {status: 201},
    );
  }),
  http.get(apiUrl("v1/assistant/conversations/:id"), () => {
    return HttpResponse.json({
      id: 1,
      title: null,
      updated_at: "2026-11-02T12:00:00Z",
      messages: [],
    });
  }),
  http.post(apiUrl("v1/assistant/conversations/:id/messages"), async ({request}) => {
    const body = (await request.json()) as {content?: string};
    return HttpResponse.json(
      {
        message: {
          id: 2,
          role: "assistant",
          text: body.content ?? "",
          created_at: "2026-11-02T12:00:00Z",
        },
      },
      {status: 201},
    );
  }),
  http.delete(apiUrl("v1/assistant/conversations/:id"), () => {
    return new HttpResponse(null, {status: 204});
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
