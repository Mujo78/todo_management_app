import { Badge, Button, Card, Stack } from "@mui/material";
import useGetTasks from "../features/tasks/useGetTasks";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { formatPriority } from "../components/utils/taskUtils";
import TaskSearchInput from "../components/Task/TaskSearchInput";
import { format } from "date-fns";
import { useSearchQuery } from "../hooks/useSearchQuery";

const HomePage = () => {
  const navigate = useNavigate();
  const query = useSearchQuery();
  const pageNum = query.get("pageNum") || 1;
  const name = query.get("name");
  const { data } = useGetTasks({ name, pageNum });

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Stack gap={2}>
      <Stack direction="row">
        <TaskSearchInput />
        <Button
          color="info"
          size="small"
          variant="contained"
          onClick={() => handleNavigate("/add-task")}
        >
          <AddIcon />
        </Button>
      </Stack>
      {data?.data?.map((m) => (
        <Card
          onClick={() => handleNavigate(`/edit-task/${m.id}`)}
          key={m.id}
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
          {m.title}
          <Stack flexDirection="row" alignItems="center" gap={4}>
            <Badge color={formatPriority(m.priority)} badgeContent="" />
            {format(m.dueDate, "dd/MM/yyyy - HH:mm")}
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};

export default HomePage;
