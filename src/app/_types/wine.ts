import {Product} from "@/app/_types/product";
import {BaseModel} from "@/app/_types/base";
import {Maker} from "@/app/_types/maker";

export interface WineStyle extends BaseModel {
  name: string;
}

export interface Wine extends Product {
  description: string;
  wine_style: WineStyle;
  wine_style_id: number;
  maker: Maker;
  maker_id: number;
  abv: number;
  vintage_wine: string;
  visual: string;
  ripening: string;
  grapes: string;
}