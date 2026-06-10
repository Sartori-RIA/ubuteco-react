export const AUTH_PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

export const MARKETING_PUBLIC_PATHS = ["/terms", "/privacy"] as const;

export type AuthShellSession = {
  ready: boolean;
  authenticated: boolean;
};

export function isAuthPublicPath(pathname: string): boolean {
  return (AUTH_PUBLIC_PATHS as readonly string[]).includes(pathname);
}

/** Routes that render without the authenticated app shell (sidebar). */
export function isMarketingShellPath(pathname: string, session: AuthShellSession): boolean {
  if (isAuthPublicPath(pathname)) return true;
  if ((MARKETING_PUBLIC_PATHS as readonly string[]).includes(pathname)) return true;
  if (pathname === "/") {
    if (!session.ready) return true;
    return !session.authenticated;
  }
  return false;
}
