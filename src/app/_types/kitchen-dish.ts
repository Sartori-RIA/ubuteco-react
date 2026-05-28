import {Dish} from "@/app/_types/dish";
import {OrderItemStatus} from "@/app/_types/order";
import {Table} from "@/app/_types/table";
import {BaseModel} from "@/app/_types/base";

/** Order line for the kitchen queue (API: `GET /api/v1/kitchens`). */
export interface KitchenTicket extends BaseModel {
  order_id?: number;
  quantity?: number;
  item_type?: string;
  status: OrderItemStatus;
  table?: Table;
  /** Dish product nested under this key in API JSON. */
  order_item?: Pick<Dish, "id" | "name">;
}

export type ActionCableKitchenMessage = {
  obj?: KitchenTicket;
  action?: "create" | "update";
};
