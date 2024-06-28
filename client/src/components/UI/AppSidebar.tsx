import React from "react";
import { PersonOutline, Assignment, AddTask } from "@mui/icons-material";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import useAuthStore from "../../app/authSlice";
import { useLocation, useNavigate } from "react-router-dom";

const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation().pathname;
  const { auth } = useAuthStore();

  const profileNavigate = () => {
    navigate("/profile");
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Stack gap={2} width="25%">
      <Stack
        onClick={profileNavigate}
        alignItems="center"
        padding={2.5}
        sx={{
          border: 1,
          borderColor: "info.main",
          borderRadius: 5,
          boxShadow: 1,
          cursor: "pointer",
        }}
        gap={2}
      >
        <Avatar />
        <Typography paragraph my="auto">
          {auth?.user.name}
        </Typography>
      </Stack>
      <Stack
        padding={2.5}
        sx={{
          border: 1,
          borderColor: "info.main",
          borderRadius: 5,
          boxShadow: 1,
        }}
      >
        <List>
          <ListItem disablePadding onClick={() => handleNavigate("/home")}>
            <ListItemButton
              selected={location === "/home" || location.includes("task")}
            >
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText primary="Tasks" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding onClick={() => handleNavigate("/profile")}>
            <ListItemButton selected={location.startsWith("/profile")}>
              <ListItemIcon>
                <PersonOutline />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
      <Button
        variant="outlined"
        onClick={() => handleNavigate("/add-task")}
        startIcon={<AddTask />}
        sx={{ borderRadius: 5, py: 1.5 }}
      >
        Add a new task
      </Button>
    </Stack>
  );
};

export default AppSidebar;
