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
import { CircularProgress } from "@mui/material";

const EditTask = () => {
  const { taskId } = useParams();

  const { data, isSuccess, isError, isPending } = useGetTask(taskId);
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
  const { errors, isDirty } = formState;

  useEffect(() => {
    if (data && isSuccess) {
      data.dueDate = new Date(data.dueDate);
      reset(data);
    }
  }, [data, reset, isSuccess]);

  const onSubmit = (data: CreateUpdateTaskType) => {
    if (
      taskId &&
      !isError &&
      (data.status === 0 || data.status > 1) &&
      isDirty
    ) {
      const values = data as TaskType;
      updateTask({ taskId, values });
    }
  };

  return (
    <>
      {isPending ? (
        <CircularProgress sx={{ margin: "auto" }} />
      ) : (
        data && (
          <TaskForm
            title="Edit task"
            control={control}
            error={errorUpdate}
            errors={errors}
            handleSubmit={handleSubmit}
            isError={isUpdatingError}
            isPending={isUpdating}
            onSubmit={onSubmit}
            isDisabled={data?.status === 1 || data?.status === 2}
            isDateDisabled={data?.status === 1}
          >
            <SuccessAlert isSuccess={isUpdatingSuccess}>
              Task successfully updated.
            </SuccessAlert>
          </TaskForm>
        )
      )}
    </>
  );
};

export default EditTask;
