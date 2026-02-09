import {Product} from "@/app/types/product";
import {Maker} from "@/app/types/maker";

export interface Drink extends Product {
  description?: string;
  maker?: Maker;
  maker_id?: number;
  flavor?: string;
}