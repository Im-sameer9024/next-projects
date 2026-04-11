import { create } from "zustand";

type authStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}


export const useAuthStore = create<authStore>((set) => ({
  loading: false,

  setLoading: (loading: boolean) => set({ loading: loading }),
}));
