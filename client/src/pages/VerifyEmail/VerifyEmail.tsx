import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useCallback, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useVerifyEmail from "../../features/user/useVerifyEmail";
import { formatErrorMessage } from "../../utils/user/userUtils";
import SuccessAlert from "../../components/UI/SuccessAlert";
import LanguageSwitch from "../../components/UI/LanguageSwitch/LanguageSwitch";
import { useTranslation } from "react-i18next";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const { token } = useParams();
  const { verifyEmail, isPending, error, isError, isSuccess } =
    useVerifyEmail();

  const memoizedVerifyEmail = useCallback(
    (token: string) => {
      verifyEmail(token);
    },
    [verifyEmail]
  );

  useEffect(() => {
    if (token) {
      memoizedVerifyEmail(token);
    }
  }, [token, memoizedVerifyEmail]);

  return (
    <Stack width="100%" height="100vh" p={{ xs: 2, sm: 4 }}>
      <Stack maxWidth="100%" alignItems="center" gap={3}>
        <Typography
          variant="h4"
          component={Link}
          to="/"
          textAlign="center"
          sx={{ textDecoration: "none" }}
          mt={{ xs: 5, sm: 0 }}
          fontWeight="bold"
          color="primary"
        >
          TaskMaster
        </Typography>
        <Typography variant="h5" textAlign="center" fontWeight={600}>
          {t("verifyEmail.subtitle")}
        </Typography>
        <Typography
          paragraph
          textAlign="center"
          maxWidth={{ sm: "60%", md: "40%" }}
        >
          {t("verifyEmail.text")}
        </Typography>

        <Stack alignItems="center">
          {isPending ? (
            <CircularProgress />
          ) : isError ? (
            <Typography color="error" paragraph>
              {formatErrorMessage(error)}
            </Typography>
          ) : (
            isSuccess && (
              <SuccessAlert isSuccess={isSuccess}>
                {t("verifyEmail.successMessage")}
              </SuccessAlert>
            )
          )}
        </Stack>
      </Stack>
      <Typography
        mt="auto"
        textAlign="center"
        variant="body2"
        color="dark.light"
      >
        Copyright © 2024 TaskMaster
      </Typography>

      <Box position="absolute" top={{ xs: 7, sm: 10 }} left={0}>
        <LanguageSwitch label={false} />
      </Box>
    </Stack>
  );
};

export default VerifyEmail;
