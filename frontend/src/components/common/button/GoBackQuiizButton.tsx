import React from "react";
import { Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    subscribeButton: {
      marginLeft: "auto",
    },
  })
);

export const GoBackQuiizButton = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Button
      variant={"outlined"}
      color={"primary"}
      size="large"
      disableElevation
      className={classes.subscribeButton}
      onClick={() => history.push("/")}
    >
      Quiizに戻る
    </Button>
  );
};
