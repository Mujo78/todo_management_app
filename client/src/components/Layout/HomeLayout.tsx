import React from "react";
import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppNavbar from "../UI/AppNavbar";

const HomeLayout: React.FC = () => {
  return (
    <Stack gap={2} height="100vh">
      <AppNavbar />
      <Stack p={3} flexGrow={1}>
        <Stack mx="auto" flexGrow={1} width="50%">
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HomeLayout;
