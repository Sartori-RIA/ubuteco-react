"use client";

import {useMemo} from "react";
import {useOrganizationSettings} from "@/app/_hooks/useOrganizationSettings";
import {FormatDateOptions, FormatMoneyOptions, formatAmount, formatDate, formatMoney} from "@/app/_lib/format";
import {displayMoneyField, displayPrice, priceFromCents} from "@/app/_lib/money";
import {OrganizationSettings} from "@/app/_lib/organization-settings";

type Priced = Parameters<typeof displayPrice>[0];

export function useMoneyFormat() {
  const settings = useOrganizationSettings();

  return useMemo(() => {
    const formatOptions: Partial<OrganizationSettings> = {
      locale: settings.locale,
      defaultCurrency: settings.defaultCurrency,
      timezone: settings.timezone,
    };

    return {
      ...settings,
      formatMoney: (cents: number | null | undefined, options: FormatMoneyOptions = {}) =>
        formatMoney(cents, {...formatOptions, ...options}),
      formatAmount: (amount: number, options: FormatMoneyOptions = {}) =>
        formatAmount(amount, {...formatOptions, ...options}),
      formatDate: (
        value: string | number | Date | null | undefined,
        options: FormatDateOptions = {}
      ) => formatDate(value, {...formatOptions, ...options}),
      displayPrice: (item: Priced) => displayPrice(item, formatOptions),
      displayMoneyField: (
        cents: number | undefined,
        currency: string | undefined,
        legacyValue: unknown
      ) => displayMoneyField(cents, currency, legacyValue, formatOptions),
      priceFromCents,
    };
  }, [settings]);
}
