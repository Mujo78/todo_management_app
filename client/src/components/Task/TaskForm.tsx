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
  Tooltip,
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
import { useNavigate, useParams } from "react-router-dom";
import {
  formatErrorFieldMessage,
  isErrorForKey,
} from "../../utils/user/userUtils";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";

interface Props<TFieldValues extends FieldValues> {
  children: React.ReactNode;
  isPending: boolean;
  errors: FieldErrors<TFieldValues>;
  control: Control<TFieldValues>;
  isError: boolean;
  error: Error | AxiosError<unknown, unknown> | null;
  isDisabled?: boolean;
  isDateDisabled?: boolean;
  handleSubmit: UseFormHandleSubmit<TFieldValues>;
  onSubmit: (values: TFieldValues) => void;
  setShow?: React.Dispatch<React.SetStateAction<boolean>>;
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
  setShow,
  isDateDisabled,
}: Props<TFieldValues>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigateBack = () => {
    navigate(-1);
  };
  const { taskId } = useParams();

  const handleDelete = () => {
    if (taskId && setShow) {
      setShow(true);
    }
  };

  return (
    <Stack gap={4} mx="auto" pt={3} flexGrow={1}>
      <Box display="flex">
        <Tooltip title={t("taskForm.goBackBtn")}>
          <Button
            aria-label="BackButton"
            color="secondary"
            onClick={handleNavigateBack}
          >
            <ArrowBack />
          </Button>
        </Tooltip>
        <Typography variant="h5" fontWeight={400} mx="auto" textAlign="center">
          {title}
        </Typography>
      </Box>
      <Stack
        component="form"
        width="100%"
        mx="auto"
        gap={2.5}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Box
          display="flex"
          flexWrap={{ xs: "wrap", md: "nowrap" }}
          gap={2}
          alignItems="center"
        >
          <Controller
            control={control}
            name={"title" as Path<TFieldValues>}
            defaultValue={"" as PathValue<TFieldValues, Path<TFieldValues>>}
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                disabled={isPending || isDisabled}
                label={t("taskForm.title")}
                aria-label="Title"
                required
                sx={{
                  flexGrow: 1,
                }}
                autoComplete="true"
                error={
                  !!errors.title ||
                  isErrorForKey(error, t("taskFormService.title")) ||
                  isErrorForKey(error, "Title")
                }
                helperText={
                  errors.title?.message
                    ? t(errors.title.message as string)
                    : (isError &&
                        !errors.title &&
                        formatErrorFieldMessage(error, "Title")) ||
                      formatErrorFieldMessage(error, t("taskFormService.title"))
                }
              />
            )}
          />

          <Controller
            control={control}
            defaultValue={
              new Date() as PathValue<TFieldValues, Path<TFieldValues>>
            }
            aria-label="Due Date and Time"
            name={"dueDate" as Path<TFieldValues>}
            render={({ field }) => (
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                aria-label="Due Date and Time"
              >
                <DemoContainer
                  sx={{
                    flexGrow: { xs: 1, md: 0 },
                    width: "fit-content",
                    overflowX: "hidden",
                  }}
                  aria-label="Due Date and Time"
                  components={["DateTimePicker"]}
                >
                  <DateTimePicker
                    disabled={isPending || isDateDisabled}
                    disablePast
                    slotProps={{
                      textField: {
                        error:
                          !!errors.dueDate || isErrorForKey(error, "DueDate"),
                        helperText: errors.dueDate?.message
                          ? t(
                              errors.dueDate
                                .message as React.ReactNode as string
                            )
                          : isErrorForKey(error, "DueDate") &&
                            !errors.dueDate &&
                            (formatErrorFieldMessage(
                              error,
                              "DueDate"
                            ) as React.ReactNode),
                      },
                    }}
                    {...field}
                    label={t("taskForm.dueDateAndTime")}
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
              aria-label="Description"
              {...field}
              variant="outlined"
              disabled={isPending || isDisabled}
              label={t("taskForm.description")}
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
                errors.description?.message &&
                t(errors.description.message as React.ReactNode as string)
              }
            />
          )}
        />

        <Box display="flex" flexWrap={{ xs: "wrap", md: "nowrap" }} gap={2}>
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
                <InputLabel id="select-priority-label">
                  {t("taskForm.priority.label")}
                </InputLabel>
                <Select
                  labelId="select-priority-label"
                  aria-label="Priority"
                  disabled={isPending || isDisabled}
                  id="select-priority"
                  {...field}
                  label="Priority"
                >
                  <MenuItem value={0}>{t("taskForm.priority.low")}</MenuItem>
                  <MenuItem value={1}>{t("taskForm.priority.medium")}</MenuItem>
                  <MenuItem value={2}>{t("taskForm.priority.high")}</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.priority?.message
                    ? t(errors.priority.message as React.ReactNode as string)
                    : isErrorForKey(error, "Priority") &&
                      !errors.priority &&
                      (formatErrorFieldMessage(
                        error,
                        "Priority"
                      ) as React.ReactNode)}
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
                required
                error={!!errors.status || isErrorForKey(error, "Status")}
              >
                <InputLabel id="select-status-label">
                  {t("taskForm.status.label")}
                </InputLabel>
                <Select
                  labelId="select-status-label"
                  id="select-status"
                  aria-label="Status"
                  readOnly
                  disabled
                  {...field}
                  label="Status"
                >
                  <MenuItem value={0}>{t("taskForm.status.open")}</MenuItem>
                  <MenuItem value={1}>
                    {t("taskForm.status.completed")}
                  </MenuItem>
                  <MenuItem value={2}>{t("taskForm.status.failed")}</MenuItem>
                </Select>
                <FormHelperText>
                  {errors.status?.message
                    ? t(errors.status.message as React.ReactNode as string)
                    : isErrorForKey(error, "Status") &&
                      !errors.status &&
                      (formatErrorFieldMessage(
                        error,
                        "Status"
                      ) as React.ReactNode)}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>

        {children}

        <Stack
          flexDirection="row"
          flexWrap={{ xs: "wrap", sm: "nowrap" }}
          gap={{ xs: 2, sm: 0 }}
          justifyContent="space-between"
        >
          {taskId !== undefined && (
            <Button
              sx={{
                width: { xs: "100%", sm: "fit-content" },
              }}
              color="error"
              aria-label="DeleteTaskBtn"
              onClick={handleDelete}
              variant="text"
            >
              {t("taskForm.deleteTaskBtn")}
            </Button>
          )}

          {!isDateDisabled && (
            <Button
              type={isDateDisabled ? "button" : "submit"}
              variant="contained"
              sx={{
                width: { xs: "100%", sm: "fit-content" },
                margin: "0 0 0 auto",
              }}
            >
              {isPending ? (
                <CircularProgress size={30} sx={{ color: "white" }} />
              ) : (
                t("taskForm.saveBtn")
              )}
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TaskForm;
