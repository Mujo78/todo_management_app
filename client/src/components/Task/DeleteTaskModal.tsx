import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../UI/LoadingButton";
import useDeleteTask from "../../features/tasks/useDeleteTask";

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
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to delete your task: {title}?
      </DialogTitle>
      <DialogActions sx={{ gap: "1rem" }}>
        <Button onClick={handleClose} variant="outlined">
          Close
        </Button>

        <LoadingButton
          onClick={handleDeleteProfile}
          isPending={isPending}
          error
        >
          Confirm
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteTaskModal;
