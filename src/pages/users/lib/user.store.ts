import { create } from "zustand";
import { UserCollection, UserItem } from "./user.interface";
import { Links, Meta } from "@/lib/global.interface";
import { getUsers } from "./user.actions";

interface UserStore {
  users: UserItem[];
  links: Links;
  meta: Meta;
  loading: boolean;
  filter: string
  setFilter: (filter: string) => void
  loadUsers: (page: number) => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
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
  loadUsers: async (page: number) => {
    set(() => ({ loading: true }));
    const filter = get().filter
    const response: UserCollection = await getUsers({ page, username: filter });
    set(() => ({
      users: response.data,
      links: response.links,
      meta: response.meta,
      loading: false,
    }));
  },
}));

// function convertGrouMenuLocalStorage(): GroupMenu[] {
//   const groupMenus = localStorage.getItem("groupMenus");
//   if (groupMenus) {
//     return JSON.parse(groupMenus);
//   }
//   return [];
// }
