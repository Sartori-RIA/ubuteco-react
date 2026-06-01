import {BaseModel, PictureFromS3} from "@/app/_types/base";

export type OrganizationOperationalStatus = "open" | "closed";

export interface Organization extends BaseModel {
  name?: string;
  cnpj?: string;
  phone?: string;
  logo?: PictureFromS3;
  user_id?: number;
  operational_status?: OrganizationOperationalStatus;
}