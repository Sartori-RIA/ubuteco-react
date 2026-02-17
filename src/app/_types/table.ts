import {BaseModel} from "@/app/_types/base";

export interface Table extends BaseModel {
  name: string;
  chairs: number;
}