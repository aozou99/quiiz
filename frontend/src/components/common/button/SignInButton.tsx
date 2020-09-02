import React from "react";
import { Button, makeStyles, Theme, createStyles } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    subscribeButton: {
      marginLeft: "auto",
    },
  })
);

export const SignInButton = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Button
      variant={"outlined"}
      color={"primary"}
      startIcon={<AccountCircleIcon style={{ fontSize: 32 }} />}
      size="medium"
      disableElevation
      className={classes.subscribeButton}
      onClick={() => history.push("/signin")}
    >
      ログイン
    </Button>
  );
};
