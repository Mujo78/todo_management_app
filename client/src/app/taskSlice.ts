import { StateCreator, create } from "zustand";

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

export interface CreateTaskType {
  title: string;
  description?: string;
  dueDate: Date;
  priority: number;
  status: number;
}

export interface AllTasksType {
  data: TaskType[];
  pageNumber: number;
  totalCount: number;
}

interface TasksState {
  tasks: AllTasksType | null;
  tasksToAction: string[];

  setTasks: (tasks: AllTasksType) => void;
  addTaskToAction: (taskId: string) => void;
  removeTaskToAction: (taskId: string) => void;
  removeAllTaskToAction: () => void;
}

export const taskSlice: StateCreator<TasksState, [], []> = (set) => ({
  tasks: null,
  tasksToAction: [],

  setTasks: (tasks) => {
    set({ tasks });
  },
  addTaskToAction: (taskId) => {
    set((state) => ({
      tasksToAction: [...state.tasksToAction, taskId],
    }));
  },
  removeTaskToAction: (taskId) => {
    set((state) => ({
      tasksToAction: state.tasksToAction.filter((task) => task !== taskId),
    }));
  },
  removeAllTaskToAction: () => {
    set({ tasksToAction: [] });
  },
});

const useTaskStore = create(taskSlice);

export default useTaskStore;
