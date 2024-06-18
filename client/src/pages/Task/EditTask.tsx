import { Stack } from "@mui/material";
import { useParams } from "react-router-dom";

const EditTask = () => {
  const { id } = useParams();

  return <Stack>Edit task: {id}</Stack>;
};

export default EditTask;
