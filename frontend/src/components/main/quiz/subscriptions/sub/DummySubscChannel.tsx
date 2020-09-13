import React from "react";
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
    },
    avator: {
      width: theme.spacing(17),
      height: theme.spacing(17),
      marginRight: theme.spacing(8),
    },
    channel: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      marginBottom: theme.spacing(4),
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
  })
);
export const DummySubscChannel = () => {
  const classes = useStyles();
  return (
    <Box className={classes.channel}>
      <Skeleton animation="wave" variant="circle" className={classes.avator} />
      <Box>
        <Skeleton animation="wave" height={48} className={classes.title} />
        <Skeleton animation="wave" height={32} className={classes.body} />
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
        .map(() => (
          <DummySubscChannel />
        ))}
    </Container>
  );
};
