import {BaseModel, PictureFromS3} from "@/app/_types/base";
import {Organization} from "@/app/_types/organization";


export interface Role extends BaseModel {
  name: 'SUPER_ADMIN' | 'ADMIN' | 'KITCHEN' | 'WAITER' | 'CASH_REGISTER' | 'CUSTOMER';
}

export interface Customer extends BaseModel {
  name: string;
  customer_since: Date;
  cpf: string;
}

export interface User extends BaseModel {
  email?: string;
  password?: string;
  name?: string;
  avatar_url?: string;
  organization_id?: number;
  organization?: Organization;
  picture?: PictureFromS3;
  role?: Role;
  role_id?: number;
}

export type ProfileUpdatePayload = {
  name?: string;
  email?: string;
  password?: string;
};

export interface SignUpPayload {
  user: {
    email: string;
    password: string;
    name: string;
  };
  organization_attributes?: {
    name: string;
    phone: string;
    cnpj?: string;
  };
}

