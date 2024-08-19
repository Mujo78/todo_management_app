import React from "react";
import { Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

const ForgotPasswordInfo: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Stack gap={1} px={4}>
      <Typography variant="h5" fontWeight={700} textAlign="center">
        TaskMaster
      </Typography>
      <Typography paragraph fontWeight={700} textAlign="center">
        {t("forgotPasswordInfo.infoSubtitle")}
      </Typography>
      <Typography paragraph>{t("forgotPasswordInfo.instructions")}</Typography>
    </Stack>
  );
};

export default ForgotPasswordInfo;
