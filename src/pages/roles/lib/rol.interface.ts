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

export interface PermissionResource {
  id: number;
  name: string;
  type: string;
  status: string;
}

export interface TypePermission {
  name: string;
  permissions: PermissionResource[];
}

export interface SetAccessRol {
  access: number[];
}
