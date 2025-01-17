import { create } from "zustand";
import { Links, Meta } from "@/lib/global.interface";
import {
  EnvironmentCollection,
  EnvironmentItem,
} from "./environment.interface";
import { getEnvironment } from "./environment.actions";

interface Environmenttore {
  environments: EnvironmentItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  loadEnvironments: (page: number, companyId?: number) => void;
}

export const useEnvironmentStore = create<Environmenttore>((set) => ({
  environments: [],
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
  loadEnvironments: async (page: number, companyId?: number) => {
    set(() => ({ loading: true }));
    const response: EnvironmentCollection = await getEnvironment({
      page,
      companyId,
    });
    set(() => ({
      environments: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }));
  },
}));
