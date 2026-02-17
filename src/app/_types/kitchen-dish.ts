import {OrderItem} from "@/app/_types/order";
import {BaseModel} from "@/app/_types/base";
import {Table} from "@/app/_types/table";
import {Dish} from "@/app/_types/dish";

export interface KitchenDish extends BaseModel {
  table?: Table;
  order_item: OrderItem;
  dish: Dish;
}

export class ActionCableDish {
  obj?: KitchenDish;
  action?: 'create' | 'update';
}