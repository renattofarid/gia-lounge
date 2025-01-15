export interface CompanyCollection {
    data:  CompanyItem[];
    links: Links;
    meta:  Meta;
}

export interface CompanyItem {
    id:            number;
    ruc:           string;
    business_name: string;
    address:       string;
    phone:         string;
    email:         string;
    route:         string;
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
