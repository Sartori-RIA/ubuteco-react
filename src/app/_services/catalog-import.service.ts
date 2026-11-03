import {ApiError, apiFetch} from "@/app/_services/api-fetch";
import {getAuthToken} from "@/app/_lib/auth-storage";

export const MAX_IMPORT_BYTES = 1_048_576;

export type ImportStatus = "queued" | "running" | "completed" | "failed";

export type ImportRowLog = {
  line: number;
  name: string;
  status: "created" | "failed";
  errors: string[];
};

export type CatalogImport = {
  id: number;
  product_type: string;
  status: ImportStatus;
  total_rows: number;
  created_rows: number;
  failed_rows: number;
  processed_rows: number;
  error_message: string | null;
  enqueued_at: string | null;
  started_at: string | null;
  finished_at: string | null;
  estimated_start_at: string | null;
  row_log?: ImportRowLog[];
};

export class ImportFileError extends Error {
  code: "too_large" | "not_csv";

  constructor(code: "too_large" | "not_csv") {
    super(code);
    this.code = code;
  }
}

export class ImportInProgressError extends Error {
  id: number;

  constructor(id: number) {
    super("import_in_progress");
    this.id = id;
  }
}

export function shouldPoll(status: ImportStatus): boolean {
  return status === "queued" || status === "running";
}

export async function listImports(): Promise<CatalogImport[]> {
  return apiFetch<CatalogImport[]>("v1/catalog/imports");
}

export async function getImport(id: number): Promise<CatalogImport> {
  return apiFetch<CatalogImport>(`v1/catalog/imports/${id}`);
}

export function templatePath(productType: string): string {
  return `v1/catalog/imports/template?product_type=${encodeURIComponent(productType)}`;
}

export async function downloadTemplate(productType: string): Promise<void> {
  const token = getAuthToken();
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  const url = `${base}/${templatePath(productType)}`;
  const res = await fetch(url, {
    headers: token ? {Authorization: `Bearer ${token}`} : {},
  });
  if (!res.ok) {
    throw new ApiError(res.status, await res.json().catch(() => null));
  }
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `${productType}.csv`;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

export async function createImport(file: File, productType: string): Promise<CatalogImport> {
  if (!file.name.toLowerCase().endsWith(".csv")) {
    throw new ImportFileError("not_csv");
  }
  if (file.size > MAX_IMPORT_BYTES) {
    throw new ImportFileError("too_large");
  }

  const body = new FormData();
  body.append("file", file);
  body.append("product_type", productType);

  try {
    return await apiFetch<CatalogImport>("v1/catalog/imports", {method: "POST", body});
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      const payload = error.payload as {id?: number} | null;
      if (payload?.id) throw new ImportInProgressError(payload.id);
    }
    throw error;
  }
}
