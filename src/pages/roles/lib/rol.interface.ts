import { Links, Meta } from "@/lib/global.interface";

export interface RolCollection {
  data: RolItem[];
  links: Links;
  meta: Meta;
}

export interface RolItem {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  name: string;
  type: string;
}
