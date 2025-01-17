import { Links, Meta } from "@/lib/global.interface";
import { CompanyItem } from "@/pages/company/lib/company.interface";

export interface EnvironmentCollection {
  data: EnvironmentItem[];
  links: Links;
  meta: Meta;
}

export interface EnvironmentItem {
  id: number;
  name: string;
  description: string;
  route: null;
  status: string;
  server_id: null;
  company_id: number;
  company: CompanyItem;
}

export interface EnvironmentRequest {
  name: string;
  description: string;
  status: number;
  company_id: number;
  route?: File;
}
