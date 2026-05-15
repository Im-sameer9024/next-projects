import { create } from "zustand";

export type UserRole = "USER" | "TEACHER" ;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;

  user: User | null;

  isLoading: boolean;

  setToken: (token: string) => void;

  setUser: (user: User) => void;

  setAuth: (token: string, user: User) => void;

  setLoading: (loading: boolean) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,

  user: null,

  isLoading: true,

  /* ---------------- SET TOKEN ---------------- */

  setToken: (token) =>
    set({
      token,
    }),

  /* ---------------- SET USER ---------------- */

  setUser: (user) =>
    set({
      user,
    }),

  /* ---------------- SET AUTH ---------------- */

  setAuth: (token, user) =>
    set({
      token,
      user,
    }),

  /* --------------- SET LOADING --------------- */

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  /* ---------------- LOGOUT ---------------- */

  logout: () =>
    set({
      token: null,
      user: null,
    }),
}));
