const SEGMENT_TITLES: Record<string, string> = {
  "": "Dashboard",
  beers: "Beers",
  "beer-styles": "Beer styles",
  drinks: "Drinks",
  wines: "Wines",
  "wine-styles": "Wine styles",
  dishes: "Dishes",
  foods: "Foods",
  makers: "Makers",
  orders: "Orders",
  organizations: "Organizations",
  tables: "Tables",
  users: "Users",
  settings: "Settings",
  login: "Sign in",
  signup: "Create account",
  "forgot-password": "Forgot password",
  "reset-password": "Reset password",
  forbidden: "Forbidden",
};

export function getPageTitle(pathname: string): string {
  if (pathname === "/settings") return "Settings";
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  return SEGMENT_TITLES[segment] ?? "Ubuteco";
}
