import { Links, Meta } from "@/lib/global.interface";

export interface TicketCollection {
    data:  TicketItem[];
    links: Links;
    meta:  Meta;
}

export interface TicketItem {
    id:                            number;
    code_correlative:              string;
    reason:                        Reason;
    status:                        Status;
    user_owner_id:                 number | null;
    user_owner_name:               string;
    lottery_id:                    number;
    lottery_name:                  string;
    lottery_date:                  Date;
    lottery_company_id:            number;
    lottery_company_business_name: string;
    prizes:                        Prize[];
    code:                          Code | null;
    created_at:                    Date;
    updated_at:                    Date;
}

export interface Code {
    id:                number;
    description:       CodeDescription;
    barcode_path:      string;
    qrcode_path:       null | string;
    reservation_id:    null;
    lottery_ticket_id: number;
    entry_id:          null;
    created_at:        Date;
    total_scans:       number;
    first_ok_scan:     FirstOkScan | null;
    last_scan_attempt: FirstOkScan | null;
}

export enum CodeDescription {
    TicketSorteo = "Ticket Sorteo",
}

export interface FirstOkScan {
    created_at: Date;
}



export interface Prize {
    id:             number;
    name:           string;
    description:    string;
    route:          string;
    lottery_ticket: LotteryTicket | null;
    created_at:     Date;
}



export interface LotteryTicket {
    id:               number;
    code_correlative: string;
    reason:           Reason;
    code:             Code;
    winner_id:        number;
    winner_name:      string;
}

export enum Reason {
    Admin = "admin",
    CompraTicket = "compra ticket",
    RegaloPorConsumo = "regalo_por_consumo",
}



export enum Status {
    Pendiente = "Pendiente",
}

// export interface Links {
//     first: string;
//     last:  string;
//     prev:  null;
//     next:  string;
// }
// export interface Meta {
//     current_page: number;
//     from:         number;
//     last_page:    number;
//     links:        Link[];
//     path:         string;
//     per_page:     number;
//     to:           number;
//     total:        number;
// }

// export interface Link {
//     url:    null | string;
//     label:  string;
//     active: boolean;
// }
