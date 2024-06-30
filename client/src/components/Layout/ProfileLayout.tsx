import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import AppLink from "../UI/AppLink";

const ProfileLayout: React.FC = () => {
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
          justifyContent="start"
          gap={4}
        >
          <AppLink to="/profile" underline>
            Overview
          </AppLink>

          <AppLink to="/profile/edit" underline>
            Edit
          </AppLink>

          <AppLink to="/profile/change-password" underline>
            Change password
          </AppLink>
        </Box>

        <Outlet />
      </Stack>
    </Stack>
  );
};

export default ProfileLayout;
