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

interface TasksState {
  tasks: TaskType[];

  setTasks: (tasks: TaskType[]) => void;
}

export const createAuthSlice: StateCreator<TasksState, [], []> = (set) => ({
  tasks: [],

  setTasks: (tasks) => {
    set({ tasks });
  },
});
