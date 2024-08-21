import { Link } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../../components/UI/LanguageSwitch/LanguageSwitch";

const ErrorPage = () => {
  const { t } = useTranslation();
  const mailsupport = `mailto:${import.meta.env.VITE_EMAIL_SUPPORT}`;

  return (
    <Stack width="100%" height="100vh">
      <Stack
        width="100%"
        height="100%"
        gap={4}
        px={{ xs: 2, sm: 0 }}
        justifyContent="center"
        alignItems="center"
      >
        <Stack gap={1}>
          <Typography variant="h2" fontWeight="bold">
            404
          </Typography>
          <Typography variant="h4">{t("errorPage.title")}</Typography>
          <Typography paragraph>{t("errorPage.text")}</Typography>
        </Stack>
        <Stack
          flexDirection="row"
          justifyContent="center"
          flexWrap="wrap"
          gap={4}
        >
          <Typography component="span" maxWidth="100%">
            <Button
              size="large"
              to="/"
              variant="contained"
              color="secondary"
              component={Link}
            >
              {t("errorPage.home")}
            </Button>
          </Typography>
          <Typography component="span" maxWidth="100%">
            <Button
              size="large"
              variant="text"
              color="secondary"
              component={Link}
              to={mailsupport}
            >
              {t("errorPage.contactUs")}
            </Button>
          </Typography>
        </Stack>
      </Stack>
      <Box position="absolute" top={10}>
        <LanguageSwitch label={false} />
      </Box>
    </Stack>
  );
};

export default ErrorPage;
