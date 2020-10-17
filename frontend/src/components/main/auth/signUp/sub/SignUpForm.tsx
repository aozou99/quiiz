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
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Snackbar,
  Backdrop,
  CircularProgress,
  FormHelperText,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Link as RouterLink } from "react-router-dom";
import { PASSWORD_REGEX } from "utils/costant/Validate";

const useStyles = makeStyles(theme => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
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

type FormData = {
  email: string;
  password: string;
  userName: string;
  user: boolean;
  agreeTerms: boolean;
};

const SignUpForm = () => {
  const classes = useStyles();
  const history = useHistory();
  const [progressing, setProgressing] = useState(false);
  const { register, handleSubmit, setError, errors, clearErrors } = useForm<
    FormData
  >();
  const onSubmit = handleSubmit(async ({ password, email, userName }) => {
    try {
      setProgressing(true);
      if (await AuthService.existDisplayName(userName)) {
        setProgressing(false);
        setError("userName", {
          type: "already-used",
          message: "既に使われているユーザ名です",
        });
        return;
      }
      await AuthService.signUp({
        displayName: userName,
        email,
        password,
      });
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
        case "auth/email-already-in-use":
          setError("email", {
            type: error.code,
            message: "既に登録されているメールアドレスです",
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="userName"
            label={errors.userName?.message || "ユーザ名"}
            name="userName"
            autoComplete="username"
            inputRef={register({
              required: "ユーザ名を入力してください",
            })}
            error={!!errors.userName}
            inputProps={{ className: classes.input }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            id="email"
            label={errors.email?.message || "メールアドレス"}
            name="email"
            type="email"
            autoComplete="email"
            inputRef={register({
              required: "メールアドレスを入力してください",
            })}
            error={!!errors.email}
            inputProps={{ className: classes.input }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            variant="outlined"
            required
            fullWidth
            name="password"
            label={errors.password?.message || "パスワード"}
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={register({
              required: "パスワードを入力してください",
              pattern: {
                value: PASSWORD_REGEX,
                message:
                  "パスワードは8文字以上、大文字・小文字英数字を含んでください",
              },
            })}
            error={!!errors.password}
            inputProps={{ className: classes.input }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            value="agreeTerms"
            name="agreeTerms"
            inputRef={register({
              required:
                "登録には利用規約・プライバシーポリシーに同意が必要になります",
            })}
            control={<Checkbox color="primary" />}
            label={
              <Typography variant="body2">
                <Link href="/terms" target="_blank" rel="noreferrer">
                  利用規約
                </Link>
                、
                <Link href="/privacy" target="_blank" rel="noreferrer">
                  プライバシーポリシー
                </Link>
                に同意しました
              </Typography>
            }
          />
          {!!errors.agreeTerms && (
            <FormHelperText error>{errors.agreeTerms.message}</FormHelperText>
          )}
        </Grid>
      </Grid>
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
      <Grid container justify="flex-end">
        <Grid item>
          <Link component={RouterLink} to="/signin" variant="body2">
            ログインはこちら
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

export default SignUpForm;
