import { create } from "zustand";
import { Links, Meta } from "@/lib/global.interface";
import { CompanyCollection, CompanyItem } from "./company.interfaz";
import { getCompanys } from "./company.actions";

interface CompanyStore {
 companies:CompanyItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  loadCompanies: (page: number) => void;
}

export const useComapanyStore = create<CompanyStore>((set) => ({
  companies: [],
  links: {
    first: "",
    last: "",
    prev: null,
    next: null,
  },
  meta: {
    current_page: 0,
    from: 0,
    last_page: 0,
    links: [],
    path: "",
    per_page: 0,
    to: 0,
    total: 0,
  },
  loading: false,
  loadCompanies: async (page: number) => {
    set(() => ({ loading: true }));
    const response:CompanyCollection = await getCompanys({ page });
    set(() => ({
     companies: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }));
  },
}));

