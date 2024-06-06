import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <Stack
      sx={{
        maxWidth: "100%",
        height: "100vh",
      }}
      direction="row"
    >
      <Box sx={{ width: "100%" }}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default AppLayout;
