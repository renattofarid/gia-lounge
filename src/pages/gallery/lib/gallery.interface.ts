import { Links, Meta } from "@/lib/global.interface";

export interface GalleryCollection {
    data:  GalleryItem[];
    links: Links;
    meta:  Meta;
}

export interface GalleryItem {
    id:                number;
    name_image:        string;
    route:             string;
    company_id:        number;
    company_name:      string;
    user_created_id:   number;
    user_created_name: string;
}

