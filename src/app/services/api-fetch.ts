
export type ApiErrorMessages = {
  [key: string]: string[];
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorMessages;

  constructor(status: number, data: ApiErrorMessages) {
    super("API Error");
    this.status = status;
    this.data = data;
  }
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

  if (res.status === 204) {
    return {} as T
  }

  const data = await res.json()
  if (!res.ok) {
    throw new ApiError(res.status, data);
  }

  return data as T
}