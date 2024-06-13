import { Stack, Typography } from "@mui/material";
import ResetPasswordForm from "../components/Landing/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <Stack gap={3} width="100%" height="100vh" p={6}>
      <Stack width="100%" alignItems="center" gap={2}>
        <Typography variant="h5" textAlign="center" fontWeight={600}>
          Reset Password
        </Typography>
        <Typography paragraph textAlign="center" width="40%">
          Create a new password that you don't use on any other site. Strong
          password contains letters, numbers and special characters.
        </Typography>
      </Stack>
      <Stack
        gap={3}
        width="100%"
        textAlign="center"
        justifyContent="center"
        direction="row"
        height="100%"
      >
        <ResetPasswordForm />
      </Stack>
    </Stack>
  );
};

export default ResetPassword;
