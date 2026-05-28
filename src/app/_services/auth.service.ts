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

async function parseAuthFailure(res: Response, fallback: string): Promise<never> {
  let message = fallback;
  try {
    const data = await res.json();
    const messages = normalizeErrors(
      data.user ?? data.organization_attributes ?? data.errors ?? data
    );
    if (messages.length > 0) {
      message = messages.join(". ");
    }
  } catch {
    // keep fallback
  }
  throw new AuthError(res.status, message);
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

  if (!res.ok && res.status !== 404) {
    await parseAuthFailure(res, "Could not send reset code");
  }
}

export async function validateResetCode(code: string): Promise<string> {
  const res = await fetch(`${getAuthBaseUrl()}/auth/code`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({code}),
  });

  if (!res.ok) {
    await parseAuthFailure(res, "Invalid or expired code");
  }

  const data = (await res.json()) as {token: string};
  if (!data.token) {
    throw new AuthError(res.status, "Reset token was not returned by the API");
  }

  setAuthToken(data.token);
  return data.token;
}

export async function resetPassword(password: string): Promise<User> {
  const token = typeof window !== "undefined" ? localStorage.getItem("ubuteco_auth_token") : null;
  if (!token) {
    throw new AuthError(401, "Reset session expired. Request a new code.");
  }

  const res = await fetch(`${getAuthBaseUrl()}/auth/reset_passwords`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({reset_params: {password}}),
  });

  if (!res.ok) {
    await parseAuthFailure(res, "Could not reset password");
  }

  const user = (await res.json()) as User;
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
