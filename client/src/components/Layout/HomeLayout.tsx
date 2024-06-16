import React from "react";
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppNavbar from "../UI/AppNavbar";

const HomeLayout: React.FC = () => {
  return (
    <Stack gap={2}>
      <AppNavbar />
      <Box p={3}>
        <Outlet />
      </Box>
    </Stack>
  );
};

export default HomeLayout;
