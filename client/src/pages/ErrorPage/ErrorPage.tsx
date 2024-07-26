import { Link } from "react-router-dom";
import { Button, Stack, Typography } from "@mui/material";

const ErrorPage = () => {
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
          <Typography variant="h4">Page not found</Typography>
          <Typography paragraph>
            Sorry, we couldn’t find the page you’re looking for.
          </Typography>
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
              Home
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
              Contact Us
            </Button>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ErrorPage;
