import { useEffect } from "react";
import { Alert, Button, CircularProgress, Stack, Tooltip } from "@mui/material";
import useGetTasks from "../../features/tasks/useGetTasks";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import TaskSearchInput from "../../components/Task/TaskSearchInput/TaskSearchInput";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import PaginationModified from "../../components/UI/Pagination";
import { formatErrorMessage } from "../../utils/user/userUtils";
import InfoIcon from "@mui/icons-material/Info";
import TaskCard from "../../components/Task/TaskCard/TaskCard";
import useTaskStore from "../../app/taskSlice";
import TaskOptionsHeader from "../../components/Task/TaskOptionsHeader/TaskOptionsHeader";
import useMakeTaskFailed from "../../features/tasks/useMakeTaskFailed";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const { setTasks, tasks, findExpiredTask } = useTaskStore();
  const navigate = useNavigate();
  const query = useSearchQuery();
  const pageNum = query.get("pageNum") || 1;
  const name = query.get("name");
  const { data, isSuccess, isPending, error, isError } = useGetTasks({
    name,
    pageNum,
  });

  const { failTask } = useMakeTaskFailed();

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
      query.set("pageNum", newPage.toString());
      navigate(`/home?${query.toString()}`);
    }
  };

  const handleClear = () => {
    query.delete("name");
    query.set("pageNum", "1");
    navigate(`/home?${query.toString()}`);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const founded = findExpiredTask();

      if (founded) {
        failTask(founded.id);
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, [findExpiredTask, failTask]);

  return (
    <Stack
      gap={4}
      flexGrow={1}
      pt={{ xs: 0, sm: 1.5, lg: 3 }}
      pb={{ xs: 6, sm: 0 }}
    >
      <Stack direction="row" gap={2} maxWidth="100%">
        <TaskSearchInput />
        <Tooltip title={t("homePage.addTaskBtn")}>
          <Button
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              my: 0.1,
            }}
            aria-label="AddNewTask"
            color="info"
            variant="contained"
            onClick={() => handleNavigate("/add-task")}
          >
            <AddIcon />
          </Button>
        </Tooltip>
      </Stack>
      <TaskOptionsHeader />
      <Stack gap={2} width="100%">
        {isPending ? (
          <Stack alignItems="center" p={6}>
            <CircularProgress />
          </Stack>
        ) : isError ? (
          <Alert severity="error">{formatErrorMessage(error)}</Alert>
        ) : isSuccess &&
          ((tasks?.data && tasks.data.length === 0) || !tasks) ? (
          <Alert icon={<InfoIcon />} color="secondary">
            {t("homePage.noDataAvailable")}
          </Alert>
        ) : (
          tasks?.data &&
          tasks.data.length > 0 &&
          tasks?.data?.map((m) => <TaskCard key={m.id} data={m} />)
        )}
      </Stack>
      {isSuccess && name && (
        <Button
          onClick={handleClear}
          color="error"
          aria-label="ClearSearchBtn"
          variant="contained"
          sx={{ width: "fit-content", margin: "auto 0 0 auto" }}
        >
          {t("homePage.clearBtn")}
        </Button>
      )}
      {tasks?.data && tasks.data.length > 0 && (
        <PaginationModified
          page={Number(pageNum)}
          total={tasks?.totalCount}
          handleNavigate={handlePageChange}
        />
      )}
    </Stack>
  );
};

export default HomePage;
