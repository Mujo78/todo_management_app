import { useParams } from "react-router-dom";
import useGetTask from "../../features/tasks/useGetTask";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateUpdateTaskType, TaskType } from "../../app/taskSlice";
import { addTaskValidationSchema } from "../../validations/addNewTaskValidation";
import { useEffect } from "react";
import TaskForm from "../../components/Task/TaskForm";
import useUpdateTask from "../../features/tasks/useUpdateTask";
import SuccessAlert from "../../components/UI/SuccessAlert";
import { Alert, CircularProgress } from "@mui/material";
import { formatErrorMessage } from "../../components/utils/userUtils";

const EditTask = () => {
  const { taskId } = useParams();

  const { data, error, isSuccess, isError, isPending } = useGetTask(taskId);
  const {
    updateTask,
    errorUpdate,
    isUpdating,
    isUpdatingError,
    isUpdatingSuccess,
  } = useUpdateTask();

  const { control, formState, handleSubmit, reset } =
    useForm<CreateUpdateTaskType>({
      resolver: yupResolver(addTaskValidationSchema),
    });
  const { errors } = formState;

  useEffect(() => {
    if (data && isSuccess) {
      data.dueDate = new Date(data.dueDate);
      reset(data);
    }
  }, [data, reset, isSuccess]);

  const onSubmit = (data: CreateUpdateTaskType) => {
    if (taskId && !isError) {
      const values = data as TaskType;
      updateTask({ taskId, values });
    }
  };

  return (
    <>
      {isPending ? (
        <CircularProgress />
      ) : (
        <TaskForm
          title="Edit task"
          control={control}
          error={errorUpdate}
          errors={errors}
          handleSubmit={handleSubmit}
          isError={isUpdatingError}
          isPending={isUpdating}
          onSubmit={onSubmit}
        >
          {isUpdatingSuccess ? (
            <SuccessAlert isSuccess={isUpdatingSuccess}>
              Well done!
            </SuccessAlert>
          ) : (
            isError && (
              <Alert severity="error">{formatErrorMessage(error)}</Alert>
            )
          )}
        </TaskForm>
      )}
    </>
  );
};

export default EditTask;
