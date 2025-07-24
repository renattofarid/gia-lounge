import { Links, Meta } from "@/lib/global.interface";
import { User } from "@/pages/auth/service/auth.interface";
import { CompanyItem } from "@/pages/company/lib/company.interface";
import { LotteryItem } from "@/pages/lottery/lib/lottery.interface";

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
  pricebox?: string;
  pricetable?: string;
  price_entry?: string;
  is_daily_event: string;
  activeStations: ActiveStation[];
  lotteries: LotteryItem[] | null;
  flag_lottery: boolean;
}

export interface ActiveStation {
  nro_recepcion: number;
  status_recepcion: string;
  station: Station;
}

export interface Station {
  id: number;
  name: string;
  type: Type;
  description: string;
  status: string;
  server_id: null;
  route: null | string;
  environment_id: number;
  sort: number;
  price: string;
  price_unitario: null | string;
  quantity_people: string;
}

export enum Type {
  Box = "BOX",
  Mesa = "MESA",
}
