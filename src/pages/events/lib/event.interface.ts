import { Links, Meta } from "@/lib/global.interface";
import { User } from "@/pages/auth/service/auth.interface";
import { CompanyItem } from "@/pages/company/lib/company.interface";

export interface EventCollection {
  data: EventItem[];
  links: Links;
  meta: Meta;
}

export interface EventItem {
  id: number;
  name: string;
  event_datetime: string;
  comment?: string;
  status: string;
  user_id: number;
  user: User;
  company_id: number;
  company: CompanyItem;
  pricebox?:  string;
  pricetable?: string;
  entryprice?: string;
}
