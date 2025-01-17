import { create } from "zustand";
import { Links, Meta } from "@/lib/global.interface";
import { StationCollection, StationItem } from "./station.interface";
import { getStation } from "./station.actions";

interface Stationtore {
  stations: StationItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  loadStations: (page: number, environmentId?: number) => void;
}

export const useStationStore = create<Stationtore>((set) => ({
  stations: [],
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
