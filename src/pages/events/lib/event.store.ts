import { create } from "zustand";
import type { Links, Meta } from "@/lib/global.interface";
import type { EventCollection, EventItem } from "./event.interface";
import { getEvents } from "./event.actions";

interface EventStore {
  events: EventItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  loadEvents: (
    page: number,
    companyId?: number,
    date?: string,
    perPage?: number
  ) => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
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
  loadEvents: async (
    page: number,
    companyId?: number,
    date?: string,
    perPage?: number
  ) => {
    set(() => ({ loading: true }));
    try {
      const filter = get().filter;
      const response: EventCollection = await getEvents({
        page,
        companyId,
        name: filter,
        event_datetime: date,
        perPage: perPage,
      });

      set(() => ({
        events: response.data,
        links: response.links,
        meta: response.meta,
        loading: false,
      }));
    } catch (error) {
      console.error("Error al cargar los eventos:", error);
      set(() => ({ loading: false }));
    }
  },
}));
