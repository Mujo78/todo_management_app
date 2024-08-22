import { useForm } from "react-hook-form";
import { addTaskValidationSchema } from "../../../validations/task/addNewTaskValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateUpdateTaskType } from "../../../app/taskSlice";
import useCreateTask from "../../../features/tasks/useCreateNewTask";
import SuccessAlert from "../../../components/UI/SuccessAlert";
import TaskForm from "../../../components/Task/TaskForm";
import { useTranslation } from "react-i18next";

const AddNewTask = () => {
  const { t } = useTranslation();
  const { control, formState, handleSubmit, reset } =
    useForm<CreateUpdateTaskType>({
      resolver: yupResolver(addTaskValidationSchema),
    });
  const { errors, isDirty } = formState;

  const { createTask, error, isError, isPending, isSuccess } = useCreateTask();

  const onSubmit = (values: CreateUpdateTaskType) => {
    if (isDirty) {
      createTask(values, { onSuccess: () => reset() });
    }
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
      title={t("addTask.title")}
    >
      <SuccessAlert isSuccess={isSuccess}>
        {t("addTask.successMessage")}
      </SuccessAlert>
    </TaskForm>
  );
};

export default AddNewTask;
