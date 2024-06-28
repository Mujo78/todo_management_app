import React from "react";
import { Box, Link, Stack, Typography } from "@mui/material";
import useAuthStore from "../../app/authSlice";
import { Outlet, Link as RouterLink } from "react-router-dom";

const ProfileLayout: React.FC = () => {
  const { auth } = useAuthStore();

  return (
    <Stack flexGrow={1}>
      <Box bgcolor="primary.main" width="auto" height={100} p={3}>
        <Typography color="white" variant="h5">
          {auth?.user.name}
        </Typography>
      </Box>

      <Box
        p={3}
        width="100%"
        flexDirection="row"
        display="flex"
        justifyContent="start"
        gap={3}
      >
        <Link to="" underline="none" component={RouterLink}>
          <Typography variant="button">Overview</Typography>
        </Link>
        <Link to="edit" underline="none" component={RouterLink}>
          <Typography variant="button">Edit</Typography>
        </Link>
        <Link to="change-password" underline="none" component={RouterLink}>
          <Typography variant="button">Change password</Typography>
        </Link>
      </Box>

      <Outlet />
    </Stack>
  );
};

export default ProfileLayout;
