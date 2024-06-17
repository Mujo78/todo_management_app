import { Button, Card, Stack } from "@mui/material";
import useGetTasks from "../features/tasks/useGetTasks";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { formatPriority, formatStatus } from "../components/utils/taskUtils";

const HomePage = () => {
  const navigate = useNavigate();
  const { data } = useGetTasks();

  const handleNavigate = () => {
    navigate("/add-task");
  };

  return (
    <Stack>
      {data?.map((m) => (
        <Card key={m.id}>
          {m.title}
          {formatPriority(m.priority)}
          {formatStatus(m.status)}
        </Card>
      ))}

      <Button
        color="info"
        variant="contained"
        onClick={handleNavigate}
        startIcon={<AddIcon />}
      >
        Add new task
      </Button>
    </Stack>
  );
};

export default HomePage;
