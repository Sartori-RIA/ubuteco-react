import {User} from "@/app/_types";
import {clearAuthToken, clearAuthUser, getAuthBaseUrl, setAuthToken, setAuthUser} from "@/app/_lib/auth-storage";

export class AuthError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) return null;
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? authorizationHeader;
}

export async function signIn(email: string, password: string): Promise<User> {
  const res = await fetch(`${getAuthBaseUrl()}/auth/sign_in`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({user: {email, password}}),
  });

  if (!res.ok) {
    throw new AuthError(res.status, "Invalid credentials");
  }

  const token = extractBearerToken(res.headers.get("Authorization"));
  if (!token) {
    throw new AuthError(res.status, "Authentication token was not returned by the API");
  }

  const user = (await res.json()) as User;
  setAuthToken(token);
  setAuthUser(user);
  return user;
}

export async function signOut(): Promise<void> {
  const token = typeof window !== "undefined" ? localStorage.getItem("ubuteco_auth_token") : null;

  if (token) {
    try {
      await fetch(`${getAuthBaseUrl()}/auth/sign_out`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Clear local session even if the API is unavailable
    }
  }

  clearAuthToken();
  clearAuthUser();
}
