import {Product} from "@/app/types/product";
import {Maker} from "@/app/types/maker";
import {BaseModel} from "@/app/types/base";


export interface BeerStyle extends BaseModel {
  name: string;
}

export interface Beer extends Product {
  beer_style?: BeerStyle;
  beer_style_id?: number;
  ibu: number;
  alcohol?: number;
  description?: string;
  maker?: Maker;
  maker_id?: number;
}