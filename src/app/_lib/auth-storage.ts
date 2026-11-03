import {User} from "@/app/_types";

const AUTH_TOKEN_KEY = "ubuteco_auth_token";
const AUTH_USER_KEY = "ubuteco_auth_user";
const SUPPORT_SESSION_KEY = "ubuteco_support_session";
const SUPPORT_EVENT = "ubuteco-support-session";

export type SupportSessionState = {
  id: number;
  token: string;
  expiresAt: string;
  userName: string;
  organizationName: string;
  actorUser: User;
  targetUser: User;
};

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

export function getSupportSession(): SupportSessionState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SUPPORT_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SupportSessionState;
  } catch {
    return null;
  }
}

export function getSupportToken(): string | null {
  return getSupportSession()?.token ?? null;
}

export function setSupportSession(session: SupportSessionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUPPORT_SESSION_KEY, JSON.stringify(session));
  setAuthUser(session.targetUser);
  window.dispatchEvent(new Event(SUPPORT_EVENT));
}

export function clearSupportSession(): User | null {
  if (typeof window === "undefined") return null;
  const actor = getSupportSession()?.actorUser ?? null;
  localStorage.removeItem(SUPPORT_SESSION_KEY);
  if (actor) setAuthUser(actor);
  window.dispatchEvent(new Event(SUPPORT_EVENT));
  return actor;
}

export function subscribeSupportSession(listener: () => void): () => void {
  if (typeof window === "undefined") return () => undefined;
  listener();
  window.addEventListener(SUPPORT_EVENT, listener);
  return () => window.removeEventListener(SUPPORT_EVENT, listener);
}

export function getAuthBaseUrl(): string {
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api").replace(/\/+$/, "");
  return baseUrl.replace(/\/api$/i, "") || "http://localhost:3000";
}
