import { StateCreator } from "zustand";

interface LoginData {
  accessToken: string;
  refreshToken: string | null;
}

interface AuthState {
  user: LoginData | null;
  isAuthenticated: boolean;

  setUser: (user: LoginData) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthState, [], []> = (set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    localStorage.setItem("user", user.accessToken);
    document.cookie = `refre`;
    set({ user, isAuthenticated: true });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
});
