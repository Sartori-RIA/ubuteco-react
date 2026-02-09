import {BaseModel} from "@/app/types/base";

export interface Maker extends BaseModel {
  name: string;
  country?: string;
  state?: string;
}