import { useMemo, useState } from "react";
import { Box, Stack, Tab, Tabs, Tooltip } from "@mui/material";
import { Login, HowToReg } from "@mui/icons-material";
import { Link, Outlet, useLocation } from "react-router-dom";
import Info from "../../components/Landing/Info";
import LanguageSwitch from "../../components/UI/LanguageSwitch/LanguageSwitch";
import { useTranslation } from "react-i18next";

const LandingPage = () => {
  const { t } = useTranslation();
  const location = useLocation().pathname === "/signup";
  const initialValue = useMemo(() => (location ? 1 : 0), [location]);
  const [value, setValue] = useState<number>(initialValue);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      gap={{ xs: 0, sm: 0 }}
      height="100%"
      width="100%"
      justifyContent={{ xs: "center", sm: "space-between" }}
      alignItems={{ sm: "center" }}
      flexGrow={1}
    >
      <Stack
        maxWidth={{
          xs: "100%",
          sm: "75%",
        }}
        height={{
          xs: "100%",
          sm: "75%",
        }}
        gap={{ xs: 1, sm: 3 }}
        pt={{ xs: 4, sm: 0 }}
        flexGrow={1}
      >
        <Box position="absolute" top={{ xs: 7, sm: 15 }}>
          <LanguageSwitch label={false} />
        </Box>
        <Box maxWidth="100%">
          <Tabs
            centered
            value={value}
            onChange={handleChange}
            aria-label="icon tabs"
            role="navigation"
          >
            <Tooltip title={t("landingPage.loginTab")}>
              <Tab component={Link} to="" icon={<Login />} aria-label="login" />
            </Tooltip>
            <Tooltip title={t("landingPage.signupTab")}>
              <Tab
                component={Link}
                to="signup"
                icon={<HowToReg />}
                aria-label="signup"
              />
            </Tooltip>
          </Tabs>
        </Box>
        <Box
          mx="auto"
          width={{ xs: "90%", sm: "65%", md: "70%" }}
          height="100%"
          flexGrow={1}
          display="flex"
        >
          <Outlet />
        </Box>
      </Stack>
      <Stack
        display={{
          xs: "none",
          sm: "flex",
        }}
        maxWidth={{ xs: "100%", sm: "35%", md: "30%" }}
        height="100%"
        alignItems="center"
        justifyContent="center"
        color="white"
        bgcolor="primary.main"
      >
        <Info />
      </Stack>
    </Stack>
  );
};

export default LandingPage;
