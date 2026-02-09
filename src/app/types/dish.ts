import {Product} from "@/app/types/product";

export interface Dish extends Product {
  dish_ingredients?: Ingredient[];
  dish_ingredients_attributes?: Ingredient[];
}

export interface Food extends Product {
  valid_until?: string;
}

export interface Ingredient {
  food?: Food;
  food_id: number;
  quantity: number;
  id?: number;
}