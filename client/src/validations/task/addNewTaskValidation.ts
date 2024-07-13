import { isAfter, isDate } from "date-fns";
import * as Yup from "yup";

const Priority = {
  Low: 0,
  Medium: 1,
  High: 2,
};

const priorities = [Priority.Low, Priority.Medium, Priority.High];

const Status = {
  Open: 0,
  InProgress: 1,
  Completed: 2,
};

const statuses = [Status.Open, Status.InProgress, Status.Completed];

export const addTaskValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required.")
    .min(10, "Title must be at least 10 characters long."),
  description: Yup.string(),

  dueDate: Yup.date()
    .typeError("Invalid date!")
    .required("Due date is required.")
    .test("valid-date", "Date can not be in the past!", (value) => {
      if (isDate(value) && !isAfter(value, new Date())) {
        return false;
      }
      return true;
    }),

  priority: Yup.number()
    .typeError("Please choose valid priority for your task.")
    .required("Priority is required.")
    .oneOf(priorities, "Priority must be: Low, Medium or High."),
  status: Yup.number()
    .typeError("Please choose valid status for your task.")
    .required("Status is required.")
    .oneOf(statuses, "Status must be: Open, In Progress or Completed."),
});
