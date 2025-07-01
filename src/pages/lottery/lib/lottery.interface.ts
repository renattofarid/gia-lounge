import { Links, Meta } from "@/lib/global.interface";

// export interface LotteryItem {
//     id: number;
//     name: string;
//     description: string;
//     date: string;
//     status: boolean;
//     // file: string;
//     // fileAwards: string;
//     }

export interface LotteryCollection {
  data: LotteryItem[];
  links: Links;
  meta: Meta;
}

export interface LotteryItem {
  id: number;
  code_serie: string;
  lottery_name: string;
  lottery_description: string;
  lottery_date: Date;
  lottery_price: string;
  lottery_by_event: LotteryByEvent;
  status: string;
  price_factor_consumo?: string;
  route: null | string;
  company_id: number;
  company_business_name: string;
  user_created_id: number;
  user_created_name: string;
  event_id: number;
  event_name: string;
  main_image_url?: string; // <--- aquí

  created_at: Date;
  updated_at: Date;
  prizes: Prize[];
  prizes_winners: PrizesWinner[];
}

export interface PrizesWinner {
  prize_name: string;
  code_correlative: null | string;
  winner_name: null | string;
}

export interface LotteryByEvent {
  id: number;
  price_factor_consumo?: string;
  lottery_id: number;
  event_id: number;
}

export interface Prize {
  id: number;
  name: string;
  description: null;
  route: string;
  created_at: Date;
}

export interface ParticipantesCollection {
  data: ParticipantesItem[];
}

export interface ParticipantesItem {
  // person_id: number;
  // isFlagData: number;
  // textFlagData: string;

  id: number;
  username: string;
  person: Person;
  ticket_count: number;
  tickets: Ticket[];
}

export interface Person {
  id: number;
  type_document: string;
  type_person: string;
  number_document: string;
  names: string;
  father_surname: string;
  mother_surname: string;
  business_name: null;
  date_birth: null;
  address: string;
  phone: string;
  email: string;
  occupation: null;
  status: string;
}

export interface Ticket {
  id_ticket: number;
  ticket_code_correlative: string;
  code: Code;
}

export interface Code {
  id: number;
  description: string;
  barcode_path: string;
  qrcode_path: null;
  reservation_id: null;
  lottery_ticket_id: number;
  entry_id: null;
  created_at: Date;
  total_scans: number;
  first_ok_scan: null;
  last_scan_attempt: null;
}
