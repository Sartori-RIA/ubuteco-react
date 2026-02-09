import {BaseModel, PictureFromS3} from "@/app/types/base";
import {Organization} from "@/app/types/organization";


export interface Role extends BaseModel {
  name: 'SUPER_ADMIN' |'ADMIN' | 'KITCHEN' | 'WAITER' | 'CASH_REGISTER' | 'CUSTOMER';
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
  organization_id?: number;
  organization?: Organization;
  picture?: PictureFromS3;
  role?: Role;
  role_id?: number;
}

export interface SignUpPayload {
  user: {
    email: string,
    password: string,
    name: string
  };
  organization_attributes: {
    name: string,
    phone: string,
    cnpj: string
  };
}

