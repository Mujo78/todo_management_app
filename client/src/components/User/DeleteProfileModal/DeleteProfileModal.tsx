import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Stack,
} from "@mui/material";
import React from "react";
import useDeleteProfile from "../../../features/user/useDeleteProfile";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../../UI/LoadingButton";

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
      <DialogActions>
        <Stack
          flexGrow={1}
          flexWrap="wrap"
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "row" }}
          gap={1}
        >
          <Button
            onClick={handleClose}
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
            variant="outlined"
            aria-label="closeDeleteProfileModalbtn"
          >
            Close
          </Button>

          <LoadingButton
            sx={{ flexGrow: { xs: 1, sm: 0 } }}
            onClick={handleDeleteProfile}
            isPending={isPending}
            error
            label="conrimDeleteProfilebtn"
          >
            Confirm
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProfileModal;
