import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";

const Info: React.FC = () => {
  const matches = useMediaQuery("(max-width:600px)");
  return (
    <Stack
      gap={{ xs: 1.5, sm: 1.5, md: 3 }}
      py={{ xs: 2, sm: 0 }}
      px={{ xs: 3, sm: 2.5, md: 4 }}
    >
      <Typography
        variant={matches ? "h6" : "h5"}
        fontWeight="bold"
        textAlign="center"
      >
        Welcome to TaskMaster
      </Typography>
      <Typography paragraph textAlign="center">
        Boost your productivity with TaskMaster. Create, organize, and track
        your tasks effortlessly.
      </Typography>
      <Box>
        <Typography
          variant={matches ? "h6" : "h5"}
          fontWeight="600"
          textAlign="center"
        >
          Why TaskMaster?
        </Typography>
        <List component="ol">
          <ListItem disablePadding>
            <ListItemText>
              <strong>- Easy Task Management:</strong> Add, edit, and delete
              tasks with ease.
            </ListItemText>
          </ListItem>
          <ListItem disablePadding>
            <ListItemText>
              <strong>- Reminders:</strong> Never miss a deadline with automatic
              reminders.
            </ListItemText>
          </ListItem>
          <ListItem disablePadding>
            <ListItemText>
              <strong>- Prioritize:</strong> Focus on what matters most.
            </ListItemText>
          </ListItem>
        </List>
      </Box>
      <Typography paragraph textAlign="center">
        Join thousands of users taking control of their tasks today!
      </Typography>
    </Stack>
  );
};

export default Info;
