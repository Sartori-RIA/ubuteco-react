import {Table} from "@/app/_types/table";
import {BaseModel} from "@/app/_types/base";
import {Organization} from "@/app/_types/organization";
import {Customer} from "@/app/_types/user";
import {Dish} from "@/app/_types/dish";
import {Beer} from "@/app/_types/beer";
import {Drink} from "@/app/_types/drink";
import {Wine} from "@/app/_types/wine";

export interface Order extends BaseModel {
  user?: Customer;
  organization?: Organization;
  organization_id?: number;
  table?: Table;
  table_id?: number;
  order_items?: OrderItem[];
  total?: number;
  total_cents?: number;
  total_currency?: string;
  discount?: number;
  discount_cents?: number;
  discount_currency?: string;
  total_with_discount?: number;
  total_with_discount_cents?: number;
  total_with_discount_currency?: string;
}

export interface OrderItem extends BaseModel {
  quantity?: number;
  item_type?: OrderItemType;
  item_id?: number;
  order_id?: number;
  item?: Beer | Drink | Dish | Wine;
  table?: Table;
  status: OrderItemStatus;
}

export interface ItemOrderSend {
  item_id: number;
  quantity: number;
  item_type: OrderItemType;
}

export type OrderItemType = 'Beer' | 'Drink' | 'Dish' | 'Wine';

export type OrderItemStatus
  = 'cooking'
  | 'awaiting'
  | 'ready'
  | 'with_the_client'
  | 'canceled'
  | 'empty_stock';