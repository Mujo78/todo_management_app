import React from "react";
import { Divider, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  to: string;
  underline: boolean;
}

const AppLink: React.FC<Props> = ({ children, to, underline }) => {
  const location = useLocation().pathname;

  return (
    <Link
      to={to}
      underline="none"
      aria-label={`link-${to}`}
      component={RouterLink}
    >
      <Typography variant="button">{children}</Typography>
      {location === to && underline && (
        <Divider sx={{ backgroundColor: "primary.main" }} />
      )}
    </Link>
  );
};

export default AppLink;
