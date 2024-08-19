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
import { Trans, useTranslation } from "react-i18next";

const Info: React.FC = () => {
  const { t } = useTranslation();
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
        {t("landingPageInfo.title")}
      </Typography>
      <Typography paragraph textAlign="center">
        {t("landingPageInfo.text")}
      </Typography>
      <Box>
        <Typography
          variant={matches ? "h6" : "h5"}
          fontWeight="600"
          textAlign="center"
        >
          {t("landingPageInfo.subtitle")}
        </Typography>
        <List component="ol">
          <ListItem disablePadding>
            <ListItemText>
              <Trans i18nKey="landingPageInfo.subtitleListFirst">
                <strong>Easy Task Management</strong>
              </Trans>
            </ListItemText>
          </ListItem>
          <ListItem disablePadding>
            <ListItemText>
              <Trans i18nKey="landingPageInfo.subtitleListSecond">
                <strong>Easy Task Management</strong>
              </Trans>
            </ListItemText>
          </ListItem>
          <ListItem disablePadding>
            <ListItemText>
              <Trans i18nKey="landingPageInfo.subtitleListThird">
                <strong>Easy Task Management</strong>
              </Trans>
            </ListItemText>
          </ListItem>
        </List>
      </Box>
      <Typography paragraph textAlign="center">
        {t("landingPageInfo.finalWord")}
      </Typography>
    </Stack>
  );
};

export default Info;
