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
import { Controller, useForm } from "react-hook-form";
import { addTaskValidationSchema } from "../../validations/addNewTaskValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreateTaskType } from "../../app/taskSlice";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import useCreateTask from "../../features/tasks/useCreateNewTask";
import SuccessAlert from "../../components/UI/SuccessAlert";
import { formatErrorFieldMessage } from "../../components/utils/userUtils";

import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AddNewTask = () => {
  const navigate = useNavigate();
  const { control, formState, handleSubmit, reset } = useForm<CreateTaskType>({
    resolver: yupResolver(addTaskValidationSchema),
  });
  const { errors } = formState;

  const { createTask, error, isError, isPending, isSuccess } = useCreateTask();

  const onSubmit = (values: CreateTaskType) => {
    createTask(values, { onSuccess: () => reset() });
  };

  const handleNavigateBack = () => {
    navigate(-1);
  };

  return (
    <Stack gap={4}>
      <Box display="flex">
        <Button color="secondary" onClick={handleNavigateBack}>
          <ArrowBack />
        </Button>
        <Typography variant="h5" fontWeight={400} mx="auto">
          Add a new Task
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
            name="title"
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                variant="outlined"
                disabled={isPending}
                label="Title"
                sx={{
                  flexGrow: 1,
                }}
                autoComplete="true"
                required
                error={!!errors.title || isError}
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
            defaultValue={new Date()}
            name="dueDate"
            render={({ field }) => (
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker
                    disabled={isPending}
                    slotProps={{
                      textField: {
                        error: !!errors.dueDate,
                        helperText: errors.dueDate
                          ? errors.dueDate.message
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
          name="description"
          defaultValue=""
          render={({ field }) => (
            <TextField
              id="description-textarea"
              {...field}
              variant="outlined"
              disabled={isPending}
              label="Description"
              autoComplete="true"
              minRows={4}
              maxRows={6}
              multiline
              fullWidth
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ""}
            />
          )}
        />

        <Box display="flex" gap={2}>
          <Controller
            control={control}
            name="priority"
            defaultValue={0}
            render={({ field }) => (
              <FormControl variant="outlined" fullWidth required>
                <InputLabel id="select-priority-label">Priority</InputLabel>
                <Select
                  labelId="select-priority-label"
                  aria-label="Priority"
                  disabled={isPending}
                  id="select-priority"
                  {...field}
                  label="Priority"
                >
                  <MenuItem value={0}>Low</MenuItem>
                  <MenuItem value={1}>Medium</MenuItem>
                  <MenuItem value={2}>High</MenuItem>
                </Select>
                <FormHelperText
                  error={isError || errors.priority !== undefined}
                >
                  {errors.priority ? errors.priority.message : ""}
                </FormHelperText>
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="status"
            defaultValue={0}
            render={({ field }) => (
              <FormControl variant="outlined" fullWidth error={!!errors.status}>
                <InputLabel id="select-status-label">Status</InputLabel>
                <Select
                  labelId="select-priority-label"
                  id="simple-select-priority"
                  readOnly
                  disabled
                  {...field}
                  label="Status"
                >
                  <MenuItem value={0}>Open</MenuItem>
                  <MenuItem value={1}>Completed</MenuItem>
                  <MenuItem value={2}>Failed</MenuItem>
                </Select>
                <FormHelperText error={!!errors.status}>
                  {errors.status ? errors.status.message : ""}
                </FormHelperText>
              </FormControl>
            )}
          />
        </Box>

        <SuccessAlert isSuccess={isSuccess}>
          Successfully created a new task.
        </SuccessAlert>

        <Button
          type="submit"
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

export default AddNewTask;
