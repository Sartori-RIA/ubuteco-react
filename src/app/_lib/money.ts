import {OrganizationSettings} from "@/app/_lib/organization-settings";
import {formatAmount as formatAmountWithLocale, formatMoney} from "@/app/_lib/format";

/** @deprecated Use formatMoney/formatAmount from `@/app/_lib/format` with org settings. */
export type MoneyJson = {
  cents?: number;
  currency_iso?: string;
};

type Priced = {
  price?: number | MoneyJson;
  price_cents?: number;
  price_currency?: string;
};

export function parseMoneyValue(
  value: unknown,
  currencyFallback = "BRL"
): {amount: number; currency: string} | null {
  if (value == null) return null;

  if (typeof value === "number" && !Number.isNaN(value)) {
    return {amount: value, currency: currencyFallback};
  }

  if (typeof value === "object") {
    const money = value as MoneyJson;
    if (typeof money.cents === "number") {
      return {
        amount: money.cents / 100,
        currency: money.currency_iso ?? currencyFallback,
      };
    }
  }

  return null;
}

export function displayPrice(item: Priced, settings?: Partial<OrganizationSettings>): string {
  if (item.price_cents != null) {
    return formatMoney(item.price_cents, {
      currency: item.price_currency,
      ...settings,
    });
  }

  const parsed = parseMoneyValue(item.price, item.price_currency ?? settings?.defaultCurrency);
  if (!parsed) return "—";

  return formatAmountWithLocale(parsed.amount, {
    currency: parsed.currency,
    ...settings,
  });
}

export function priceFromCents(item: Priced): number {
  if (item.price_cents != null) return item.price_cents / 100;
  const parsed = parseMoneyValue(item.price, item.price_currency);
  if (parsed) return parsed.amount;
  return 0;
}

export function displayMoneyField(
  cents: number | undefined,
  currency: string | undefined,
  legacyValue: unknown,
  settings?: Partial<OrganizationSettings>
): string {
  if (cents != null) {
    return formatMoney(cents, {currency, ...settings});
  }

  const parsed = parseMoneyValue(legacyValue, currency ?? settings?.defaultCurrency);
  if (parsed) {
    return formatAmountWithLocale(parsed.amount, {
      currency: parsed.currency,
      ...settings,
    });
  }

  return "—";
}

export {formatAmount, formatMoney} from "@/app/_lib/format";
