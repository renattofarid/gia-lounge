
import { useAuthStore } from "../lib/auth.store";

export const isAuthenticated = () => {
  const { isAuthenticated } = useAuthStore.getState();
  return isAuthenticated;
};
