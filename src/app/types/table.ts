import {BaseModel} from "@/app/types/base";

export interface Table extends BaseModel {
  name: string;
  chairs: number;
}