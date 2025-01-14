import { create } from "zustand";
import { Links, Meta } from "@/lib/global.interface";
import { RolCollection, RolItem } from "./rol.interface";
import { getRoles } from "./rol.actions";

interface RolStore {
  roles: RolItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  loadRoles: (page: number) => void;
}

export const useRolStore = create<RolStore>((set) => ({
  roles: [],
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
  loadRoles: async (page: number) => {
    set(() => ({ loading: true }));
    const response: RolCollection = await getRoles({ page });
    set(() => ({
      roles: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }));
  },
}));
