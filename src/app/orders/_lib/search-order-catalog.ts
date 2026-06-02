import {apiFetchPaginated} from "@/app/_services/api-fetch";
import {Beer} from "@/app/_types/beer";
import {Dish} from "@/app/_types/dish";
import {Drink} from "@/app/_types/drink";
import {OrderItemType} from "@/app/_types/order";
import {Wine} from "@/app/_types/wine";

export type OrderCatalogProduct = Beer | Drink | Dish | Wine;

const CATALOG_ENTITY: Record<OrderItemType, string> = {
  Beer: "beers",
  Drink: "drinks",
  Dish: "dishes",
  Wine: "wines",
};

export async function searchOrderCatalog(
  itemType: OrderItemType,
  query = ""
): Promise<OrderCatalogProduct[]> {
  const entity = CATALOG_ENTITY[itemType];
  const trimmed = query.trim();
  const suffix = trimmed ? `?q=${encodeURIComponent(trimmed)}` : "";
  const response = await apiFetchPaginated<OrderCatalogProduct>(`v1/${entity}${suffix}`);
  return response.data;
}
