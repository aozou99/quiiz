import React, { ReactNode } from "react";
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Box,
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isSmallerSm = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box className={classes.root}>
      <Box className={classes.description}>
        {icon}
        <Typography variant={isSmallerSm ? "h6" : "h5"} color="textPrimary">
          {title}
        </Typography>
        <Typography
          variant={isSmallerSm ? "subtitle2" : "subtitle1"}
          color="textSecondary"
        >
          {caption}
        </Typography>
        {button}
      </Box>
    </Box>
  );
};
