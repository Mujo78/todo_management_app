import React, { useEffect } from "react";
import { Box, Stack, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../UI/ErrorFallback";
import useAuthStore from "../../app/authSlice";

const AppLayout: React.FC = () => {
  const matches = useMediaQuery("(max-width:600px)");
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

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
        <Toaster position={matches ? "top-center" : "top-right"} />
        <Box flexGrow={1}>
          <Outlet />
        </Box>
      </Stack>
    </ErrorBoundary>
  );
};

export default AppLayout;
