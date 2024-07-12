import { CircularProgress, Stack } from "@mui/material";
import React from "react";

const SuspenseFallback: React.FC = () => {
  return (
    <Stack
      width="100%"
      height="20vh"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress />
    </Stack>
  );
};

export default SuspenseFallback;
