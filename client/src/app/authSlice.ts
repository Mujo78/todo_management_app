import { StateCreator, create } from "zustand";

export interface LoginData {
  accessToken: string;
}

interface AuthState {
  user: LoginData | null;
  isAuthenticated: boolean;

  setUser: (user: LoginData) => void;
  logout: () => void;
}

export const authSlice: StateCreator<AuthState, [], []> = (set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => {
    localStorage.setItem("user", user.accessToken);
    set({ user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },
});

const useAuthStore = create(authSlice);

export default useAuthStore;
