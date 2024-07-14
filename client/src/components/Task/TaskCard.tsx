import { Badge, Card, Checkbox, Stack, Typography } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import useTaskStore, { TaskType } from "../../app/taskSlice";
import { formatPriority } from "../utils/task/taskUtils";
import { format } from "date-fns";

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
  const isFailed = data?.status === 2;

  return (
    <Card
      onClick={handleNavigate}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "start",
        alignItems: "center",
        maxWidth: "100%",
        padding: "1rem",
        flexGrow: 1,
        gap: {
          xs: 0.2,
          sm: 1,
        },
        textAlign: "center",
        cursor: "pointer",
        textDecoration: isCompleted || isFailed ? "line-through" : "none",
        transition: { xs: "none", lg: "background-color 0.5s" },
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
      <Stack direction="row" alignItems="center">
        <Checkbox
          inputProps={{ "aria-label": "controlled" }}
          aria-describedby={`Select-${data.title}-task`}
          size="small"
          disabled={isCompleted || isFailed}
          id={`checkbox-${data.title}`}
          color="primary"
          checked={checked}
          onClick={handleClick}
          onChange={handleChange}
        />
      </Stack>
      <Stack
        flexDirection={{
          xs: "column",
          sm: "row",
        }}
        flexGrow={1}
        gap={1}
        maxWidth="100%"
        textAlign="start"
        justifyContent="space-between"
      >
        <Typography paragraph component="span" my="auto">
          {data.title.slice(0, 20)}...
        </Typography>
        <Typography>{format(data.dueDate, "dd/MM/yyyy - HH:mm")}</Typography>
      </Stack>
      <Stack
        flexDirection="row"
        alignItems="center"
        ml="auto"
        flexGrow={0}
        px={2}
      >
        <Badge color={formatPriority(data.priority)} badgeContent="" />
      </Stack>
    </Card>
  );
};

export default TaskCard;
