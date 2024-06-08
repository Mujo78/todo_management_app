import { StateCreator } from "zustand";

interface LoginData {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: LoginData | null;
}

export const createAuthSlice: StateCreator<AuthState, [], []> = () => ({
  user: null,
});
