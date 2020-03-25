import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Copyright from "components/main/auth/commonSub/Copyright";
import SignUpForm from "components/main/auth/signUp/sub/SignUpForm";
import AuthService from "services/auth/AuthService";

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  title: {
    fontFamily: "Chalkboard"
  }
}));

const SignUp = () => {
  const classes = useStyles();
  useEffect(() => {
    AuthService.createFirebaseUI();
  }, []);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          className={classes.title}
          component="h1"
          variant="h4"
          color="primary"
        >
          Quiiz
          <Typography component="span" variant="h5" color="textSecondary">
            に登録する
          </Typography>
        </Typography>
        <SignUpForm />
        <div id="firebaseui-auth-container"></div>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default SignUp;
