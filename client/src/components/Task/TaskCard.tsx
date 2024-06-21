import { Badge, Card, Checkbox, Stack } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTaskStore, { TaskType } from "../../app/taskSlice";
import { formatPriority } from "../utils/taskUtils";
import { format } from "date-fns";

interface Props {
  data: TaskType;
}

const TaskCard: React.FC<Props> = ({ data }) => {
  const [checked, setChecked] = useState<boolean>(false);
  const { addTaskToAction, removeTaskToAction, tasksToAction } = useTaskStore();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/edit-task/${data.id}`);
  };

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(event.target.checked);
      if (event.target.checked === true) {
        addTaskToAction(data.id);
      } else {
        removeTaskToAction(data.id);
      }
    },
    [addTaskToAction, removeTaskToAction, data.id]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.stopPropagation();
    },
    []
  );

  console.log(tasksToAction);
  return (
    <Card
      onClick={handleNavigate}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.2rem",
        cursor: "pointer",
        transition: "all 0.5s",
        "&:hover": {
          backgroundColor: "info.main",
        },
      }}
    >
      <Stack direction="row" alignItems="center" gap={2}>
        <Checkbox
          size="small"
          color="primary"
          checked={checked}
          onClick={handleClick}
          onChange={handleChange}
        />

        {data.title}
      </Stack>
      <Stack flexDirection="row" alignItems="center" gap={4}>
        <Badge color={formatPriority(data.priority)} badgeContent="" />
        {format(data.dueDate, "dd/MM/yyyy - HH:mm")}
      </Stack>
    </Card>
  );
};

export default TaskCard;
