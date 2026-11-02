import {redirect} from "next/navigation";
import {PaginatedResponse} from "@/app/_types";
import {clearAuthToken, clearAuthUser, clearSupportSession, getAuthToken, getSupportToken} from "@/app/_lib/auth-storage";
import {normalizeErrors} from "@/app/_lib/normalize-errors";
import {extractApiErrorItems, type ApiErrorItem} from "@/app/_lib/api-errors";

export type {ApiErrorItem};

function handleUnauthorized() {
  clearAuthToken();
  clearAuthUser();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  } else {
    redirect("/login");
  }
}

function handleForbidden() {
  if (typeof window !== "undefined") {
    window.location.href = "/forbidden";
  } else {
    redirect("/forbidden");
  }
}

export class ApiError extends Error {
  status: number;
  data: string[];
  items: ApiErrorItem[];

  constructor(status: number, data: unknown) {
    super("API Error");
    this.status = status;
    this.items = extractApiErrorItems(data);
    this.data = normalizeErrors(data);
  }
}

export async function apiFetchPaginated<T>(url: string, options: RequestInit = {}): Promise<PaginatedResponse<T>> {
  return await apiFetch<PaginatedResponse<T>>(url, options);
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  let baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  if (baseUrl && !/^https?:\/\//i.test(baseUrl)) {
    baseUrl = `http://${baseUrl}`;
  }
  const path = url.replace(/^\/+/, "");
  const fullUrl = baseUrl ? `${baseUrl}/${path}` : `/${path}`;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : {"Content-Type": "application/json"}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const explicitAuthorization = headers.Authorization || headers.authorization;
  const supportToken = explicitAuthorization ? null : getSupportToken();
  const token = supportToken ?? (explicitAuthorization ? null : getAuthToken());
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!res.ok) {
    switch (res.status) {
      case 401:
        if (supportToken) {
          clearSupportSession();
          if (typeof window !== "undefined") {
            sessionStorage.setItem("ubuteco_support_notice", "expired");
            window.location.href = "/platform/organizations";
          }
          return undefined as T;
        }
        handleUnauthorized()
        break
      case 403: {
        const data = await res.json().catch(() => ({}));
        const code = extractApiErrorItems(data)[0]?.code;
        if (code === "impersonation_forbidden") {
          throw new ApiError(403, data);
        }
        handleForbidden()
        return undefined as T;
      }
      case 404:
      default:
        const data = await res.json()
        throw new ApiError(res.status, data);
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}
