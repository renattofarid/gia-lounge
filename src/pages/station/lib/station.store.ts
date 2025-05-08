import { create } from "zustand"
import type { Links, Meta } from "@/lib/global.interface"
import type { StationCollection, StationItem } from "./station.interface"
import { getStation } from "./station.actions"

interface StationStore {
  stations: StationItem[]
  links: Links
  meta: Meta
  loading: boolean
  loadStations: (page: number, environmentId?: number, date?: string, eventId?: string) => void
}

export const useStationStore = create<StationStore>((set) => ({
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
  loading: true,
  loadStations: async (page: number, environmentId?: number, date?: string, eventId?: string) => {
    set(() => ({ loading: true }))
    const response: StationCollection = await getStation({
      page,
      environmentId,
      date_reservation: date,
      event_id: eventId,
    })
    set(() => ({
      stations: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }))
  },
}))
