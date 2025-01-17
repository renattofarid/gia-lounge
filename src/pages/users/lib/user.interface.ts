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
  rol: Rol | string;
}

export type TypeDocument = "DNI" | "RUC";
export type PersonType = "NATURAL" | "JURIDICA";

export interface Person {
  id: number;
  type_document: TypeDocument;
  type_person: PersonType;
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

export interface PersonDNI {
  code: number;
  dni: string;
  apepat: string;
  apemat: string;
  apcas: string;
  nombres: string;
  fecnac: Date;
  ubigeo: string;
}

export interface PersonRUC {
  code: number;
  RUC: string;
  RazonSocial: string;
  Direccion: string;
  Tipo: null;
  Inscripcion: null;
  phone: string;
}
