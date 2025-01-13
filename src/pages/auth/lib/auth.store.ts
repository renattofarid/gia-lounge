import { create } from "zustand";
import { User } from "../service/auth.interface";

interface AuthState {
  token: string | null;
  user: User | null;
  message: string | null;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setMessage: (message: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("token"), 
  user: null,
  message: null,
  setToken: (token) => {
    localStorage.setItem("token", token); 
    set({ token });
  },
  setUser: (user) => set({ user }),
  setMessage: (message) => set({ message }),
  clearAuth: () => {
    localStorage.removeItem("token"); 
    set({ token: null, user: null, message: null });
  },
}));
