import React from "react";
import { Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    subscribeButton: {
      marginLeft: "auto",
    },
  })
);

export const GoQuizStudioButton = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Button
      variant={"outlined"}
      color={"primary"}
      endIcon={<PostAddIcon />}
      size="large"
      disableElevation
      className={classes.subscribeButton}
      onClick={() => history.push("/studio/quiz")}
    >
      Quiz Studioへ
    </Button>
  );
};
