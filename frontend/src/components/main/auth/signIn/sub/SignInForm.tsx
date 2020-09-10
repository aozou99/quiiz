import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import AuthService from "services/auth/AuthService";
import { useForm } from "react-hook-form";
import { Snackbar, Backdrop, CircularProgress } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

type FormData = {
  email: string;
  password: string;
  user: boolean;
};

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
  },
  input: {
    WebkitBoxShadow: "0 0 0 1000px white inset",
  },
}));

const SignInForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [progressing, setProgressing] = useState(false);
  const { register, handleSubmit, setError, errors, clearErrors } = useForm<
    FormData
  >();
  const onSubmit = handleSubmit(async ({ password, email }) => {
    try {
      setProgressing(true);
      await AuthService.signIn({ email, password });
      history.push("/");
    } catch (error) {
      setProgressing(false);
      switch (error.code) {
        case "auth/invalid-email":
          setError("email", {
            type: error.code,
            message: "メールアドレスの形式が誤っています",
          });
          break;

        case "auth/user-not-found":
        case "auth/wrong-password":
          setError("user", {
            type: error.code,
            message: "メールアドレス/パスワードのいずれかが誤っています",
          });
          break;
        default:
          setError("user", {
            type: error.code,
            message: "不明なエラーが発生しました",
          });
          console.error(error);
          break;
      }
    }
  });

  return (
    <form className={classes.form} onSubmit={onSubmit} noValidate>
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        id="email"
        label={errors.email?.message || "メールアドレス"}
        name="email"
        autoComplete="email"
        inputRef={register({
          required: "メールアドレスを入力してください",
        })}
        error={!!errors.email}
        inputProps={{ className: classes.input }}
      />
      <TextField
        variant="outlined"
        margin="normal"
        required
        fullWidth
        name="password"
        label={errors.password?.message || "パスワード"}
        type="password"
        id="password"
        autoComplete="password"
        inputRef={register({
          required: "パスワードを入力してください",
        })}
        error={!!errors.password}
        inputProps={{ className: classes.input }}
      />
      <FormControlLabel
        control={<Checkbox value="remember" color="primary" />}
        label="次回から省略する"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
      >
        <Typography component="span" variant="h4">
          Go !
        </Typography>
      </Button>
      <Grid container>
        <Grid item xs>
          <Link href="#" variant="body2">
            パスワードを忘れた方
          </Link>
        </Grid>
        <Grid item>
          <Link component={RouterLink} to="/signup" variant="body2">
            新規登録はこちら
          </Link>
        </Grid>
      </Grid>
      <Snackbar
        open={!!errors.user}
        onClose={() => clearErrors("user")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => clearErrors("user")} severity="error">
          {errors.user?.message}
        </Alert>
      </Snackbar>
      <Backdrop className={classes.backdrop} open={progressing}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </form>
  );
};

export default SignInForm;
