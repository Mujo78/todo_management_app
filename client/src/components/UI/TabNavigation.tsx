import { Add, Person, Task } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<string>("");

  const handleChange = (
    _event: React.SyntheticEvent<Element, Event>,
    newValue: string
  ) => {
    setValue(newValue);
    navigate(newValue);
  };

  return (
    <Box width="100%" zIndex={999} position="fixed" bottom={0}>
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction value="/home" label="Tasks" icon={<Task />} />
        <BottomNavigationAction value="/add-task" label="Add" icon={<Add />} />
        <BottomNavigationAction
          value="/profile"
          label="Profile"
          icon={<Person />}
        />
      </BottomNavigation>
    </Box>
  );
};

export default TabNavigation;
