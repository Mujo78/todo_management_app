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
import useAuthStore from "../../../app/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
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
    <Stack gap={2} maxWidth={{ sm: "25%" }}>
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
        maxWidth="100%"
        gap={2}
      >
        <Avatar />
        <Typography
          paragraph
          maxWidth="100%"
          textAlign="center"
          my="auto"
          sx={{ overflowWrap: "break-word" }}
        >
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
          <ListItem
            aria-label="Tasks"
            disablePadding
            onClick={() => handleNavigate("/home")}
          >
            <ListItemButton
              sx={{ gap: 2 }}
              selected={location === "/home" || location.includes("task")}
            >
              <ListItemIcon
                sx={{ minWidth: "fit-content", mx: { sm: "auto", md: 0 } }}
              >
                <Assignment />
              </ListItemIcon>

              <ListItemText
                sx={{
                  display: {
                    xs: "none",
                    md: "block",
                  },
                }}
                aria-label="tasks-text"
                primary={t("appSidebar.tasks")}
              />
            </ListItemButton>
          </ListItem>
          <ListItem
            aria-label="Profile"
            disablePadding
            onClick={() => handleNavigate("/profile")}
          >
            <ListItemButton
              sx={{ gap: 2 }}
              selected={location.startsWith("/profile")}
            >
              <ListItemIcon
                sx={{ minWidth: "fit-content", mx: { sm: "auto", md: 0 } }}
              >
                <PersonOutline />
              </ListItemIcon>

              <ListItemText
                sx={{
                  display: {
                    xs: "none",
                    md: "block",
                  },
                }}
                aria-label="profile-text"
                primary={t("appSidebar.profile")}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Stack>
      <Button
        aria-label="addNewTaskBtn"
        variant="outlined"
        onClick={() => handleNavigate("/add-task")}
        startIcon={<AddTask />}
        sx={{ borderRadius: 5, py: 1.5 }}
      >
        <Typography
          component="span"
          sx={{
            font: "inherit",
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          {t("appSidebar.addANewTask")}
        </Typography>
      </Button>
    </Stack>
  );
};

export default AppSidebar;
