import {apiFetch} from "@/app/_services/api-fetch";
import {InvoiceLine, LabelDraftResponse} from "@/app/_types/intake";

export const INTAKE_MAX_BYTES = 5 * 1024 * 1024;

const IMAGE_TYPES = ["image/jpeg", "image/png"];
const INVOICE_TYPES = ["application/xml", "text/xml", "text/plain", "application/pdf", "image/jpeg", "image/png"];

export function intakeFileError(file: File, kind: "label" | "invoice"): "fileTooBig" | "fileType" | null {
  if (file.size > INTAKE_MAX_BYTES) return "fileTooBig";
  const allowed = kind === "label" ? IMAGE_TYPES : INVOICE_TYPES;
  const xmlName = file.name.toLowerCase().endsWith(".xml");
  if (file.type && !allowed.includes(file.type) && !xmlName) return "fileType";
  if (!file.type && kind === "label") return "fileType";
  return null;
}

export async function extractLabel(file: File, productType: "beer" | "wine"): Promise<LabelDraftResponse> {
  const body = new FormData();
  body.set("file", file);
  body.set("product_type", productType);
  return apiFetch<LabelDraftResponse>("v1/catalog/intake/label", {method: "POST", body});
}

export async function parseInvoice(file: File): Promise<{lines: InvoiceLine[]}> {
  const body = new FormData();
  body.set("file", file);
  const xml = file.type.includes("xml") || file.name.toLowerCase().endsWith(".xml");
  const path = xml ? "v1/inventory/intake/nfe" : "v1/inventory/intake/document";
  return apiFetch<{lines: InvoiceLine[]}>(path, {method: "POST", body});
}

export async function searchCatalog(productType: string, query: string): Promise<{id: number; name: string}[]> {
  const params = new URLSearchParams({q: query});
  const payload = await apiFetch<{data: {id: number; name: string}[]}>(`v1/${productType}?${params.toString()}`);
  return payload.data ?? [];
}
