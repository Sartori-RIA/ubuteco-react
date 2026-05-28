import {BaseModel} from "@/app/_types/base";

export interface Maker extends BaseModel {
  name: string;
  country?: string;
  logo_url: string;
  logo_thumbnail_url?: string;
}