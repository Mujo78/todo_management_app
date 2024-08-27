import { setupServer } from "msw/node";
import { handlers } from "./handlers";
import { AxiosError } from "axios";
import { authHandler } from "./authHandlers";
import { taskHandler } from "./taskHandlers";
import { addDays, subDays } from "date-fns";
import { TaskType } from "../app/taskSlice";

export const serviceWorker = setupServer(
  ...handlers,
  ...authHandler,
  ...taskHandler
);

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
  lng: "eng",
  isAuthenticated: true,
  setLng: vi.fn(),
  setUser: vi.fn(),
  updateUserInfo: vi.fn(),
  logout: vi.fn(),
  initialize: vi.fn(),
};

export const tasksToReturn: TaskType[] = [
  {
    id: "openTask",
    createdAt: new Date(),
    description: "Open Task description",
    dueDate: addDays(new Date(), 2),
    priority: 2,
    status: 0,
    title: "Open Task Here",
    updatedAt: new Date(),
    userId: "userIdForOpenTask",
  },
  {
    id: "failedTask",
    createdAt: new Date(),
    description: "Failed Task description",
    dueDate: subDays(new Date(), 2),
    priority: 2,
    status: 2,
    title: "Failed Task Here",
    updatedAt: new Date(),
    userId: "userIdForFailedTask",
  },
  {
    id: "completedTask",
    createdAt: new Date(),
    description: "Completed Task description",
    dueDate: addDays(new Date(), 2),
    priority: 2,
    status: 1,
    title: "Completed Task Here",
    updatedAt: new Date(),
    userId: "userIdForCompletedTask",
  },
  {
    id: "completedTaskSecond",
    createdAt: new Date(),
    description: "Completed Task description",
    dueDate: addDays(new Date(), 2),
    priority: 2,
    status: 1,
    title: "Completed Task Here Second",
    updatedAt: new Date(),
    userId: "userIdForCompletedTask",
  },
  {
    id: "completedTaskThird",
    createdAt: new Date(),
    description: "Completed Task description",
    dueDate: addDays(new Date(), 2),
    priority: 2,
    status: 1,
    title: "Completed Task Here Third",
    updatedAt: new Date(),
    userId: "userIdForCompletedTask",
  },
  {
    id: "completedTaskForth",
    createdAt: new Date(),
    description: "Completed Task description",
    dueDate: addDays(new Date(), 2),
    priority: 2,
    status: 1,
    title: "Completed Task Here Forth",
    updatedAt: new Date(),
    userId: "userIdForCompletedTask",
  },
  {
    id: "completedTaskFifth",
    createdAt: new Date(),
    description: "Completed Task description",
    dueDate: addDays(new Date(), 2),
    priority: 2,
    status: 1,
    title: "Completed Task Here Fifth",
    updatedAt: new Date(),
    userId: "userIdForCompletedTask",
  },
];

export const mockTaskStore = {
  tasks: {
    data: tasksToReturn,
    pageNumber: 1,
    totalCount: 1,
  },
  tasksToAction: ["openTask"],
  initialize: vi.fn(),
  setTasks: vi.fn(),
  addTaskToAction: vi.fn(),
  removeTaskToAction: vi.fn(),
  isChecked: vi.fn(),
  makeTasksFinished: vi.fn(),
  removeSelectedTasks: vi.fn(),
  updateExpiredTask: vi.fn(),
  findExpiredTask: vi.fn(),
};
