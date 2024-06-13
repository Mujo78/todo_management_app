import { Check } from "@mui/icons-material";
import { Alert } from "@mui/material";
import React from "react";

interface Props {
  isSuccess: boolean;
  children: React.ReactNode;
}

const SuccessAlert: React.FC<Props> = ({ isSuccess, children }) => {
  return (
    <>
      {isSuccess && (
        <Alert icon={<Check fontSize="inherit" />} severity="success">
          {children}
        </Alert>
      )}
    </>
  );
};

export default SuccessAlert;
