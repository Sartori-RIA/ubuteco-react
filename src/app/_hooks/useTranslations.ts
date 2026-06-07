"use client";

import {useMemo} from "react";
import {usePathname} from "next/navigation";
import {createTranslator, TranslateFn, TranslationKey} from "@/app/_lib/i18n";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";

export function useTranslations(): TranslateFn {
  const {locale} = useOrganizationSettings();

  return useMemo(() => createTranslator(locale), [locale]);
}

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

export function usePageTitle(): string {
  const pathname = usePathname();
  const t = useTranslations();

  if (pathname === "/settings") return t("nav.settings");

  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const key = SEGMENT_TITLE_KEYS[segment];
  if (key) return t(key);

  return t("common.appName");
}
