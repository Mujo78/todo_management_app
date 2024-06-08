import { StateCreator } from "zustand";

interface TaskType {
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
}

export const createAuthSlice: StateCreator<TasksState, [], []> = () => ({
  tasks: [],
});
