import { create } from "zustand";
import { Links } from "@/lib/global.interface";
import {
  ReservationCollection,
  ReservationItem,
} from "./reservation.interface";
import { getReservations } from "./reservation.actions";

interface ReservationStore {
  reservations: ReservationItem[];
  links: Links;
  stats: {
    totalReservas: number;
    reservasMesa: number;
    reservasBox: number;
    mesasLibres: number;
  };
  loading: boolean;
  filter: string;
  setFilter: (filter: string) => void;
  loadReservations: (page: number, event_id?: number) => void;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
  reservations: [],
  links: {
    first: "",
    last: "",
    prev: null,
    next: null,
  },
  stats: {
    totalReservas: 0,
    reservasMesa: 0,
    reservasBox: 0,
    mesasLibres: 0,
  },
  loading: false,
  filter: "",
  setFilter: (filter: string) => set({ filter }),
  loadReservations: async (page: number, eventId?: number) => {
    set(() => ({ loading: true }));
    const filter = get().filter;
    const response: ReservationCollection = await getReservations({
      page,
      name: filter,
      eventId,
    });
    set(() => ({
      reservations: response.data,
      stats: {
        totalReservas: response.totalReservas,
        reservasMesa: response.reservasMesa,
        reservasBox: response.reservasBox,
        mesasLibres: response.mesasLibres,
      },
      loading: false,
    }));
  },
}));
