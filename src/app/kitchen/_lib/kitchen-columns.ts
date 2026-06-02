import {OrderItemStatus} from "@/app/_types/order";

export type KitchenColumn = {
  id: "awaiting" | "cooking" | "ready" | "done";
  statuses: OrderItemStatus[];
};

export const KITCHEN_COLUMNS: KitchenColumn[] = [
  {id: "awaiting", statuses: ["awaiting"]},
  {id: "cooking", statuses: ["cooking"]},
  {id: "ready", statuses: ["ready"]},
  {id: "done", statuses: ["with_the_client", "canceled", "empty_stock"]},
];

export const KITCHEN_STATUS_OPTIONS: OrderItemStatus[] = [
  "awaiting",
  "cooking",
  "ready",
  "with_the_client",
  "canceled",
  "empty_stock",
];
