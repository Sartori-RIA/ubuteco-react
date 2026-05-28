type Priced = {
  price?: number;
  price_cents?: number;
  price_currency?: string;
};

export function displayPrice(item: Priced): string {
  if (item.price != null) {
    return formatAmount(item.price, item.price_currency);
  }
  if (item.price_cents != null) {
    return formatAmount(item.price_cents / 100, item.price_currency);
  }
  return "—";
}

function formatAmount(amount: number, currency = "BRL"): string {
  return new Intl.NumberFormat("en-US", {style: "currency", currency}).format(amount);
}

export function priceFromCents(item: Priced): number {
  if (item.price != null) return item.price;
  if (item.price_cents != null) return item.price_cents / 100;
  return 0;
}
