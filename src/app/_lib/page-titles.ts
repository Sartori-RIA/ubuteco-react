import type {TranslateFn, TranslationKey} from "@/app/_lib/i18n";

export const APP_NAME = "uButeco";

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
  inventory: "nav.inventory",
  users: "nav.users",
  settings: "nav.settings",
  login: "auth.signIn",
  signup: "auth.createAccount",
  "forgot-password": "auth.forgotTitle",
  "reset-password": "auth.resetTitle",
  forbidden: "forbidden.title",
};

const NEW_ROUTE_KEYS: Record<string, TranslationKey> = {
  orders: "orders.new",
  beers: "forms.newBeer",
  drinks: "forms.newDrink",
  wines: "forms.newWine",
  dishes: "forms.newDish",
  foods: "forms.newFood",
  makers: "forms.newMaker",
  users: "users.form.newTitle",
};

const EDIT_ROUTE_KEYS: Record<string, TranslationKey> = {
  beers: "forms.updateBeer",
  drinks: "forms.updateDrink",
  wines: "forms.updateWine",
  dishes: "forms.updateDish",
  foods: "forms.updateFood",
  makers: "forms.updateMaker",
  users: "users.form.editTitle",
};

export function formatDocumentTitle(label: string): string {
  const trimmed = label.trim();
  if (!trimmed || trimmed === APP_NAME) return APP_NAME;
  return `${APP_NAME} | ${trimmed}`;
}

export function getPageTitle(pathname: string, t: TranslateFn): string {
  return resolveRouteTitle(pathname, t);
}

export function getDocumentTitle(pathname: string, t: TranslateFn): string {
  return formatDocumentTitle(resolveRouteTitle(pathname, t));
}

function resolveRouteTitle(pathname: string, t: TranslateFn): string {
  if (pathname === "/" || pathname === "") return t("nav.dashboard");
  if (pathname === "/settings") return t("nav.settings");

  const parts = pathname.split("/").filter(Boolean);
  const [segment, second, third] = parts;

  if (second === "new") {
    const newKey = NEW_ROUTE_KEYS[segment];
    if (newKey) return t(newKey);
  }

  if (third === "edit" && second && isNumericId(second)) {
    const editKey = EDIT_ROUTE_KEYS[segment];
    if (editKey) return t(editKey);
  }

  if (segment === "orders" && second && isNumericId(second)) {
    return t("orders.orderNumber", {id: second});
  }

  if (second && isNumericId(second) && !third) {
    const navKey = SEGMENT_TITLE_KEYS[segment];
    if (navKey) return `${t(navKey)} #${second}`;
  }

  const key = SEGMENT_TITLE_KEYS[segment];
  if (key) return t(key);

  return t("common.appName");
}

function isNumericId(value: string): boolean {
  return /^\d+$/.test(value);
}

export function formatEditTitle(name: string, t: TranslateFn): string {
  return t("pageTitles.editName", {name});
}
