import React from "react";
import { Box, Typography, makeStyles, Theme } from "@material-ui/core";
import { SignInButton } from "components/common/button/SignInButton";

const useStyles = makeStyles((theme: Theme) => ({
  signInGuideBox: {
    padding: theme.spacing(1.5, 3),
    whiteSpace: "normal",
    "&>*": {
      margin: theme.spacing(1, 0),
    },
  },
}));

export const SignInGuideDescription = () => {
  const classes = useStyles();

  return (
    <>
      <Box className={classes.signInGuideBox}>
        <Typography variant={"body2"} color={"textPrimary"} gutterBottom>
          クイズをいいね、お気に入り、チャンネル登録を行うにはログインしてください。
        </Typography>
        <SignInButton />
      </Box>
    </>
  );
};
