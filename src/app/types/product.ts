import {BaseModel, PictureFromS3} from "@/app/types/base";

export interface Product extends BaseModel {
  name: string;
  price?: number;
  quantity_stock?: number;
  image?: PictureFromS3 | File
  price_cents?: number;
  price_currency?: string;
  valid_until?: string;
}