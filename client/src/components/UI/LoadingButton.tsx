import { Button, CircularProgress } from "@mui/material";
import React from "react";

interface Props {
  isPending: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  onClick?: () => void;
  error?: boolean;
}

const LoadingButton: React.FC<Props> = ({
  isPending,
  onClick,
  error,
  fullWidth,
  children,
}) => {
  return (
    <Button
      onClick={onClick}
      type="submit"
      color={error ? "error" : "primary"}
      variant="contained"
      fullWidth={fullWidth}
      sx={{
        width: !fullWidth ? "fit-content" : "100%",
        marginLeft: fullWidth ? 0 : "auto",
      }}
    >
      {isPending ? (
        <CircularProgress size={30} sx={{ color: "white" }} />
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
