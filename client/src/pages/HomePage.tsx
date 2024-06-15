import { ExitToApp } from "@mui/icons-material";
import { Box, Button, CircularProgress } from "@mui/material";
import useLogout from "../features/auth/useLogout";
import AppNavbar from "../components/UI/AppNavbar";

const HomePage = () => {
  const { userLogout, isPending } = useLogout();

  const handleLogout = () => {
    userLogout();
  };

  return (
    <Box bgcolor="success.primary">
      <AppNavbar />
      <Button
        onClick={handleLogout}
        startIcon={<ExitToApp />}
        color="secondary"
      >
        {isPending ? (
          <CircularProgress size={30} sx={{ color: "white" }} />
        ) : (
          "Log out"
        )}
      </Button>
    </Box>
  );
};

export default HomePage;
