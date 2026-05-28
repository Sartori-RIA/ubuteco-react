import {Product} from "@/app/_types/product";

export interface Food extends Product {
  valid_until?: string;
}

export interface Dish extends Product {
  dish_ingredients?: DishIngredient[];
}

export interface DishIngredient {
  food?: Food;
  food_id: number;
  quantity: number;
  id?: number;
}

export type DishIngredientAttribute = {
  id?: number;
  food_id: number;
  quantity: number;
  _destroy?: boolean;
  food?: Food;
};
