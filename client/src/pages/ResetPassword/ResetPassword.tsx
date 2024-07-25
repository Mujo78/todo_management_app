import { Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ResetPasswordForm from "../../components/Landing/ResetPasswordForm/ResetPasswordForm";

const ResetPassword = () => {
  return (
    <Stack gap={3} width="100%" height="100vh" p={{ xs: 2, sm: 6 }}>
      <Stack maxWidth="100%" alignItems="center" gap={2}>
        <Typography
          variant="h4"
          component={Link}
          to="/"
          sx={{ textDecoration: "none" }}
          textAlign="center"
          fontWeight="bold"
          color="primary"
        >
          TaskMaster
        </Typography>
        <Typography variant="h5" textAlign="center" fontWeight={600}>
          Reset Password
        </Typography>
        <Typography
          paragraph
          textAlign="start"
          maxWidth={{ sm: "60%", md: "40%" }}
        >
          - Create a new password that you don't use on any other site, <br />-
          Strong password contains letters, numbers and special characters
        </Typography>
      </Stack>
      <Stack
        maxWidth="100%"
        textAlign="center"
        justifyContent="center"
        flexDirection="row"
        height="100%"
      >
        <ResetPasswordForm />
      </Stack>
      <Typography textAlign="center" variant="body2" color="dark.light">
        Copyright © 2024 TaskMaster
      </Typography>
    </Stack>
  );
};

export default ResetPassword;
