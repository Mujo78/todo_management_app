import {
  Alert,
  Badge,
  Button,
  Card,
  CircularProgress,
  Stack,
} from "@mui/material";
import useGetTasks from "../features/tasks/useGetTasks";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { formatPriority } from "../components/utils/taskUtils";
import TaskSearchInput from "../components/Task/TaskSearchInput";
import { format } from "date-fns";
import { useSearchQuery } from "../hooks/useSearchQuery";
import PaginationModified from "../components/UI/Pagination";
import { formatErrorMessage } from "../components/utils/userUtils";
import InfoIcon from "@mui/icons-material/Info";

const HomePage = () => {
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

  const handlePageChange = (newPage: number) => {
    if (pageNum !== newPage) {
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
      <Stack gap={2}>
        {isPending ? (
          <Stack alignItems="center" p={6}>
            <CircularProgress />
          </Stack>
        ) : isError ? (
          <Alert color="error">{formatErrorMessage(error)}</Alert>
        ) : isSuccess && data?.data && data.data.length === 0 ? (
          <Alert icon={<InfoIcon />} color="secondary">
            No data available.
          </Alert>
        ) : (
          data?.data?.map((m) => (
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
          ))
        )}
      </Stack>
      {data?.data && data.data.length > 0 ? (
        <PaginationModified
          page={Number(pageNum)}
          total={data?.totalCount}
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
