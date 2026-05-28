import {BaseModel} from "@/app/_types/base";

export interface Product extends BaseModel {
  name: string;
  price?: number;
  quantity_stock?: number;
  image_url: string;
  thumbnail_url?: string;
  image?: File
  price_cents?: number;
  price_currency?: string;
  valid_until?: string;
}