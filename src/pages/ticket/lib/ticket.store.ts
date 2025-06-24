// src/lib/ticket.store.ts
import { create } from "zustand";
import type { TicketItem } from "./ticket.interface";
import type { Links, Meta } from "@/lib/global.interface";
import { getTickets } from "./ticket.action";

interface LotteryTicketStore {
  tickets: TicketItem[];
  loading: boolean;
  filter: string;
  meta: Meta;
  links: Links ;

  setFilter: (filter: string) => void;
  loadTickets: (
    lotteryId: number,
    page?: number,
    ignoreFilter?: boolean
  ) => Promise<void>;
}

export const useLotteryTicketStore = create<LotteryTicketStore>((set, get) => ({
  tickets: [],
  loading: false,
  filter: "",
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
  setFilter: (filter) => set({ filter }),

  loadTickets: async (lotteryId, page = 1, ignoreFilter = false) => {
    set({ loading: true });
    try {
      const { filter } = get();
      const data = await getTickets({
        lottery_id: lotteryId,
        page,
        search: ignoreFilter ? "" : filter,
      });

      set({
        tickets: data.data,
        meta: data.meta,
        links: data.links,
        loading: false,
      });
    } catch (err) {
      console.error("Error loading tickets:", err);
      set({ loading: false });
    }
  },
}));
