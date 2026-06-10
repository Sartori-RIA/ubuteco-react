"use client";

import {useMemo} from "react";
import {usePathname} from "next/navigation";
import {createTranslator, TranslateFn} from "@/app/_lib/i18n";
import {getPageTitle} from "@/app/_lib/page-titles";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";

export function useTranslations(): TranslateFn {
  const {locale} = useOrganizationSettings();

  return useMemo(() => createTranslator(locale), [locale]);
}

export function usePageTitle(): string {
  const pathname = usePathname();
  const t = useTranslations();

  return getPageTitle(pathname, t);
}
