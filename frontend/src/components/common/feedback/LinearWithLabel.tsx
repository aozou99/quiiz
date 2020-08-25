import {
  makeStyles,
  Theme,
  createStyles,
  LinearProgress,
  Box,
  Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "70%",
      height: theme.spacing(1.5),
      textAlign: "center",
    },
  })
);

export const LinearWithLabel: React.FC<{ progress: number; label: string }> = ({
  progress,
  label,
}) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography variant={"h6"}>{label}</Typography>
      <LinearProgress variant="determinate" value={progress} />
    </Box>
  );
};
