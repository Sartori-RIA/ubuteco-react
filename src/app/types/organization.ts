import {BaseModel, Image} from "@/app/types/base";

export interface Organization extends BaseModel {
  name?: string;
  cnpj?: string;
  phone?: string;
  logo?: Image;
  theme_id?: number;
  user_id?: number;
}