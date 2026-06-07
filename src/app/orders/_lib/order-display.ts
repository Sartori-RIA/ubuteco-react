import {Order, OrderItem} from "@/app/_types";
import {translate, TranslationKey} from "@/app/_lib/i18n";
import {DEFAULT_LOCALE} from "@/app/_lib/organization-settings";
import {displayMoneyField, displayPrice, formatAmount, parseMoneyValue} from "@/app/_lib/money";

export function displayOrderAmount(
  order: Order,
  field: "total" | "discount" | "total_with_discount"
): string {
  const centsKey = `${field}_cents` as keyof Order;
  const currencyKey = `${field}_currency` as keyof Order;

  return displayMoneyField(
    order[centsKey] as number | undefined,
    order[currencyKey] as string | undefined,
    order[field]
  );
}

export function orderItemProductName(item: OrderItem, locale: string = DEFAULT_LOCALE): string {
  if (item.item?.name) return item.item.name;

  const typeLabel = item.item_type
    ? formatOrderItemType(item.item_type, locale)
    : translate(locale, "orders.unknownProduct");

  return `${typeLabel} #${item.item_id ?? "?"}`;
}

export function formatOrderItemType(itemType: string, locale: string = DEFAULT_LOCALE): string {
  const key = `orders.itemType.${itemType}` as TranslationKey;
  const label = translate(locale, key);
  return label === key ? itemType : label;
}

export function orderItemUnitPrice(item: OrderItem): string {
  if (!item.item) return "—";
  return displayPrice(item.item);
}

export function orderItemLineTotal(item: OrderItem): string {
  if (!item.item || item.quantity == null) return "—";

  const parsed =
    item.item.price_cents != null
      ? {amount: item.item.price_cents / 100}
      : parseMoneyValue(item.item.price, item.item.price_currency);

  if (!parsed) return "—";

  return formatAmount(parsed.amount * item.quantity);
}

export function formatOrderStatus(status?: string, locale: string = DEFAULT_LOCALE): string {
  if (!status) return "—";
  const key = `orders.status.${status}` as TranslationKey;
  const label = translate(locale, key);
  return label === key ? status : label;
}

export function formatOrderItemStatus(status?: string, locale: string = DEFAULT_LOCALE): string {
  if (!status) return "—";
  const key = `orders.itemStatus.${status}` as TranslationKey;
  const label = translate(locale, key);
  return label === key ? status : label;
}

export function orderHasDiscount(order: Order): boolean {
  if (order.discount_cents != null) return order.discount_cents > 0;
  const parsed = parseMoneyValue(order.discount);
  return parsed != null && parsed.amount > 0;
}
