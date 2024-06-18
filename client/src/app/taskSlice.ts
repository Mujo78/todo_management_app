import { StateCreator } from "zustand";

export interface TaskType {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AllTasksType {
  data: TaskType[];
  pageNumber: number;
  totalCount: number;
}

interface TasksState {
  tasks: AllTasksType | null;

  setTasks: (tasks: AllTasksType) => void;
}

export const createAuthSlice: StateCreator<TasksState, [], []> = (set) => ({
  tasks: null,

  setTasks: (tasks) => {
    set({ tasks });
  },
});
