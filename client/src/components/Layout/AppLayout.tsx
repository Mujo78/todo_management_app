import React, { useEffect } from "react";
import { Box, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../UI/ErrorFallback";
import useAuthStore from "../../app/authSlice";
import { requestForNotifications } from "../utils/notification";

const AppLayout: React.FC = () => {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    requestForNotifications();
  }, []);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace(window.location.pathname)}
    >
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
    </ErrorBoundary>
  );
};

export default AppLayout;
