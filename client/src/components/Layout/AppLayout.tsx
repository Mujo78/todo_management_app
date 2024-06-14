import React from "react";
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const AppLayout: React.FC = () => {
  return (
    <Stack
      sx={{
        maxWidth: "100%",
        height: "100vh",
      }}
      direction="row"
    >
      <Toaster position="top-right" />
      <Box sx={{ width: "100%" }}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default AppLayout;
