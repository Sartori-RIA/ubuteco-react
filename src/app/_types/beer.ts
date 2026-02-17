import {Product} from "@/app/_types/product";
import {Maker} from "@/app/_types/maker";
import {BaseModel} from "@/app/_types/base";


export interface BeerStyle extends BaseModel {
  name: string;
}

export interface Beer extends Product {
  beer_style?: BeerStyle;
  beer_style_id?: number;
  ibu: number;
  abv: number;
  description?: string;
  maker?: Maker;
  maker_id?: number;
}