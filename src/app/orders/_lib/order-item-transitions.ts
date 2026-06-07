import {OrderItemStatus} from "@/app/_types/order";

const DISH_TRANSITIONS: Record<OrderItemStatus, OrderItemStatus[]> = {
  awaiting: ["cooking", "canceled"],
  cooking: ["ready", "canceled"],
  ready: ["with_the_client", "canceled"],
  with_the_client: [],
  canceled: [],
  empty_stock: [],
};

const NON_DISH_TRANSITIONS: Record<OrderItemStatus, OrderItemStatus[]> = {
  awaiting: ["with_the_client", "canceled", "empty_stock"],
  with_the_client: [],
  canceled: [],
  empty_stock: [],
  cooking: [],
  ready: [],
};

/** Current status plus API-allowed targets for the status select. */
export function selectableOrderItemStatuses(
  current: OrderItemStatus,
  isDish: boolean
): OrderItemStatus[] {
  const transitions = isDish ? DISH_TRANSITIONS : NON_DISH_TRANSITIONS;
  const next = transitions[current] ?? [];
  return [current, ...next];
}

export function isDishOrderItem(itemType?: string | null): boolean {
  return itemType === "Dish";
}
