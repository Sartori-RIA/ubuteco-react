import type {TranslateFn, TranslationKey} from "@/app/_lib/i18n";

const SEGMENT_TITLE_KEYS: Record<string, TranslationKey> = {
  "": "nav.dashboard",
  beers: "nav.beers",
  "beer-styles": "nav.beerStyles",
  drinks: "nav.drinks",
  wines: "nav.wines",
  "wine-styles": "nav.wineStyles",
  dishes: "nav.dishes",
  foods: "nav.foods",
  makers: "nav.makers",
  orders: "nav.orders",
  kitchen: "nav.kitchen",
  organizations: "nav.organizations",
  tables: "nav.tables",
  users: "nav.users",
  settings: "nav.settings",
  login: "auth.signIn",
  signup: "auth.createAccount",
  "forgot-password": "auth.forgotTitle",
  "reset-password": "auth.resetTitle",
  forbidden: "forbidden.title",
};

/** @deprecated Prefer `usePageTitle()` in client components. */
export function getPageTitle(pathname: string, t: TranslateFn): string {
  if (pathname === "/settings") return t("nav.settings");

  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const key = SEGMENT_TITLE_KEYS[segment];
  if (key) return t(key);

  return t("common.appName");
}
