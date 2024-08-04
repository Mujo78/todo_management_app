import React, { Suspense } from "react";
import { Stack, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import AppNavbar from "../UI/AppNavbar/AppNavbar";
import AppSidebar from "../UI/AppSidebar/AppSidebar";
import TabNavigation from "../UI/TabNavigation/TabNavigation";
import { Toaster } from "react-hot-toast";
import SuspenseFallback from "../UI/SuspenseFallback";

const HomeLayout: React.FC = () => {
  const matches = useMediaQuery("(max-width:600px)");

  return (
    <Stack gap={2} height="100vh">
      <Toaster position={matches ? "top-center" : "top-right"} />
      <AppNavbar />
      <Stack
        p={{ xs: 1, sm: 0.5, lg: 1 }}
        flexGrow={1}
        flexDirection="row"
        justifyContent="center"
      >
        <Stack
          mx={{ lg: "auto" }}
          justifyContent="start"
          flexDirection="row"
          gap={5}
          px={{ sm: 2, md: 0 }}
          flexGrow={1}
          maxWidth={{ md: "80%", lg: "60%" }}
        >
          {!matches && <AppSidebar />}
          <Suspense fallback={<SuspenseFallback />}>
            <Outlet />
          </Suspense>
        </Stack>
      </Stack>
      {matches && <TabNavigation />}
    </Stack>
  );
};

export default HomeLayout;
