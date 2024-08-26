import { Box, Stack } from "@mui/material";
import ForgotPasswordInfo from "../../components/Landing/ForgotPasswordInfo/ForgotPasswordInfo";
import ForgotPasswordForm from "../../components/Landing/ForgotPasswordForm/ForgotPasswordForm";
import LanguageSwitch from "../../components/UI/LanguageSwitch/LanguageSwitch";

const ForgotPassword = () => {
  return (
    <Stack
      direction="row"
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        maxWidth={{ sm: "35%", md: "25%" }}
        height="100%"
        alignItems="center"
        justifyContent="center"
        display={{ xs: "none", sm: "flex" }}
        color="white"
        bgcolor="primary.main"
      >
        <ForgotPasswordInfo />
      </Stack>
      <Stack
        maxWidth={{ xs: "90%", sm: "65%", md: "75%" }}
        maxHeight={{ xs: "100%", sm: "65%", md: "75%" }}
        gap={3}
        flexGrow={1}
        flexDirection="row"
        justifyContent="center"
      >
        <Box mx="auto" my="auto" width={{ xs: "100%", sm: "90%" }}>
          <ForgotPasswordForm />
        </Box>
      </Stack>
      <Box position="absolute" top={{ xs: 7, sm: 10 }} right={0}>
        <LanguageSwitch label={false} />
      </Box>
    </Stack>
  );
};

export default ForgotPassword;
