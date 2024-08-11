import { Button, CircularProgress, SxProps, Theme } from "@mui/material";
import React from "react";

interface Props {
  isPending: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
  label?: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
  error?: boolean;
}

const LoadingButton: React.FC<Props> = ({
  isPending,
  onClick,
  error,
  fullWidth,
  children,
  label,
  sx,
}) => {
  return (
    <Button
      onClick={onClick}
      type="submit"
      aria-label={label}
      color={error ? "error" : "primary"}
      variant="contained"
      fullWidth={fullWidth}
      sx={
        sx ?? {
          width: !fullWidth ? "fit-content" : "100%",
          marginLeft: fullWidth ? 0 : "auto",
        }
      }
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
