import React from "react";
import { Button, Stack, Tooltip } from "@mui/material";
import { Delete, DeleteSweep, Check } from "@mui/icons-material";
import useTaskStore from "../../app/taskSlice";
import useDeleteAllTasks from "../../features/tasks/useDeleteAllTasks";
import { useNavigate } from "react-router-dom";
import useMakeTasksFinished from "../../features/tasks/useMakeTasksFinished";

const TaskOptionsHeader: React.FC = () => {
  const navigate = useNavigate();
  const { tasksToAction, tasks } = useTaskStore();

  const { deleteAllTasks, isPending } = useDeleteAllTasks();
  const { finishTasks, isPending: isMakingFinished } = useMakeTasksFinished();
  const isLoading = isMakingFinished || isPending;

  const removeAllTasks = () => {
    if (!isLoading) {
      deleteAllTasks(undefined, { onSuccess: () => navigate("/home") });
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
          <Button
            color="success"
            variant="contained"
            onClick={makeTasksCompleted}
          >
            <Tooltip title="Make finished">
              <Check />
            </Tooltip>
          </Button>
          <Button color="error" variant="contained">
            <Tooltip title="Remove selected">
              <Delete />
            </Tooltip>
          </Button>
        </Stack>
      )}
      {tasks && tasks?.data.length > 0 && (
        <Button
          color="error"
          onClick={removeAllTasks}
          sx={{ marginLeft: "auto" }}
          variant="contained"
        >
          <Tooltip title="Remove all">
            <DeleteSweep />
          </Tooltip>
        </Button>
      )}
    </Stack>
  );
};

export default TaskOptionsHeader;
