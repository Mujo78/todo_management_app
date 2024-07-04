import React from "react";
import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppNavbar from "../UI/AppNavbar";
import AppSidebar from "../UI/AppSidebar";

const HomeLayout: React.FC = () => {
  return (
    <Stack gap={2} height="100vh">
      <AppNavbar />
      <Stack p={3} flexGrow={1}>
        <Stack
          mx="auto"
          justifyContent="start"
          flexDirection="row"
          gap={5}
          flexGrow={1}
          width="60%"
        >
          <AppSidebar />
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default HomeLayout;
