import { useParams } from "react-router-dom";
import useGetTask from "../../../features/tasks/useGetTask";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateUpdateTaskType, TaskType } from "../../../app/taskSlice";
import { addTaskValidationSchema } from "../../../validations/task/addNewTaskValidation";
import { useEffect, useState } from "react";
import TaskForm from "../../../components/Task/TaskForm";
import useUpdateTask from "../../../features/tasks/useUpdateTask";
import SuccessAlert from "../../../components/UI/SuccessAlert";
import { Alert, CircularProgress, Stack } from "@mui/material";
import DeleteTaskModal from "../../../components/Task/DeleteTaskModal/DeleteTaskModal";
import { Info } from "@mui/icons-material";
import { formatErrorMessage } from "../../../components/utils/user/userUtils";

const EditTask = () => {
  const [show, setShow] = useState<boolean>(false);
  const { taskId } = useParams();

  const { data, isSuccess, isError, isPending, error } = useGetTask(taskId);
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
      const updatedData = { ...data, dueDate: new Date(data.dueDate) };
      reset(updatedData);
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
      ) : data ? (
        <>
          <TaskForm
            title="Edit task"
            control={control}
            error={errorUpdate}
            errors={errors}
            handleSubmit={handleSubmit}
            isError={isUpdatingError}
            isPending={isUpdating}
            onSubmit={onSubmit}
            setShow={setShow}
            isDisabled={data?.status === 1 || data?.status === 2}
            isDateDisabled={data?.status === 1}
          >
            <SuccessAlert isSuccess={isUpdatingSuccess}>
              Task successfully updated.
            </SuccessAlert>
          </TaskForm>
          {show && taskId && (
            <DeleteTaskModal
              setShow={setShow}
              show={show}
              title={control._formValues.title}
              taskId={taskId}
            />
          )}
        </>
      ) : (
        isError && (
          <Stack flexGrow={1}>
            <Alert severity="error" icon={<Info />}>
              {formatErrorMessage(error)}
            </Alert>
          </Stack>
        )
      )}
    </>
  );
};

export default EditTask;
