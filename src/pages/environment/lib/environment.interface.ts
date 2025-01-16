import { CompanyItem } from "@/pages/company/lib/company.interface";

export interface EnvironmentCollection {
    data:  EnvironmentItem[];
    links: Links;
    meta:  Meta;
}

export interface EnvironmentItem {
    id:          number;
    name:        string;
    description: string;
    route:       null;
    status:      string;
    server_id:   null;
    company_id:  number;
    company:     CompanyItem;
}

export interface Links {
    first: string;
    last:  string;
    prev:  null;
    next:  null;
}

export interface Meta {
    current_page: number;
    from:         number;
    last_page:    number;
    links:        Link[];
    path:         string;
    per_page:     number;
    to:           number;
    total:        number;
}

export interface Link {
    url:    null | string;
    label:  string;
    active: boolean;
}
