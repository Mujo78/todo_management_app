import {
  Button,
  FormHelperText,
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

const AddNewTask = () => {
  const { control, formState, handleSubmit, reset } = useForm<CreateTaskType>({
    resolver: yupResolver(addTaskValidationSchema),
  });
  const { errors } = formState;

  const onSubmit = () => {};

  return (
    <Stack>
      <Typography variant="h6" fontWeight={400}>
        Add a new Task
      </Typography>
      <Stack
        component="form"
        width="100%"
        mx="auto"
        gap={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Stack direction="row">
          <Controller
            control={control}
            name="title"
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                variant="standard"
                label="Title"
                autoComplete="true"
                required
                fullWidth
                error={!!errors.title}
                helperText={errors.title ? errors.title.message : ""}
              />
            )}
          />
        </Stack>

        <Controller
          control={control}
          name="description"
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              label="Description"
              autoComplete="true"
              required
              minRows={4}
              maxRows={6}
              multiline
              fullWidth
              error={!!errors.description}
              helperText={errors.description ? errors.description.message : ""}
            />
          )}
        />

        <Stack direction="row">
          <Controller
            control={control}
            name="priority"
            defaultValue={0}
            render={({ field }) => (
              <>
                <Select
                  variant="standard"
                  autoComplete="true"
                  required
                  fullWidth
                  error={!!errors.description}
                  {...field}
                  label="Priority"
                >
                  <MenuItem value={0}>Low</MenuItem>
                  <MenuItem value={1}>Medium</MenuItem>
                  <MenuItem value={2}>High</MenuItem>
                </Select>
                <FormHelperText error={!!errors.description}>
                  {errors.description ? errors.description.message : ""}
                </FormHelperText>
              </>
            )}
          />

          <Controller
            control={control}
            name="status"
            defaultValue={0}
            render={({ field }) => (
              <>
                <Select
                  readOnly
                  variant="standard"
                  autoComplete="true"
                  required
                  fullWidth
                  error={!!errors.status}
                  {...field}
                  label="Status"
                >
                  <MenuItem value={0}>Open</MenuItem>
                  <MenuItem value={1}>InProgress</MenuItem>
                  <MenuItem value={2}>Completed</MenuItem>
                </Select>
                <FormHelperText error={!!errors.status}>
                  {errors.status ? errors.status.message : ""}
                </FormHelperText>
              </>
            )}
          />
        </Stack>

        <Button
          color="primary"
          variant="contained"
          sx={{ width: "fit-content", margin: "0 0 0 auto" }}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};

export default AddNewTask;
