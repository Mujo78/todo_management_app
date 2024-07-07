import React from "react";
import { Stack, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppNavbar from "../UI/AppNavbar";
import AppSidebar from "../UI/AppSidebar";
import TabNavigation from "../UI/TabNavigation";

const HomeLayout: React.FC = () => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <Stack gap={2} height="100vh">
      <AppNavbar />
      <Stack p={{ xs: 1, sm: 3 }} flexGrow={1}>
        <Stack
          mx={{ sm: "auto" }}
          justifyContent="start"
          flexDirection="row"
          gap={5}
          flexGrow={1}
          width={{ sm: "60%" }}
        >
          {!matches && <AppSidebar />}
          <Outlet />
        </Stack>
      </Stack>
      {matches && <TabNavigation />}
    </Stack>
  );
};

export default HomeLayout;
