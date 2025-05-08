import { create } from "zustand"
import type { Links, Meta } from "@/lib/global.interface"
import type { PromotionCollection, PromotionItem } from "./promotions.interface"
import { getPromotions, getPromotionWeek } from "./promotion.actions"

interface PromotionStore {
  promotions: PromotionItem[]
  promotionsWeek: PromotionItem[]
  links: Links
  loading: boolean
  filter: string
  dateStart: string | undefined
  statusFilter: string | undefined
  meta: Meta
  setDateStart: (dateStart: string | undefined) => void
  setFilter: (filter: string, status?: string | undefined) => void
  setStatusFilter: (status: string | undefined) => void
  loadPromotions: (page: number) => void
  loadPromotionsWeek: () => void
}

export const usePromotionStore = create<PromotionStore>((set, get) => ({
  promotions: [],
  promotionsWeek: [],
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
  dateStart: undefined,
  statusFilter: undefined,
  setFilter: (filter: string, status?: string | undefined) => set({ filter, statusFilter: status }),
  setStatusFilter: (status: string | undefined) => set({ statusFilter: status }),
  setDateStart: (dateStart: string | undefined) => set({ dateStart }),
  loadPromotions: async (page: number) => {
    set(() => ({ loading: true }))
    const filter = get().filter
    const dateStart = get().dateStart
    const statusFilter = get().statusFilter

    try {
      const response: PromotionCollection = await getPromotions({
        page,
        name: filter,
        dateStart,
      })

      // Filtrar por estado si es necesario (ya que parece que la API no lo soporta)
      let filteredPromotions = response.data
      if (statusFilter) {
        filteredPromotions = response.data.filter((promo) => {
          const isActive = promo.stock_restante > 0 && new Date(promo.date_end) > new Date()
          return statusFilter === "active" ? isActive : !isActive
        })
      }

      set(() => ({
        promotions: filteredPromotions,
        loading: false,
        links: response.links,
        meta: response.meta,
      }))
    } catch (error) {
      console.error("Error loading promotions:", error)
      set(() => ({ loading: false, promotions: [] }))
    }
  },
  loadPromotionsWeek: async () => {
    set(() => ({ loading: true }))
    try {
      const response: PromotionCollection = await getPromotionWeek()
      set(() => ({
        promotionsWeek: response.data,
        loading: false,
      }))
    } catch (error) {
      console.error("Error loading weekly promotions:", error)
      set(() => ({ loading: false }))
    }
  },
}))
