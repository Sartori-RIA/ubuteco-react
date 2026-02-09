import {OrderItem} from "@/app/types/order";
import {BaseModel} from "@/app/types/base";
import {Table} from "@/app/types/table";
import {Dish} from "@/app/types/dish";

export interface KitchenDish extends BaseModel {
  table?: Table;
  order_item: OrderItem;
  dish: Dish;
}

export class ActionCableDish {
  obj?: KitchenDish;
  action?: 'create' | 'update';
}