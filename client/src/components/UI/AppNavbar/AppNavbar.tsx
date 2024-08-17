import React, { useState } from "react";
import {
  AppBar,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuList,
  Toolbar,
  Typography,
  Link as MUILink,
  useMediaQuery,
  Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { ExitToApp } from "@mui/icons-material";
import useLogout from "../../../features/auth/useLogout";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LanguageSwitch from "../LanguageSwitch/LanguageSwitch";

const AppNavbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const matches = useMediaQuery("(max-width:600px)");
  const { userLogout } = useLogout();

  const navigate = useNavigate();

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
    <AppBar position="sticky" color="primary">
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
        <Typography display={{ xs: "none", sm: "block" }} paragraph my="auto">
          {new Date().toDateString()}
        </Typography>
        <Box>
          <IconButton
            size="small"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            onClick={handleClick}
            color="inherit"
          >
            Me
            <ArrowDropDownIcon />
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
            {!matches && (
              <MenuList sx={{ pb: 0 }}>
                <MenuItem
                  aria-label="HomeLink"
                  onClick={() => handleNavigate("/home")}
                >
                  Home
                </MenuItem>
                <MenuItem
                  aria-label="ProfileLink"
                  onClick={() => handleNavigate("/profile")}
                >
                  Profile
                </MenuItem>
              </MenuList>
            )}
            <Box width="100%" display="flex" justifyContent="center">
              <LanguageSwitch label />
            </Box>
            <Divider />
            <MenuItem
              aria-label="LogoutBtnLink"
              onClick={handleLogout}
              sx={{ display: "flex", gap: "10px" }}
            >
              <ExitToApp />
              Log out
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppNavbar;
