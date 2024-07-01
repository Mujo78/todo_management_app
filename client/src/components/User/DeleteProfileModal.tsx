import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
} from "@mui/material";
import React from "react";
import useDeleteProfile from "../../features/user/useDeleteProfile";
import { useNavigate } from "react-router-dom";

interface Props {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  total?: number;
}

const DeleteProfileModal: React.FC<Props> = ({ setShow, show, total }) => {
  const navigate = useNavigate();
  const { deleteProfile, isPending } = useDeleteProfile();

  const handleClose = () => {
    setShow(false);
  };

  const handleDeleteProfile = () => {
    deleteProfile(undefined, {
      onSuccess: () => {
        navigate("/");
        handleClose();
      },
    });
  };

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to delete your profile?
      </DialogTitle>
      <DialogContent>
        By deleting your profile, you will:
        <List>
          <ListItem>- lose your profile forever,</ListItem>
          <ListItem>- your tasks will be deleted ({total})</ListItem>
        </List>
      </DialogContent>
      <DialogActions sx={{ gap: "1rem" }}>
        <Button onClick={handleClose}>Close</Button>
        <Button
          color="error"
          variant="outlined"
          onClick={handleDeleteProfile}
          autoFocus
        >
          {isPending ? (
            <CircularProgress size={30} sx={{ color: "red" }} />
          ) : (
            "Confirm"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProfileModal;
