import { Button } from "@mui/material";
import React from "react";

const NeoButton = ({ text, type, onClick }) => {
  return (
    <Button
      type="submit"
      onClick={onClick ? onClick : () => {}}
      sx={{ width: "187px", height: "58px", borderRadius: "65px" }}
      color={
        type === "delete"
          ? "error"
          : type === "edit"
          ? "warning"
          : type === "none"
          ? "inherit"
          : type === "info"
          ? "primary"
          : type === "success" && "success"
      }
      variant="contained">
      {text}
    </Button>
  );
};

export default NeoButton;
