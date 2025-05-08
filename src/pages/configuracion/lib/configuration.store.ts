import { create } from "zustand";
import type { Links, Meta } from "@/lib/global.interface";
import { Settings, SettingsCollection } from "./configuration.interface";
import { getSetting } from "./configuration.actions";


interface SettingStore {
  setting: Settings[];
  links: Links;
  meta: Meta;
  loading: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  loadSettings: (page: number) => void;
}

export const useSettingStore = create<SettingStore>((set, get) => ({
  setting: [],
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
  loading: true,
  filter: "",
  setFilter: (filter: string) => set({ filter }),
  loadSettings: async (page: number) => {
    set(() => ({ loading: true }));
    try {
      const filter = get().filter;
      const response: SettingsCollection = await getSetting({
        page,
        name: filter,
      });

      set(() => ({
        setting: response.data,
        links: response.links,
        meta: response.meta,
        loading: false,
      }));
    } catch (error) {
      console.error("Error al cargar los parametros:", error);
      set(() => ({ loading: false }));
    }
  },
}));
