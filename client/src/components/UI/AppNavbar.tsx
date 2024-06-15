import React from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import useAuthStore from "../../app/authSlice";

const AppNavbar: React.FC = () => {
  const { auth } = useAuthStore();

  return (
    <AppBar position="static" color="primary">
      <Toolbar
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">TaskMaster</Typography>
        <Typography paragraph component="span" textAlign="center">
          {new Date().toDateString()}
        </Typography>
        <Button color="info" variant="outlined">
          {auth?.user.name}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
