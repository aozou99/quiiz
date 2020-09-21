import {
  Paper,
  Box,
  Divider,
  makeStyles,
  createStyles,
  Theme,
} from "@material-ui/core";
import React, { useMemo } from "react";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detail: {
      [theme.breakpoints.down("sm")]: {
        margin: theme.spacing(0),
        height: `calc(100vh - ${theme.spacing(21)}px)`,
        boxShadow: "none",
      },
      backgroundColor: "white",
      margin: theme.spacing(1),
      padding: theme.spacing(2),
      maxWidth: theme.spacing(70),
      minWidth: theme.spacing(56),
      position: "sticky",
      top: theme.spacing(10),
      overflowY: "auto",
      height: `calc(100vh - ${theme.spacing(16)}px)`,
    },
    img: {
      display: "block",
      margin: "auto",
      marginBottom: theme.spacing(1),
      borderRadius: theme.spacing(1),
    },
    question: {
      margin: theme.spacing(1, "auto"),
    },
    icons: {
      marginTop: theme.spacing(2),
      display: "flex",
      justifyContent: "space-evenly",
    },
    choice: {
      margin: "auto",
    },
  })
);

const AnswerPanel: React.FC = () => {
  const classes = useStyles();
  const DummyChoices = useMemo(() => {
    return Array.from({ length: 4 })
      .fill(null)
      .map((_, i) => (
        <Skeleton
          className={classes.choice}
          key={i}
          animation="wave"
          variant="text"
          height={62}
        />
      ));
  }, []);

  return (
    <Paper elevation={1} className={classes.detail}>
      <Skeleton
        animation="wave"
        variant="rect"
        width={256}
        height={144}
        className={classes.img}
      />
      <Skeleton
        animation="wave"
        variant="text"
        width={256}
        height={32}
        className={classes.question}
      />
      <Divider />
      {DummyChoices}
      <Box className={classes.icons}>
        <Skeleton animation="wave" variant="circle" width={40} height={40} />
        <Skeleton animation="wave" variant="circle" width={40} height={40} />
      </Box>
    </Paper>
  );
};

export default React.memo(AnswerPanel);
