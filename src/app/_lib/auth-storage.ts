import {User} from "@/app/_types";

const AUTH_TOKEN_KEY = "ubuteco_auth_token";
const AUTH_USER_KEY = "ubuteco_auth_user";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function setAuthUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearAuthUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAuthBaseUrl(): string {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api").replace(/\/+$/, "");
  return baseUrl.replace(/\/api$/i, "") || "http://localhost:3000";
}
