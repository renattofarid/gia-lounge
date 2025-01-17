import { Links, Meta } from "@/lib/global.interface";

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
  server_id: null;
  route: null;
  environment_id: number;
  environment: Environment;
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
  status: number;
  environment_id: number;
  route?: File;
}
