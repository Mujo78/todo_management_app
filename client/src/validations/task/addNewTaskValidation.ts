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
    .required("taskFormValidation.titleRequired")
    .min(10, "taskFormValidation.titleLength"),
  description: Yup.string(),

  dueDate: Yup.date()
    .typeError("taskFormValidation.invalidDate")
    .required("taskFormValidation.dueDateRequired")
    .test("valid-date", "taskFormValidation.dueDatePast", (value) => {
      if (isDate(value) && !isAfter(value, new Date())) {
        return false;
      }
      return true;
    }),

  priority: Yup.number()
    .typeError("taskFormValidation.priorityValid")
    .required("taskFormValidation.priorityRequired")
    .oneOf(priorities, "taskFormValidation.priorityValidOption"),
  status: Yup.number()
    .typeError("taskFormValidation.statusValid")
    .required("taskFormValidation.statusRequired")
    .oneOf(statuses, "taskFormValidation.statusValidOption"),
});
