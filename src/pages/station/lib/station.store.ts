import { create } from "zustand";
import {  Meta } from "@/lib/global.interface";
import { StationCollection, StationItem } from "./station.interface";
import { getStation } from "./station.actions";
// import { ReservationItem } from "@/pages/reservations/lib/reservation.interface";

interface Stationtore {
  stations: StationItem[];
  // reservations: ReservationItem
  meta: Meta;
  loading: boolean;
  loadStations: (page: number, environmentId?: number) => void;
  // loadReservations: (stationId: number) => void;
}

export const useStationStore = create<Stationtore>((set) => ({
  stations: [],
  // reservations: [],
  // loadReservations: async (stationId: number) => {
  //   set(() => ({ loading: true }));
  //   const response: ReservationItem = await getStation(stationId);
  //   set(() => ({
  //     reservations: response,
  //     loading: false,
  //   }));
  // }
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
  loadStations: async (page: number, environmentId?: number) => {
    set(() => ({ loading: true }));
    const response: StationCollection = await getStation({
      page,
      environmentId,
    });
    set(() => ({
      stations: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }));
  },
}));
