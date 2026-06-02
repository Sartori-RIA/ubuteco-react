"use client";

import {useMemo} from "react";
import {createTranslator, TranslateFn} from "@/app/_lib/i18n";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";

export function useTranslations(): TranslateFn {
  const {locale} = useOrganizationSettings();

  return useMemo(() => createTranslator(locale), [locale]);
}
