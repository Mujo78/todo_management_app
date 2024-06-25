import { useForm } from "react-hook-form";
import { addTaskValidationSchema } from "../../validations/addNewTaskValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateTaskType } from "../../app/taskSlice";
import useCreateTask from "../../features/tasks/useCreateNewTask";
import SuccessAlert from "../../components/UI/SuccessAlert";
import TaskForm from "../../components/Task/TaskForm";

const AddNewTask = () => {
  const { control, formState, handleSubmit, reset } = useForm<CreateTaskType>({
    resolver: yupResolver(addTaskValidationSchema),
  });
  const { errors } = formState;

  const { createTask, error, isError, isPending, isSuccess } = useCreateTask();

  const onSubmit = (values: CreateTaskType) => {
    createTask(values, { onSuccess: () => reset() });
  };

  return (
    <TaskForm
      control={control}
      error={error}
      errors={errors}
      handleSubmit={handleSubmit}
      isError={isError}
      isPending={isPending}
      onSubmit={onSubmit}
    >
      <SuccessAlert isSuccess={isSuccess}>
        Successfully created a new task.
      </SuccessAlert>
    </TaskForm>
  );
};

export default AddNewTask;
