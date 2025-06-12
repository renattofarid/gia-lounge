import { create } from "zustand";
import type { Links, Meta } from "@/lib/global.interface";
import { LotteryCollection, LotteryItem } from "./lottery.interface";
import { getRaffles } from "./lottery.actions";

interface LotteryStore {
  raffles: LotteryItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  loadRaffles: (page: number, name?: string, eventId?: number) => void;
}

export const useLotteryStore = create<LotteryStore>((set) => ({
  raffles: [],
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
  loadRaffles: async (page: number, name?: string, eventId?: number) => {
    set(() => ({ loading: true }));
    const response: LotteryCollection = await getRaffles({
      page,
      name,
      eventId,
    });
    set(() => ({
      raffles: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }));
  },
}));
