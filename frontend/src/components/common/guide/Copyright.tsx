import { Typography, Link, Box } from "@material-ui/core";
import React from "react";

const Copyright: React.FC<{
  className?: string;
  textAlgin?: "left" | "center" | "right";
}> = ({ className, textAlgin }) => {
  return (
    <Box className={className || ""}>
      <Typography
        variant="body2"
        color="textSecondary"
        align={textAlgin || "center"}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://material-ui.com/">
          Quiiz
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
};

export default Copyright;
