import React from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

const HomeLayout: React.FC = () => {
  return (
    <Box>
      <Outlet />
    </Box>
  );
};

export default HomeLayout;
