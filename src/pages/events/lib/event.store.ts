import { create } from "zustand";
import { Links, Meta } from "@/lib/global.interface";
import { EventCollection, EventItem } from "./event.interface";
import { getEvents } from "./event.actions";

interface EventStore {
  events: EventItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  filter: string
  setFilter: (filter: string) => void
  loadEvents: (page: number) => void;
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
  loading: false,
  filter: "",
  setFilter: (filter: string) => set({ filter }),
  loadEvents: async (page: number) => {
    set(() => ({ loading: true }));
    const filter = get().filter
    const response: EventCollection = await getEvents({ page, name: filter });
    set(() => ({
      events: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }));
  },
}));


