export type IntakeProductType = "beers" | "wines" | "drinks" | "foods";

export type LabelDraft = {
  name: string;
  description: string;
  abv: number | null;
  ibu?: number | null;
  grapes?: string;
  vintage_wine?: number | null;
  maker_name: string;
  maker_id: number | null;
  style_name: string;
  beer_style_id?: number | null;
  wine_style_id?: number | null;
};

export type LabelDraftResponse = {
  draft: LabelDraft;
  confidence: "high" | "low";
  warnings: string[];
};

export type InvoiceMatch = {
  product_type: IntakeProductType;
  id: number;
  name: string;
  confidence: "high" | "low";
} | null;

export type InvoiceLine = {
  description: string;
  ean: string | null;
  quantity: number;
  unit: string;
  unit_cost_cents: number;
  source: "xml" | "ai";
  match: InvoiceMatch;
};
