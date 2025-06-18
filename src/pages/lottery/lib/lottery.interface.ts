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
  route: null;
  winner_id: null;
  winner_name: null;
  user_created_id: number;
  user_created_name: string;
  event_id: number;
  event_name: string;
  created_at: Date;
  updated_at: Date;
  prizes: Prize[];
}

export interface LotteryByEvent {
  id: number;
  price_factor_consumo: string;
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
  id: number;
  name: string;
  username: string;
  person_id: number;
  isFlagData: number;
  textFlagData: string;
  rol_id: number;
  person: Person;
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
