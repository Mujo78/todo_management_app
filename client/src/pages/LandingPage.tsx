import { Box, Stack, Tab, Tabs } from "@mui/material";
import { Login, HowToReg } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "../components/hooks/useQuery";
import LoginForm from "../components/Landing/LoginForm";
import SignupForm from "../components/Landing/SignupForm";
import Info from "../components/Landing/Info";

const LandingPage = () => {
  const navigate = useNavigate();
  const currentTab = useQuery().get("tab") || "login";

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(`?tab=${newValue}`);
  };

  return (
    <Stack
      direction="row"
      height="100%"
      maxWidth="100%"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        width="75%"
        height="75%"
        gap={3}
        justifyContent="center"
        maxHeight="lg"
      >
        <Box height="auto">
          <Tabs
            centered
            value={currentTab}
            onChange={handleChange}
            aria-label="icon tabs"
          >
            <Tab value="login" icon={<Login />} aria-label="login" />
            <Tab value="signup" icon={<HowToReg />} aria-label="signup" />
          </Tabs>
        </Box>
        <Box my="auto" mx="auto" width="50%" flexShrink="initial">
          {currentTab === "login" && <LoginForm />}
          {currentTab === "signup" && <SignupForm />}
        </Box>
      </Stack>
      <Stack
        width="25%"
        height="100%"
        alignItems="center"
        justifyContent="center"
        color="white"
        bgcolor="primary.dark"
      >
        <Info />
      </Stack>
    </Stack>
  );
};

export default LandingPage;
