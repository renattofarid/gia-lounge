import { Links, Meta } from "@/lib/global.interface";
import { ReservationItem } from "@/pages/reservations/lib/reservation.interface";

export interface StationCollection {
  data: StationItem[];
  links: Links;
  meta: Meta;
}

export interface StationItem {
  id: number;
  name: string;
  type: string;
  status: string;
  description: string;
  server_id: null;
  route: null;
  environment_id: number;
  environment: Environment;
  date_reservation: string;
  reservation:      ReservationItem;
  
}

interface Environment {
  id: number;
  name: string;
  description: string;
  route: null;
  status: string;
  server_id: null;
  company_id: number;
  company: Company;
}

interface Company {
  id: number;
  ruc: string;
  business_name: string;
  address: string;
  phone: string;
  email: string;
  route: string;
  status: string;
}

export interface StationRequest {
  name: string;
  description: string; // no debe ir
  type: string;
  status: string;
  environment_id: number;
  route?: File;
}
