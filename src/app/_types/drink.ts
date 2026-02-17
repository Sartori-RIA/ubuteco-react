import {Product} from "@/app/_types/product";
import {Maker} from "@/app/_types/maker";

export interface Drink extends Product {
  description?: string;
  maker?: Maker;
  maker_id?: number;
  flavor?: string;
}