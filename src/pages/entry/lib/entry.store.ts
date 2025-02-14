import { create } from "zustand";
import type { Links, Meta } from "@/lib/global.interface";
import { EntryCollection, EntryItem } from "./entry.interface";
import { getEntries } from "./entry.actions";

interface EntryStore {
  entries: EntryItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  filter: string;
  status_pay: string;
  setFilter: (filter: string) => void;
  setStatusPay: (status_pay: string) => void;
  loadEntries: (page: number, eventId: number) => void;
}

export const useEntryStore = create<EntryStore>((set, get) => ({
  entries: [],
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
  status_pay: "",
  setFilter: (filter: string) => set({ filter }),
  setStatusPay: (status_pay: string) => set({ status_pay }),
  loadEntries: async (page: number, eventId: number) => {
    set(() => ({ loading: true }));
    try {
      const filter = get().filter;
      const status_pay = get().status_pay;
      const response: EntryCollection = await getEntries({
        page,
        eventId,
        name: filter,
        status_pay,
      });

      set(() => ({
        entries: response.data,
        links: response.links,
        meta: response.meta,
        loading: false,
      }));
    } catch (error) {
      console.error("Error al cargar las entradas:", error);
      set(() => ({ loading: false }));
    }
  },
}));
