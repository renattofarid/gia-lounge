import { Links, Meta } from "@/lib/global.interface";

export interface PromotionCollection {
    data:  PromotionItem[];
    links: Links;
    meta:  Meta;
}

export interface PromotionItem {
    id:             number;
    name:           string;
    description:    string;
    title:          string;
    precio:         string;
    date_start:     Date;
    date_end:       Date;
    stock:          number;
    stock_restante: number;
    status:         string;
    route:          string;
    product_id:     number;
    created_at:     Date;
}

