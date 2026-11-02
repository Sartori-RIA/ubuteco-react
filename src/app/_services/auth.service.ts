import {SignUpPayload, User} from "@/app/_types";
import {normalizeErrors} from "@/app/_lib/normalize-errors";
import {
  clearAuthToken,
  clearAuthUser,
  getAuthBaseUrl,
  setAuthToken,
  setAuthUser,
} from "@/app/_lib/auth-storage";

export class AuthError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, message: string, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

function extractBearerToken(authorizationHeader: string | null): string | null {
  if (!authorizationHeader) return null;
  const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? authorizationHeader;
}

async function parseAuthFailure(res: Response, fallback: string): Promise<never> {
  let message = fallback;
  let payload: unknown;
  try {
    payload = await res.json();
    const data = payload as {user?: unknown; organization_attributes?: unknown; errors?: unknown};
    const messages = normalizeErrors(
      data.user ?? data.organization_attributes ?? data.errors ?? data
    );
    if (messages.length > 0) {
      message = messages.join(". ");
    }
  } catch {
    // keep fallback
  }
  throw new AuthError(res.status, message, payload);
}

async function persistSessionFromResponse(res: Response): Promise<User> {
  const token = extractBearerToken(res.headers.get("Authorization"));
  if (!token) {
    throw new AuthError(res.status, "Authentication token was not returned by the API");
  }

  const user = (await res.json()) as User;
  setAuthToken(token);
  setAuthUser(user);
  return user;
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
    await parseAuthFailure(res, "Invalid credentials");
  }

  return persistSessionFromResponse(res);
}

export async function signUp(payload: SignUpPayload): Promise<User> {
  const res = await fetch(`${getAuthBaseUrl()}/auth/sign_up`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    await parseAuthFailure(res, "Could not create account");
  }

  return persistSessionFromResponse(res);
}

export async function requestPasswordReset(email: string): Promise<void> {
  const res = await fetch(`${getAuthBaseUrl()}/auth/password`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({email}),
  });

  if (!res.ok) {
    await parseAuthFailure(res, "Could not send reset link");
  }
}

export async function setPasswordFromLink(token: string, password: string): Promise<void> {
  const res = await fetch(`${getAuthBaseUrl()}/auth/password`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      reset_password_token: token,
      password,
      password_confirmation: password,
    }),
  });

  if (!res.ok) {
    await parseAuthFailure(res, "Could not reset password");
  }
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
