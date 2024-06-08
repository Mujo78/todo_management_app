import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      light: "#1F62FF",
      main: "#0A54FF",
      dark: "#0049f5",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#161316",
      main: "#080708",
      dark: "#000000",
      contrastText: "#ffffff",
    },
    error: {
      light: "#DF2A36",
      main: "#D5202C",
      dark: "#C31D28",
      contrastText: "#ffffff",
    },
    warning: {
      light: "#FDD35D",
      main: "#FDCA40",
      dark: "#FDC835",
      contrastText: "#000000",
    },
    info: {
      light: "#F4F5F4",
      main: "#E6E8E6",
      dark: "#DFE2DF",
      contrastText: "#000000",
    },
  },
});
