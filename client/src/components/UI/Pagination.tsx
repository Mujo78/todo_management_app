import React, { useState } from "react";
import { Pagination, Stack } from "@mui/material";

interface Props {
  page: number;
  total: number;
  handleNavigate: (page: number) => void;
}

const PaginationModified: React.FC<Props> = ({
  page,
  total,
  handleNavigate,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(page || 1);

  const handleChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    handleNavigate(value);
  };

  return (
    <Stack alignItems="center" mt="auto">
      <Pagination
        size="large"
        page={currentPage}
        count={total}
        onChange={handleChange}
        color="primary"
      />
    </Stack>
  );
};

export default PaginationModified;
