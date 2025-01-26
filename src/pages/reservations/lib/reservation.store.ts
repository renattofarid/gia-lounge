import { create } from "zustand";
import { Links, Meta } from "@/lib/global.interface";
import { ReservationCollection, ReservationItem } from "./reservation.interface";
import { getReservations } from "./reservation.actions";


interface ReservationStore {
  reservations: ReservationItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  filter: string
  setFilter: (filter: string) => void
  loadReservations: (page: number, event_id?:number) => void;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  reservations: [],
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
  loadReservations: async (page: number, eventId?:number) => {
    set(() => ({ loading: true }));
    const filter = get().filter
    const response: ReservationCollection = await getReservations({ page, name: filter, eventId });
    set(() => ({
      reservations: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }));
  },
}));


