import React from "react";
import clsx from "clsx";
import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  Container,
} from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 12),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1.5, 1.5),
      },
    },
    avator: {
      width: theme.spacing(17),
      height: theme.spacing(17),
      marginRight: theme.spacing(8),
      [theme.breakpoints.down("sm")]: {
        width: theme.spacing(6),
        height: theme.spacing(6),
        marginRight: theme.spacing(1.5),
      },
    },
    channel: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      marginBottom: theme.spacing(4),
      [theme.breakpoints.down("sm")]: {
        marginBottom: theme.spacing(1.5),
        placeContent: "start",
      },
    },
    title: {
      width: theme.spacing(24),
    },
    body: {
      width: theme.spacing(28),
    },
    subscribeButton: {
      marginLeft: "auto",
      width: theme.spacing(11.5),
    },
    mobileHidden: {
      [theme.breakpoints.down("sm")]: {
        display: "none",
      },
    },
  })
);
const DummySubscChannel = () => {
  const classes = useStyles();
  return (
    <Box className={classes.channel}>
      <Skeleton animation="wave" variant="circle" className={classes.avator} />
      <Box>
        <Skeleton animation="wave" height={48} className={classes.title} />
        <Skeleton
          animation="wave"
          height={32}
          className={clsx(classes.body, classes.mobileHidden)}
        />
      </Box>
      <Skeleton
        animation="wave"
        variant="rect"
        height={32}
        className={classes.subscribeButton}
      />
    </Box>
  );
};

export const DummySubscChannels = () => {
  const classes = useStyles();
  return (
    <Container maxWidth={"lg"} className={classes.root}>
      {Array.from({ length: 4 })
        .fill(null)
        .map((_a, i) => (
          <DummySubscChannel key={i} />
        ))}
    </Container>
  );
};
