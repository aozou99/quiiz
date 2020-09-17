import React, { ReactNode } from "react";
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Box,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      placeItems: "center",
      placeContent: "center",
      minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
      textAlign: "center",
    },
    description: {
      marginTop: theme.spacing(-16),
      "&>*": {
        margin: theme.spacing(1),
      },
    },
  })
);

export const Description: React.FC<{
  title: string;
  caption: string;
  icon: ReactNode;
  button?: ReactNode;
}> = ({ icon, title, caption, button }) => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.description}>
        {icon}
        <Typography variant="h5" color="textPrimary">
          {title}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {caption}
        </Typography>
        {button}
      </Box>
    </Box>
  );
};
