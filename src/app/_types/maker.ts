import {BaseModel} from "@/app/_types/base";

export interface Maker extends BaseModel {
  name: string;
  country?: string;
  state?: string;
}