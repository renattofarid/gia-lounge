import { Links, Meta } from "@/lib/global.interface";

export interface SettingsCollection {
    data:  Settings[];
    links: Links;
    meta:  Meta;
}

export interface Settings {
    id:          number;
    name:        string;
    description: string;
    amount:      string;
    created_at:  Date;
}
export interface SettingRequest {
    name:        string;
    description: string;
    amount:      string;
}