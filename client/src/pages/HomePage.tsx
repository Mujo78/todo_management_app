import { Alert, Button, CircularProgress, Stack } from "@mui/material";
import useGetTasks from "../features/tasks/useGetTasks";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import TaskSearchInput from "../components/Task/TaskSearchInput";
import { useSearchQuery } from "../hooks/useSearchQuery";
import PaginationModified from "../components/UI/Pagination";
import { formatErrorMessage } from "../components/utils/userUtils";
import InfoIcon from "@mui/icons-material/Info";
import TaskCard from "../components/Task/TaskCard";
import { useEffect } from "react";
import useTaskStore from "../app/taskSlice";
import { Delete, DeleteSweep, Check } from "@mui/icons-material";

const HomePage = () => {
  const { setTasks, tasks, tasksToAction, removeAllTaskToAction } =
    useTaskStore();
  const navigate = useNavigate();
  const query = useSearchQuery();
  const pageNum = query.get("pageNum") || 1;
  const name = query.get("name");
  const { data, isSuccess, isPending, error, isError } = useGetTasks({
    name,
    pageNum,
  });

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    if (data && isSuccess) {
      setTasks(data);
    }
  }, [data, isSuccess, setTasks]);

  const handlePageChange = (newPage: number) => {
    if (pageNum !== newPage) {
      removeAllTaskToAction();
      query.set("pageNum", newPage.toString());
      navigate(`/home?${query.toString()}`);
    }
  };

  const handleClear = () => {
    query.delete("name");
    query.set("pageNum", "1");
    navigate(`/home?${query.toString()}`);
  };

  return (
    <Stack gap={4} flexGrow={1}>
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
      <Stack direction="row">
        {tasksToAction.length > 0 && (
          <>
            <Button color="success" variant="contained">
              <Check />
            </Button>
            <Stack flexDirection="row" gap={3} ml="auto">
              <Button color="error" variant="contained">
                <Delete />
              </Button>
              <Button color="error" variant="contained">
                <DeleteSweep />
              </Button>
            </Stack>
          </>
        )}
      </Stack>
      <Stack gap={2}>
        {isPending ? (
          <Stack alignItems="center" p={6}>
            <CircularProgress />
          </Stack>
        ) : isError ? (
          <Alert color="error">{formatErrorMessage(error)}</Alert>
        ) : isSuccess && tasks?.data && tasks.data.length === 0 ? (
          <Alert icon={<InfoIcon />} color="secondary">
            No data available.
          </Alert>
        ) : (
          tasks?.data?.map((m) => <TaskCard key={m.id} data={m} />)
        )}
      </Stack>
      {tasks?.data && tasks.data.length > 0 ? (
        <PaginationModified
          page={Number(pageNum)}
          total={tasks?.totalCount}
          handleNavigate={handlePageChange}
        />
      ) : (
        isSuccess && (
          <Button
            onClick={handleClear}
            color="error"
            variant="contained"
            sx={{ width: "fit-content", margin: "auto 0 0 auto" }}
          >
            Clear
          </Button>
        )
      )}
    </Stack>
  );
};

export default HomePage;
