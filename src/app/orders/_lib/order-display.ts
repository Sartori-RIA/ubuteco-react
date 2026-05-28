import {Order, OrderItem} from "@/app/_types";
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

export function orderItemProductName(item: OrderItem): string {
  return item.item?.name ?? `${item.item_type ?? "Item"} #${item.item_id ?? "?"}`;
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

export function formatOrderStatus(status?: string): string {
  switch (status) {
    case "open":
      return "Open";
    case "closed":
      return "Closed";
    case "payed":
      return "Paid";
    default:
      return status ?? "—";
  }
}

export function formatOrderItemStatus(status?: string): string {
  switch (status) {
    case "awaiting":
      return "Awaiting";
    case "cooking":
      return "Cooking";
    case "ready":
      return "Ready";
    case "with_the_client":
      return "With client";
    case "canceled":
      return "Canceled";
    case "empty_stock":
      return "Out of stock";
    default:
      return status ?? "—";
  }
}

export function orderHasDiscount(order: Order): boolean {
  if (order.discount_cents != null) return order.discount_cents > 0;
  const parsed = parseMoneyValue(order.discount);
  return parsed != null && parsed.amount > 0;
}
