import {BaseModel, PictureFromS3} from "@/app/_types/base";

export type OrganizationOperationalStatus = "open" | "closed";

export interface Organization extends BaseModel {
  name?: string;
  cnpj?: string;
  phone?: string;
  logo?: PictureFromS3;
  logo_url?: string;
  user_id?: number;
  operational_status?: OrganizationOperationalStatus;
  locale?: string;
  default_currency?: string;
  timezone?: string;
}