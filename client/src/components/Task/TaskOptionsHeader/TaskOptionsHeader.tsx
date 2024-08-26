import React from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import { Delete, DeleteSweep, Check } from "@mui/icons-material";
import useTaskStore from "../../../app/taskSlice";
import useDeleteAllTasks from "../../../features/tasks/useDeleteAllTasks";
import { useNavigate } from "react-router-dom";
import useMakeTasksFinished from "../../../features/tasks/useMakeTasksFinished";
import useDeleteSelectedTasks from "../../../features/tasks/useDeleteSelectedTasks";
import { useTranslation } from "react-i18next";

const TaskOptionsHeader: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tasksToAction, tasks } = useTaskStore();

  const { deleteAllTasks, isPending } = useDeleteAllTasks();
  const { finishTasks, isPending: isMakingFinished } = useMakeTasksFinished();
  const { deleteSelectedTasks, isPending: isDeletingSelected } =
    useDeleteSelectedTasks();
  const isLoading = isMakingFinished || isPending || isDeletingSelected;

  const removeAllTasks = () => {
    if (!isLoading) {
      deleteAllTasks(undefined, { onSuccess: () => navigate("/home") });
    }
  };

  const removeSelectedTasks = () => {
    if (tasksToAction.length > 0 && !isLoading) {
      deleteSelectedTasks(tasksToAction);
    }
  };

  const makeTasksCompleted = () => {
    if (tasksToAction.length > 0 && !isLoading) {
      finishTasks(tasksToAction);
    }
  };

  return (
    <Stack direction="row" gap={2}>
      {tasksToAction.length > 0 && (
        <Stack flexDirection="row" flexGrow={1} justifyContent="space-between">
          <Tooltip title={t("headerOptions.makeFinished")}>
            <Button
              aria-label="MakeTasksFinished"
              color="success"
              variant="contained"
              onClick={makeTasksCompleted}
            >
              <Check />
            </Button>
          </Tooltip>
          <Tooltip title={t("headerOptions.removeSelected")}>
            <Button
              color="error"
              aria-label="RemoveSelectedTasks"
              onClick={removeSelectedTasks}
              variant="contained"
            >
              <Delete />
            </Button>
          </Tooltip>
        </Stack>
      )}
      {tasks && tasks?.data.length > 0 && (
        <Tooltip title={t("headerOptions.removeAll")}>
          <Button
            aria-label="RemoveAllTasks"
            color="error"
            onClick={removeAllTasks}
            sx={{ marginLeft: "auto" }}
            variant="contained"
          >
            <DeleteSweep />
          </Button>
        </Tooltip>
      )}
    </Stack>
  );
};

export default TaskOptionsHeader;
