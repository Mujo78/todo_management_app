import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import { FallbackProps } from "react-error-boundary";
import RefreshIcon from "@mui/icons-material/Refresh";

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <Stack
      width="100%"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack width="30%" textAlign="start" gap={1}>
        <Typography variant="h6">{error.name}</Typography>
        <Typography paragraph>{error.message}</Typography>
        <Typography paragraph>
          Something went wrong, please try refresh page with the button below!
        </Typography>
        <Button
          color="secondary"
          size="medium"
          onClick={resetErrorBoundary}
          sx={{ width: "fit-content", margin: "0 auto 0 auto" }}
        >
          <RefreshIcon sx={{ width: "48px", height: "48px" }} />
        </Button>
      </Stack>
    </Stack>
  );
};

export default ErrorFallback;
