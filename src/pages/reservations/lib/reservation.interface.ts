import { Links, Meta } from "@/lib/global.interface";

export interface ReservationCollection {
  data: ReservationItem[];
  links: Links;
  meta: Meta;
}

export interface ReservationItem {
  id: number;
  name: string;
}
