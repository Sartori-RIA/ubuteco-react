import {BaseModel, PictureFromS3} from "@/app/_types/base";

export interface Organization extends BaseModel {
  name?: string;
  cnpj?: string;
  phone?: string;
  logo?: PictureFromS3;
  theme_id?: number;
  user_id?: number;
}