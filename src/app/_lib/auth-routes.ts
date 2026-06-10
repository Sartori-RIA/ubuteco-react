export const AUTH_PUBLIC_PATHS = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
] as const;

export function isAuthPublicPath(pathname: string): boolean {
  return (AUTH_PUBLIC_PATHS as readonly string[]).includes(pathname);
}

/** Routes that render without the authenticated app shell (sidebar). */
export function isMarketingShellPath(pathname: string, authenticated: boolean): boolean {
  if (isAuthPublicPath(pathname)) return true;
  return pathname === "/" && !authenticated;
}
