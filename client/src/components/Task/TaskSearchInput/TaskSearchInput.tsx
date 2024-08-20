import { Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSearchQuery } from "../../../hooks/useSearchQuery";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const TaskSearchInput: React.FC = () => {
  const { t } = useTranslation();
  const [taskName, setTaskName] = useState<string>("");
  const navigate = useNavigate();
  const query = useSearchQuery();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (taskName !== "") {
      query.set("pageNum", "1");
      query.set("name", taskName);

      navigate(`/home?${query.toString()}`);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setTaskName(event.currentTarget.value);
  };

  return (
    <Stack
      component="form"
      width={{ xs: "100%" }}
      mx="auto"
      gap={2}
      onSubmit={handleSubmit}
    >
      <TextField
        name="taskName"
        type="text"
        value={taskName}
        onChange={handleChange}
        variant="outlined"
        label={t("searchHeader")}
        aria-label="Search"
        autoComplete="true"
        fullWidth
      />
    </Stack>
  );
};

export default TaskSearchInput;
