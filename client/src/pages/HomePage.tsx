import { Box, Typography } from "@mui/material";
import useGetTasks from "../features/tasks/useGetTasks";

const HomePage = () => {
  const { data } = useGetTasks();

  return (
    <Box bgcolor="success.primary">
      {data?.map((m) => (
        <Typography key={m.id}>{m.title}</Typography>
      ))}
    </Box>
  );
};

export default HomePage;
