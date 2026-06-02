import {ItemOrderSend, OrderItem, OrderItemType} from "@/app/_types/order";

export function isSameOrderLine(
  line: OrderItem,
  itemType: OrderItemType,
  itemId: number
): boolean {
  return line.item_type === itemType && Number(line.item_id) === itemId;
}

export function findMatchingOrderLine(
  orderItems: OrderItem[],
  payload: Pick<ItemOrderSend, "item_type" | "item_id">
): OrderItem | undefined {
  return orderItems.find((line) => isSameOrderLine(line, payload.item_type, payload.item_id));
}
