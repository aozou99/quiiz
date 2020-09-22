import React from "react";
import { Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { useHistory } from "react-router-dom";
import clsx from "clsx";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    subscribeButton: {
      marginLeft: "auto",
    },
  })
);

export const GoQuizStudioButton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Button
      variant={"outlined"}
      color={"primary"}
      endIcon={<PostAddIcon />}
      size="large"
      disableElevation
      className={clsx(classes.subscribeButton, className)}
      onClick={() => history.push("/studio/quiz")}
    >
      Quiz Studioへ
    </Button>
  );
};
