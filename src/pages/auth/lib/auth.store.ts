import { create } from "zustand";
import { Permission, User } from "../service/auth.interface";

interface AuthState {
  token: string | null;
  user: User | null;
  message: string | null;
  permisos: Permission[];
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setMessage: (message: string) => void;
  setPermisos: (permisos: Permission[]) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"),
  user: null,
  message: null,
  permisos: localStorage.getItem("permisos")
    ? JSON.parse(localStorage.getItem("permisos") as string)
    : [],
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setUser: (user) => set({ user }),
  setMessage: (message) => set({ message }),
  setPermisos: (permisos) => {
    localStorage.setItem("permisos", JSON.stringify(permisos));
    set({ permisos });
  },
  clearAuth: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, message: null });
  },
}));
