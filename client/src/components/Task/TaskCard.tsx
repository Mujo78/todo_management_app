import { Badge, Card, Checkbox, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTaskStore, { TaskType } from "../../app/taskSlice";
import { formatPriority } from "../utils/taskUtils";
import { format, isPast } from "date-fns";

interface Props {
  data: TaskType;
}

const TaskCard: React.FC<Props> = ({ data }) => {
  const { addTaskToAction, removeTaskToAction, isChecked } = useTaskStore();
  const [checked, setChecked] = useState<boolean>(isChecked(data.id));
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

  const isCompleted = data?.status === 1;
  const isFailed = data?.status === 2 || isPast(data.dueDate);

  return (
    <Card
      onClick={handleNavigate}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.2rem",
        cursor: "pointer",
        textDecoration: isCompleted || isFailed ? "line-through" : "none",
        transition: "all 0.5s",
        bgcolor: isCompleted
          ? "lightgreen"
          : isFailed
          ? "#FFCCCB"
          : "transparent",
        "&:hover": {
          backgroundColor: isCompleted
            ? "success.main"
            : isFailed
            ? "#f9504d"
            : "info.main",
        },
      }}
    >
      <Stack direction="row" alignItems="center" width="70%" gap={2}>
        <Checkbox
          size="small"
          disabled={isCompleted || isFailed}
          id={`checkbox-${data.title}`}
          color="primary"
          checked={checked}
          onClick={handleClick}
          onChange={handleChange}
        />
        <Typography
          paragraph
          component="span"
          my="auto"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%",
          }}
        >
          {data.title}
        </Typography>
      </Stack>
      <Stack flexDirection="row" alignItems="center" gap={4}>
        <Badge color={formatPriority(data.priority)} badgeContent="" />
        {format(data.dueDate, "dd/MM/yyyy - HH:mm")}
      </Stack>
    </Card>
  );
};

export default TaskCard;
