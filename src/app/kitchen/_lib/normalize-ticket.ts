import {KitchenTicket} from "@/app/_types/kitchen-dish";
import {OrderItemStatus} from "@/app/_types/order";

const STATUS_BY_INDEX: OrderItemStatus[] = [
  "awaiting",
  "cooking",
  "ready",
  "with_the_client",
  "canceled",
  "empty_stock",
];

export function normalizeKitchenStatus(status: unknown): OrderItemStatus {
  if (typeof status === "string") {
    return status as OrderItemStatus;
  }
  if (typeof status === "number" && STATUS_BY_INDEX[status]) {
    return STATUS_BY_INDEX[status];
  }
  return "awaiting";
}

export function normalizeKitchenTicket(ticket: KitchenTicket): KitchenTicket {
  return {
    ...ticket,
    id: ticket.id != null ? Number(ticket.id) : ticket.id,
    order_id: ticket.order_id != null ? Number(ticket.order_id) : ticket.order_id,
    quantity: ticket.quantity != null ? Number(ticket.quantity) : ticket.quantity,
    status: normalizeKitchenStatus(ticket.status),
    item_type: ticket.item_type ?? "Dish",
  };
}
