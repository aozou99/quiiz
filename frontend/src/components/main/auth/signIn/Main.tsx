import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import SignInForm from "components/main/auth/signIn/sub/SignInForm";
import Copyright from "components/common/guide/Copyright";
import AuthService from "services/auth/AuthService";

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "white",
    height: "100vh",
    width: "100vw",
  },
  paper: {
    paddingTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
  },
  title: {
    fontFamily: "Chalkboard",
  },
}));

const SignIn = () => {
  const classes = useStyles();
  useEffect(() => {
    AuthService.createFirebaseUI();
  }, []);

  return (
    <Box className={classes.root}>
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
              にログインする
            </Typography>
          </Typography>
          <SignInForm />
          <div id="firebaseui-auth-container"></div>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    </Box>
  );
};

export default SignIn;
