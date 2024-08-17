import React from "react";
import LanguageIcon from "@mui/icons-material/Language";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import useAuthStore from "../../../app/authSlice";

type Props = {
  label: boolean;
};

const LanguageSwitch: React.FC<Props> = ({ label }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { setLng, lng } = useAuthStore();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChooseLng = (newLng: string) => {
    setLng(newLng);
  };

  return (
    <Box>
      <Button
        aria-label="LanguageBtn"
        sx={{
          display: "flex",
          gap: 0.5,
          width: "fit-content",
        }}
        onClick={handleClick}
      >
        {label && (
          <Typography
            display={{ xs: "none", sm: "block" }}
            sx={{ textTransform: "capitalize" }}
            fontSize={16}
            component="span"
            fontWeight={500}
          >
            Language
          </Typography>
        )}
        <LanguageIcon
          sx={{
            height: { xs: 26, sm: label ? 14 : 26 },
            width: { xs: 26, sm: label ? 14 : 26 },
          }}
        />
      </Button>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        onClose={handleClose}
      >
        <MenuItem
          aria-label="EnglishLngItem"
          selected={lng === "eng"}
          onClick={() => handleChooseLng("eng")}
        >
          English
        </MenuItem>
        <MenuItem
          aria-label="BosnianLngItem"
          selected={lng === "bs"}
          onClick={() => handleChooseLng("bs")}
        >
          Bosnian
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default LanguageSwitch;
