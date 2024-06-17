import React, { useState } from "react";
import {
  AppBar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Link as MUILink,
} from "@mui/material";
import useAuthStore from "../../app/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { ExitToApp } from "@mui/icons-material";
import useLogout from "../../features/auth/useLogout";

const AppNavbar: React.FC = () => {
  const { auth } = useAuthStore();
  const { userLogout } = useLogout();

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    userLogout();
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <MUILink
          component={Link}
          to="/home"
          variant="h6"
          color="info.main"
          sx={{ textDecoration: "none" }}
        >
          TaskMaster
        </MUILink>
        <Typography paragraph my="auto">
          {new Date().toDateString()}
        </Typography>
        <div>
          <IconButton
            size="small"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            onClick={handleClick}
            color="inherit"
          >
            {auth?.user.name}
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleNavigate("/home")}>Home</MenuItem>
            <MenuItem onClick={() => handleNavigate("/profile")}>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{ display: "flex", gap: "10px" }}
            >
              <ExitToApp /> Log out
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
