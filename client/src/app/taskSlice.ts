import { differenceInMinutes } from "date-fns";
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

export interface CreateUpdateTaskType {
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

  initialize: () => void;
  setTasks: (tasks: AllTasksType) => void;
  addTaskToAction: (taskId: string) => void;
  removeTaskToAction: (taskId: string) => void;
  isChecked: (taskId: string) => boolean;
  makeTasksFinished: () => void;
  removeSelectedTasks: () => void;
  taskForNotification: () => TaskType | undefined;
}

export const taskSlice: StateCreator<TasksState, [], []> = (set, get) => ({
  tasks: null,
  tasksToAction: [],

  initialize: () => {
    set({ tasks: null, tasksToAction: [] });
  },
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
  isChecked: (taskId) => {
    const tasksToAction = get().tasksToAction;
    return tasksToAction.includes(taskId);
  },
  makeTasksFinished: () => {
    const { tasks, tasksToAction } = get();

    if (tasks) {
      const updated = tasks.data.map((task) =>
        tasksToAction.includes(task.id) ? { ...task, status: 1 } : task
      );

      set({ tasks: { ...tasks, data: updated }, tasksToAction: [] });
    }
  },
  removeSelectedTasks: () => {
    const { tasks, tasksToAction } = get();

    if (tasks) {
      const updated = tasks.data.filter(
        (task) => !tasksToAction.includes(task.id)
      );

      set({ tasks: { ...tasks, data: updated }, tasksToAction: [] });
    }
  },

  taskForNotification: () => {
    const { tasks } = get();

    if (tasks?.data) {
      const taskToFind = tasks.data.find((task) => {
        return (
          Number(differenceInMinutes(new Date(task?.dueDate), new Date())) <=
            15 && task?.status === 0
        );
      });

      if (taskToFind) return taskToFind;
      return undefined;
    }
  },
});

const useTaskStore = create(taskSlice);

export default useTaskStore;
