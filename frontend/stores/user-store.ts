import { create } from "zustand";
import { User } from "../types/user";
import { getMe } from "../lib/api";

interface UserState {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  logout: () => void;
  initAuth: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  login: (user) => set({ user }),
  logout: () => {
    localStorage.removeItem("auth_token");
    set({ user: null });
  },
  initAuth: async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        const user = await getMe();
        set({ user, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (err) {
      localStorage.removeItem("auth_token");
      set({ user: null, loading: false });
    }
  }
}));
