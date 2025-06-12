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
    data:  LotteryItem[];
    links: Links;
    meta:  Meta;
}

export interface LotteryItem {
    id:                  number;
    code_serie:          string;
    lottery_name:        string;
    lottery_description: string;
    lottery_date:        Date;
    lottery_price:       string;
    lottery_by_event:    LotteryByEvent;
    status:              string;
    winner_id:           null;
    winner_name:         null;
    user_created_id:     number;
    user_created_name:   string;
    event_id:            number;
    event_name:          string;
    created_at:          Date;
    updated_at:          Date;
}

export interface LotteryByEvent {
    id:                   number;
    price_factor_consumo: string;
    lottery_id:           number;
    event_id:             number;
}

