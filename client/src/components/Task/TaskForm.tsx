import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  PathValue,
  UseFormHandleSubmit,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { formatErrorFieldMessage, isErrorForKey } from "../utils/userUtils";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AxiosError } from "axios";

interface Props<TFieldValues extends FieldValues> {
  children: React.ReactNode;
  isPending: boolean;
  errors: FieldErrors<TFieldValues>;
  control: Control<TFieldValues>;
  isError: boolean;
  error: Error | AxiosError<unknown, unknown> | null;
  isDisabled?: boolean;
  handleSubmit: UseFormHandleSubmit<TFieldValues>;
  onSubmit: (values: TFieldValues) => void;
  title: string;
}

const TaskForm = <TFieldValues extends FieldValues>({
  children,
  isError,
  isPending,
  control,
  errors,
  error,
  handleSubmit,
  onSubmit,
  title,
  isDisabled,
}: Props<TFieldValues>) => {
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <Stack gap={4} mx="auto" pt={3} flexGrow={1}>
      <Box display="flex">
        <Button color="secondary" onClick={handleNavigateBack}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" fontWeight={400} mx="auto">
          {title}
        </Typography>
      </Box>
      <Stack
        component="form"
        width="100%"
        mx="auto"
        gap={4}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box display="flex" gap={2} alignItems="center">
          <Controller
            control={control}
            name={"title" as Path<TFieldValues>}
            defaultValue={"" as PathValue<TFieldValues, Path<TFieldValues>>}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                disabled={isPending || isDisabled}
                label="Title"
                sx={{
                  flexGrow: 1,
                }}
                autoComplete="true"
                required
                error={!!errors.title || isErrorForKey(error, "title")}
                helperText={
                  errors.title
                    ? errors.title.message
                    : isError && !errors.title
                    ? formatErrorFieldMessage(error, "title")
                    : ""
                }
              />
            )}
          />

          <Controller
            control={control}
            defaultValue={
              new Date() as PathValue<TFieldValues, Path<TFieldValues>>
            }
            name={"dueDate" as Path<TFieldValues>}
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    disabled={isPending || isDisabled}
                    slotProps={{
                      textField: {
                        error:
                          !!errors.dueDate || isErrorForKey(error, "DueDate"),
                        helperText: errors.dueDate
                          ? (errors.dueDate.message as React.ReactNode)
                          : isError && !errors.dueDate
                          ? (formatErrorFieldMessage(
                              error,
                              "DueDate"
                            ) as React.ReactNode)
                          : "",
                      },
                    }}
                    {...field}
                    label="Due Date and Time"
                  />
                </DemoContainer>
              </LocalizationProvider>
            )}
          />
        </Box>

        <Controller
          control={control}
          name={"description" as Path<TFieldValues>}
          defaultValue={"" as PathValue<TFieldValues, Path<TFieldValues>>}
          render={({ field }) => (
            <TextField
              id="description-textarea"
              {...field}
              variant="outlined"
              disabled={isPending || isDisabled}
              label="Description"
              autoComplete="true"
              minRows={4}
              maxRows={6}
              multiline
              fullWidth
              error={!!errors.description}
              FormHelperTextProps={{
                component: "span",
              }}
              helperText={
                errors.description &&
                (errors.description.message as React.ReactNode)
              }
            />
          )}
        />

        <Box display="flex" gap={2}>
          <Controller
            control={control}
            name={"priority" as Path<TFieldValues>}
            defaultValue={0 as PathValue<TFieldValues, Path<TFieldValues>>}
            render={({ field }) => (
              <FormControl
                variant="outlined"
                error={!!errors.priority || isErrorForKey(error, "Priority")}
                fullWidth
                required
              >
                <InputLabel id="select-priority-label">Priority</InputLabel>
                <Select
                  labelId="select-priority-label"
                  aria-label="Priority"
                  disabled={isPending || isDisabled}
                  id="select-priority"
                  {...field}
                  label="Priority"
                >
                  <MenuItem value={0}>Low</MenuItem>
                  <MenuItem value={1}>Medium</MenuItem>
                  <MenuItem value={2}>High</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.priority
                    ? (errors.priority.message as React.ReactNode)
                    : isError && !errors.priority
                    ? (formatErrorFieldMessage(
                        error,
                        "Priority"
                      ) as React.ReactNode)
                    : ""}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name={"status" as Path<TFieldValues>}
            defaultValue={0 as PathValue<TFieldValues, Path<TFieldValues>>}
            render={({ field }) => (
              <FormControl
                variant="outlined"
                fullWidth
                error={!!errors.status || isErrorForKey(error, "Status")}
              >
                <InputLabel id="select-status-label">Status</InputLabel>
                <Select
                  labelId="select-status-label"
                  id="select-status"
                  readOnly
                  disabled
                  {...field}
                  label="Status"
                >
                  <MenuItem value={0}>Open</MenuItem>
                  <MenuItem value={1}>Completed</MenuItem>
                  <MenuItem value={2}>Failed</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.status
                    ? (errors.status.message as React.ReactNode)
                    : isError && !errors.status
                    ? (formatErrorFieldMessage(
                        error,
                        "Status"
                      ) as React.ReactNode)
                    : ""}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>

        {children}

        <Button
          type={!isDisabled ? "submit" : "button"}
          variant="contained"
          sx={{ width: "fit-content", margin: "0 0 0 auto" }}
        >
          {isPending ? (
            <CircularProgress size={30} sx={{ color: "white" }} />
          ) : (
            "Save"
          )}
        </Button>
      </Stack>
    </Stack>
  );
};

export default TaskForm;
