import { Alert, CircularProgress, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useVerifyEmail from "../features/user/useVerifyEmail";
import { formatErrorMessage } from "../components/utils/userUtils";
import { Check } from "@mui/icons-material";

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail, isPending, error, isError, isSuccess } =
    useVerifyEmail();

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token, verifyEmail]);

  return (
    <Stack
      width="100%"
      height="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Stack width="40%" gap={3}>
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={700}
          color="primary.main"
        >
          TaskMaster
        </Typography>
        <Typography variant="h4" textAlign="center" fontWeight={400}>
          Verify your email address
        </Typography>
        <Typography paragraph>
          By verifying your email, you will confirm that you want to use this as
          your TaskMaster account email address. Once it's done you will be able
          to start with creating and achieving your daily goals.
        </Typography>

        <Stack alignItems="center">
          {isPending ? (
            <CircularProgress />
          ) : isError ? (
            <Typography color="red">{formatErrorMessage(error)}</Typography>
          ) : isSuccess ? (
            <Alert icon={<Check fontSize="inherit" />} severity="success">
              Successfully verified email address.
            </Alert>
          ) : (
            ""
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VerifyEmail;
