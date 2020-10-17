import {
  makeStyles,
  Theme,
  createStyles,
  Container,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Divider,
  Button,
  Snackbar,
} from "@material-ui/core";
import React, { useState } from "react";
import { useAuthUser } from "services/auth/AuthHooks";
import DeleteIcon from "@material-ui/icons/Delete";
import MailIcon from "@material-ui/icons/Mail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { ChangePasswordDialog } from "components/common/dialog/ChangePasswordDialog";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
    title: {
      fontWeight: "bold",
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
    password: {
      display: "flex",
      placeItems: "center",
      "&>button": {
        marginLeft: "auto",
      },
    },
    snackbar: {
      zIndex: 10000,
      [theme.breakpoints.down("sm")]: {
        bottom: "50%",
      },
    },
  })
);

export const AccountSettingTabPannel = () => {
  const classes = useStyles();
  const { firebaseUser } = useAuthUser();
  const handleChange = () => {};
  const handleChangePassword = () => {
    setPassDialog(true);
  };
  const [passDialog, setPassDialog] = useState(false);
  const [snakOpen, setSnackOpen] = useState(false);
  const [snackContent, setSnackContent] = useState<{
    type: "info" | "success" | "warning" | "error" | undefined;
    text: string;
  }>({
    type: "info",
    text: "",
  });

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Box>
        <Typography variant="subtitle1" className={classes.title}>
          メール通知
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleChange}
                name="sendMailWhenLiked"
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="textSecondary">
                クイズに「いいね」されたとき
              </Typography>
            }
            color="primary"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleChange}
                name="sendMailWhenNewQuiz"
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="textSecondary">
                登録チャンネルに新規投稿されたとき
              </Typography>
            }
            color="primary"
          />
        </FormGroup>
      </Box>
      <Divider className={classes.divider} />
      {firebaseUser?.providerData[0]?.providerId === "password" && (
        <Box>
          <Box className={classes.password}>
            <Typography
              variant="subtitle1"
              className={classes.title}
              gutterBottom
            >
              メールアドレス
            </Typography>
            <Button
              variant="outlined"
              color="default"
              size="small"
              startIcon={<MailIcon />}
            >
              変更する
            </Button>
          </Box>
          <Typography variant="body2" color="textSecondary" paragraph>
            {firebaseUser.email}
          </Typography>
          <Box className={classes.password}>
            <Typography variant="subtitle1" className={classes.title}>
              パスワード
            </Typography>
            <Button
              variant="outlined"
              color="default"
              size="small"
              startIcon={<VpnKeyIcon />}
              onClick={handleChangePassword}
            >
              変更する
            </Button>
            <ChangePasswordDialog
              open={passDialog}
              onClose={() => {
                setPassDialog(false);
              }}
              onUpdated={() => {
                setSnackContent({
                  type: "success",
                  text: "パスワードを変更しました",
                });
                setSnackOpen(true);
              }}
            />
          </Box>
        </Box>
      )}
      {firebaseUser?.providerData[0]?.providerId === "google.com" && (
        <Box>
          <Typography variant="subtitle1" className={classes.title}>
            Google連携
          </Typography>
          <Typography>{firebaseUser?.email}</Typography>
        </Box>
      )}
      <Divider className={classes.divider} />
      <Box>
        <Typography variant="subtitle1" className={classes.title} paragraph>
          アカウントの削除
        </Typography>
        <Button variant="contained" color="default" startIcon={<DeleteIcon />}>
          アカウントを削除する
        </Button>
      </Box>
      <Snackbar
        open={snakOpen}
        autoHideDuration={1500}
        onClose={() => setSnackOpen(false)}
        className={classes.snackbar}
      >
        <Alert severity={snackContent.type}>{snackContent.text}</Alert>
      </Snackbar>
    </Container>
  );
};
