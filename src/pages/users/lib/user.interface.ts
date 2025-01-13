import { Links, Meta } from "@/lib/global.interface";

export interface UserCollection {
  data: UserItem[];
  links: Links;
  meta: Meta;
}

export interface UserItem {
  id: number;
  name: string;
  username: string;
  person_id: number;
  rol_id: number;
  person: Person;
  rol: Rol;
}

export interface Person {
  id: number;
  type_document: string;
  type_person: string;
  number_document: string;
  names: string;
  father_surname: string;
  mother_surname: string;
  business_name: string;
  address: string;
  phone: string;
  email: string;
  occupation: null;
  state: string;
}

export interface Rol {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  type: string;
}
