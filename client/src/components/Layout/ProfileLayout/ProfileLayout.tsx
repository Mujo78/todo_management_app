import React, { Suspense } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import AppLink from "../../UI/AppLink";
import {
  DashboardCustomizeOutlined,
  EditOutlined,
  HttpsOutlined,
} from "@mui/icons-material";
import SuspenseFallback from "../../UI/SuspenseFallback";
import { useTranslation } from "react-i18next";

const ProfileLayout: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation().pathname;

  return (
    <Stack flexGrow={1}>
      <Box
        bgcolor="primary.main"
        width="auto"
        borderRadius={4}
        height={100}
        p={3}
      >
        <Typography color="white" variant="h5">
          {location === "/profile"
            ? t("profileOverview.title")
            : location.includes("edit")
            ? t("editProfile.title")
            : location.includes("password") && t("changePassword.title")}
        </Typography>
      </Box>

      <Stack gap={2}>
        <Box
          p={3}
          width="100%"
          flexDirection="row"
          display="flex"
          justifyContent={{ xs: "center", sm: "start" }}
          gap={4}
        >
          <AppLink to="/profile" underline>
            <DashboardCustomizeOutlined
              sx={{
                display: {
                  xs: "block",
                  sm: "none",
                },
              }}
            />
            <Typography
              component="span"
              sx={{
                font: "inherit",
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              {t("profileLinks.overview")}
            </Typography>
          </AppLink>

          <AppLink to="/profile/edit" underline>
            <EditOutlined
              sx={{
                display: {
                  xs: "block",
                  sm: "none",
                },
              }}
            />
            <Typography
              component="span"
              sx={{
                font: "inherit",
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              {t("profileLinks.edit")}
            </Typography>
          </AppLink>

          <AppLink to="/profile/change-password" underline>
            <HttpsOutlined
              sx={{
                display: {
                  xs: "block",
                  sm: "none",
                },
              }}
            />
            <Typography
              component="span"
              sx={{
                font: "inherit",
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              {t("profileLinks.changePassword")}
            </Typography>
          </AppLink>
        </Box>

        <Suspense fallback={<SuspenseFallback />}>
          <Outlet />
        </Suspense>
      </Stack>
    </Stack>
  );
};

export default ProfileLayout;
