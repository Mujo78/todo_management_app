import React from "react";
import { Stack, Typography } from "@mui/material";

const ForgotPasswordInfo: React.FC = () => {
  return (
    <Stack gap={1} px={4}>
      <Typography variant="h5" fontWeight={700} textAlign="center">
        TaskMaster
      </Typography>
      <Typography paragraph fontWeight={700} textAlign="center">
        Forgot Password Instructions
      </Typography>
      <Typography paragraph>
        Enter the email address associated with your account and we'll send you
        a link to reset your password.
      </Typography>
    </Stack>
  );
};

export default ForgotPasswordInfo;
