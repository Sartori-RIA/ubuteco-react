import {OrderItemStatus} from "@/app/_types/order";

export type KitchenColumn = {
  id: string;
  title: string;
  statuses: OrderItemStatus[];
};

export const KITCHEN_COLUMNS: KitchenColumn[] = [
  {id: "awaiting", title: "Awaiting", statuses: ["awaiting"]},
  {id: "cooking", title: "Cooking", statuses: ["cooking"]},
  {id: "ready", title: "Ready", statuses: ["ready"]},
  {id: "done", title: "Done / other", statuses: ["with_the_client", "canceled", "empty_stock"]},
];

export const KITCHEN_STATUS_OPTIONS: OrderItemStatus[] = [
  "awaiting",
  "cooking",
  "ready",
  "with_the_client",
  "canceled",
  "empty_stock",
];
