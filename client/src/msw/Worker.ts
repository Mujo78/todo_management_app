import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { AxiosError } from "axios";
import { authHandler } from "./authHandlers";

export const serviceWorker = setupServer(...handlers, ...authHandler);

export interface ErrorResponse {
  type: string;
  title: string;
  status: number;
  detail: string;
}

export type Response<T> = AxiosError | Error | T | ErrorResponse;

export const mockStore = {
  auth: {
    accessToken: "asdasdas",
    user: {
      id: "someIdHere",
      name: "User Test One",
      email: "user@gmail.com",
      emailConfirmed: true,
      createdAt: new Date(),
    },
  },
  isAuthenticated: true,
  setUser: vi.fn(),
  updateUserInfo: vi.fn(),
  logout: vi.fn(),
  initialize: vi.fn(),
};
