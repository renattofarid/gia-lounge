import { Person, User } from "@/pages/auth/service/auth.interface";
import { StationItem } from "@/pages/station/lib/station.interface";

export interface ReservationCollection {
  data:          ReservationItem[];
  totalReservas: number;
  reservasMesa:  number;
  reservasBox:   number;
  mesasLibres:   number;
}

export interface ReservationItem {
  id:                   number;
  correlative:          string;
  name:                 string;
  reservation_datetime: string;
  nroPeople:            string;
  status:               string;
  user_id:              number;
  user:                 User;
  person_id:            number;
  person:               Person;
  event_id:             number;
  event:                Event;
  station_id:           number;
  station:              StationItem;
}


