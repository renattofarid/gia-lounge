import { create } from "zustand"
import type { Links, Meta } from "@/lib/global.interface"
import type { RolCollection, RolItem } from "./rol.interface"
import { getRoles } from "./rol.actions"

interface RolStore {
  roles: RolItem[]
  links: Links
  meta: Meta
  loading: boolean
  filter: string
  setFilter: (filter: string) => void
  loadRoles: (page: number) => void
}

export const useRolStore = create<RolStore>((set, get) => ({
  roles: [],
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
  loadRoles: async (page: number) => {
    set(() => ({ loading: true }))
    const filter = get().filter
    const response: RolCollection = await getRoles({ page, name: filter })
    set(() => ({
      roles: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }))
  },
}))

