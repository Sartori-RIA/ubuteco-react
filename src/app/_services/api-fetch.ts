import {redirect} from "next/navigation";
import {PaginatedResponse} from "@/app/_types";

function handleUnauthorized() {
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

  constructor(status: number, data: string[]) {
    super("API Error");
    this.status = status;
    this.data = data;
  }
}

export async function apiFetchPaginated<T>(url: string, options: RequestInit = {}): Promise<PaginatedResponse<T>> {
  return await apiFetch<PaginatedResponse<T>>(url, options);
}

export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const token = "potato123"

  const isFormData = options.body instanceof FormData;
  let baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  if (baseUrl && !/^https?:\/\//i.test(baseUrl)) {
    baseUrl = `http://${baseUrl}`;
  }
  const path = url.replace(/^\/+/, "");
  const fullUrl = baseUrl ? `${baseUrl}/${path}` : `/${path}`;
  const res = await fetch(fullUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : {'Content-Type': 'application/json'}),
      ...options.headers
    },
    ...options
  })

  if (!res.ok) {
    switch (res.status) {
      case 401:
        handleUnauthorized()
        break
      case 403:
        handleForbidden()
        break;
      case 404:
      default:
        const data = await res.json()
        throw new ApiError(res.status, data);
    }
  }

  return await res.json() as T
}
