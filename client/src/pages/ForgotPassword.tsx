import { Box, Stack } from "@mui/material";
import ForgotPasswordForm from "../components/Landing/ForgotPasswordForm";
import ForgotPasswordInfo from "../components/Landing/ForgotPasswordInfo";

const ForgotPassword = () => {
  return (
    <Stack
      direction="row"
      height="100%"
      maxWidth="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        width="25%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        color="white"
        bgcolor="primary.main"
      >
        <ForgotPasswordInfo />
      </Stack>
      <Stack
        width="75%"
        height="75%"
        gap={3}
        justifyContent="center"
        maxHeight="lg"
      >
        <Box mx="auto" my="auto" height="auto" width="50%">
          <ForgotPasswordForm />
        </Box>
      </Stack>
    </Stack>
  );
};

export default ForgotPassword;
