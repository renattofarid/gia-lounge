import { Links, Meta } from "@/lib/global.interface";

export interface StationCollection {
  data: StationItem[];
  links: Links;
  meta: Meta;
}

export interface StationItem {
  id:               number;
  name:             string;
  description:      string;
  price:            string;
  sort:             number | null;
  type:             string;
  status:           string;
  route:            null | string;
  server_id:        null;
  date_reservation: string;
  reservation:      Reservation | null;
  environment_id:   number;
  environment:      Environment;
}

export interface Environment {
  id:          number;
  name:        string;
  description: string;
  route:       string;
  status:      string;
  server_id:   null;
  company_id:  number;
  company:     Company;
}
export interface Company {
  id:            number;
  ruc:           string;
  business_name: string;
  address:       string;
  phone:         string;
  email:         string;
  route:         string;
  status:        string;
}


export interface StationRequest {
  name: string;
  description: string; // no debe ir
  type: string;
  status: string;
  environment_id: number;
  route?: File;
  price: string;
  sort: number;
}



export interface Reservation {
  person:     Person;
  nro_people: string;
}

export interface Person {
  id:              number;
  type_document:   string;
  type_person:     string;
  number_document: string;
  names:           string;
  father_surname:  string;
  mother_surname:  string;
  business_name:   string;
  address:         string;
  phone:           string;
  email:           string;
  ocupation:       string;
  status:          string;
  server_id:       null;
}


