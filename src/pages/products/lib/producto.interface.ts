import { Links, Meta } from "@/lib/global.interface";

export interface ProductCollection {
  data: Product[];
  links: Links;
  meta: Meta;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  precio: string;
  status: string;
  route: string;
}