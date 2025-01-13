import { create } from "zustand";
import { UserCollection, UserItem } from "./user.interface";
import { Links, Meta } from "@/lib/global.interface";
import { getUsers } from "./user.actions";

interface UserStore {
  users: UserItem[];
  links: Links;
  meta: Meta;
  loadUsers: (page: number) => void;
}

export const useUserStore = create<UserStore>((set) => ({
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
  loadUsers: async (page: number) => {
    const response: UserCollection = await getUsers({ page });
    set(() => ({
      users: response.data,
      links: response.links,
      meta: response.meta,
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
