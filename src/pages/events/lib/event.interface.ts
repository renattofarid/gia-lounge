import { Links, Meta } from "@/lib/global.interface";
import { User } from "@/pages/auth/service/auth.interface";

export interface EventCollection {
  data: EventItem[];
  links: Links;
  meta: Meta;
}

export interface EventItem {
  id: number;
  name: string;
  event_datetime: string;
  comment:        string;
  status:         string;
  user_id:        number;
  user:           User;
}
