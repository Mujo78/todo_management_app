import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
} from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../UI/LoadingButton";
import useDeleteTask from "../../../features/tasks/useDeleteTask";

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  taskId: string;
}

const DeleteTaskModal: React.FC<Props> = ({ setShow, show, title, taskId }) => {
  const navigate = useNavigate();

  const { deleteTask, isPending } = useDeleteTask();

  const handleClose = () => {
    setShow(false);
  };

  const handleDeleteProfile = () => {
    deleteTask(taskId, { onSuccess: () => navigate("/home") });
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ p: 0 }}
    >
      <DialogTitle sx={{ p: { xs: 1, sm: 3 } }} id="alert-dialog-title">
        Are you sure you want to delete your task: {title}?
      </DialogTitle>
      <DialogActions>
        <Stack
          flexGrow={1}
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={1}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            aria-label="CloseDeleteTaskModalBtn"
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
          >
            Close
          </Button>

          <LoadingButton
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
            onClick={handleDeleteProfile}
            label="ConfirmDeleteTaskModalBtn"
            isPending={isPending}
            error
          >
            Confirm
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskModal;
