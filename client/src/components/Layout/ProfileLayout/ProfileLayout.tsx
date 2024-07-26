import React, { Suspense } from "react";
import { Box, Stack, Typography, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import AppLink from "../../UI/AppLink";
import {
  DashboardCustomizeOutlined,
  EditOutlined,
  HttpsOutlined,
} from "@mui/icons-material";
import SuspenseFallback from "../../UI/SuspenseFallback";

const ProfileLayout: React.FC = () => {
  const location = useLocation().pathname;
  const matches = useMediaQuery("(max-width:600px)");

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
            ? "Overview"
            : location.includes("edit")
            ? "Edit Profile"
            : location.includes("password") && "Change Password"}
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
            {matches ? <DashboardCustomizeOutlined /> : "Overview"}
          </AppLink>

          <AppLink to="/profile/edit" underline>
            {matches ? <EditOutlined /> : "Edit"}
          </AppLink>

          <AppLink to="/profile/change-password" underline>
            {matches ? <HttpsOutlined /> : "Change password"}
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
