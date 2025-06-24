import { Person, User } from "@/pages/auth/service/auth.interface";
import { StationItem } from "@/pages/station/lib/station.interface";

export interface ReservationCollection {
  data: ReservationItem[];
  totalReservas: number;
  reservasMesa: number;
  reservasBox: number;
  mesasLibres: number;
}

export interface ReservationItem {
  id: number;
  correlative: string;
  name: string;
  reservation_datetime: string;
  nroPeople: string;
  status: string;
  total: number;
  user_id: number;
  user: User;
  person_id: number;
  person: Person;
  event_id: number;
  event: Event;
  station_id: number;
  station: StationItem;
  code: Code | null;
  detailReservations: DetailReservation[];
  created_at: Date;
  expires_at: Date;
}
export interface Code {
  id: number;
  description: string;
  barcode_path: null | string;
  qrcode_path: null | string;
  reservation_id: number;
  lottery_ticket_id: null;
  entry_id: null;
  created_at: Date;
}

export interface DetailReservation {
  id: number;
  name: string;
  cant: number;
  type: string;
  precio: string;
  status: string;
  reservation_id: number;
  promotion_id: null;
  promotion: null;
  precio_total: string;
}
