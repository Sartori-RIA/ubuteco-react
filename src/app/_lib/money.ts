/** Money-Rails JSON shape when serializing monetized fields via `extract! :total`. */
export type MoneyJson = {
  cents?: number;
  currency_iso?: string;
};

/** All amounts are shown in USD in the UI (values are not converted). */
export const DISPLAY_CURRENCY = "USD";

type Priced = {
  price?: number | MoneyJson;
  price_cents?: number;
  price_currency?: string;
};

export function parseMoneyValue(
  value: unknown,
  currencyFallback = DISPLAY_CURRENCY
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
        currency: DISPLAY_CURRENCY,
      };
    }
  }

  return null;
}

export function formatAmount(amount: number): string {
  if (Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: DISPLAY_CURRENCY,
  }).format(amount);
}

export function displayPrice(item: Priced): string {
  const fromCents =
    item.price_cents != null
      ? {amount: item.price_cents / 100, currency: DISPLAY_CURRENCY}
      : null;
  const fromPrice = parseMoneyValue(item.price, item.price_currency);
  const parsed = fromCents ?? fromPrice;

  if (!parsed) return "—";
  return formatAmount(parsed.amount);
}

export function priceFromCents(item: Priced): number {
  if (item.price_cents != null) return item.price_cents / 100;
  const parsed = parseMoneyValue(item.price, item.price_currency);
  if (parsed) return parsed.amount;
  return 0;
}

export function displayMoneyField(
  cents: number | undefined,
  _currency: string | undefined,
  legacyValue: unknown
): string {
  if (cents != null) {
    return formatAmount(cents / 100);
  }
  const parsed = parseMoneyValue(legacyValue);
  if (parsed) return formatAmount(parsed.amount);
  return "—";
}
