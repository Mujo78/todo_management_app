import { StateCreator, create } from "zustand";

export interface UserType {
  id: string;
  name: string;
  email: string;
  emailConfirmed: boolean;
  createdAt: Date;
}

export interface LoginData {
  accessToken: string;
  user: UserType;
}

interface AuthState {
  auth: LoginData | null;
  isAuthenticated: boolean;
  lng: string;

  setLng: (newLng: string) => void;
  setUser: (auth: LoginData) => void;
  updateUserInfo: (data: UserType) => void;
  logout: () => void;
  initialize: () => void;
}

export const authSlice: StateCreator<AuthState, [], []> = (set, get) => ({
  auth: null,
  isAuthenticated: false,
  lng: "en",

  setLng: (newLng) => {
    localStorage.setItem("lng", newLng);
    set({ lng: newLng });
  },
  setUser: (auth) => {
    localStorage.setItem("auth", auth.accessToken);
    localStorage.setItem("user", JSON.stringify(auth.user));
    set({ auth, isAuthenticated: true });
  },
  updateUserInfo: (data) => {
    const { auth } = get();

    if (auth) {
      set({ auth: { ...auth, user: data } });
      localStorage.setItem("user", JSON.stringify(data));
    }
  },
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("auth");
    set({ auth: null, isAuthenticated: false });
  },
  initialize: () => {
    const langugage = localStorage.getItem("lng") ?? "en";
    const userString = localStorage.getItem("user");
    const accessToken = localStorage.getItem("auth");

    set({ lng: langugage });

    if (accessToken && userString) {
      const user = JSON.parse(userString);

      set({
        auth: {
          accessToken,
          user,
        },
        isAuthenticated: true,
      });
    }
  },
});

const useAuthStore = create(authSlice);

export default useAuthStore;
