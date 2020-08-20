import { Box, makeStyles, Theme, createStyles } from "@material-ui/core";
import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(3, 20, 1),
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3, 8, 1),
      },
    },
    avator: {
      width: theme.spacing(10),
      height: theme.spacing(10),
      marginRight: theme.spacing(3),
    },
    subscribeButton: {
      marginLeft: "auto",
    },
    container: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
    },
  })
);

export const DummyChannelHeader: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Skeleton
          variant="circle"
          className={classes.avator}
          animation="wave"
        />
        <Box>
          <Skeleton variant="text" height={40} width={250} animation="wave" />
          <Skeleton variant="text" height={30} width={200} animation="wave" />
        </Box>
        <Skeleton
          variant="rect"
          height={40}
          width={160}
          className={classes.subscribeButton}
          animation="wave"
        />
      </Box>
    </Box>
  );
};
