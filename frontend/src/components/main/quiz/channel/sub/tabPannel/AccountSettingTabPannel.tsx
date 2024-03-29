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
import React, { useEffect, useState } from "react";
import { useAuthUser, useFetchQuiizUser } from "services/auth/AuthHooks";
import DeleteIcon from "@material-ui/icons/Delete";
import MailIcon from "@material-ui/icons/Mail";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { ChangePasswordDialog } from "components/common/dialog/ChangePasswordDialog";
import { Alert } from "@material-ui/lab";
import { ChangeMailAddressDialog } from "components/common/dialog/ChangeMailAddressDialog";
import NotificationService from "services/notification/NotificationService";

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
  const { user, loaded } = useFetchQuiizUser(firebaseUser?.uid);
  const [sendMailState, setSendMailState] = useState({
    whenLiked: false,
    whenNewPost: false,
  });
  const [passDialog, setPassDialog] = useState(false);
  const [mailAddressDialog, setMailAddressDialog] = useState(false);
  const [snakOpen, setSnackOpen] = useState(false);
  const [snackContent, setSnackContent] = useState<{
    type: "info" | "success" | "warning" | "error" | undefined;
    text: string;
  }>({
    type: "info",
    text: "",
  });
  const handleChangeMailState = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const latestSetting = {
      ...sendMailState,
      [event.target.name]: event.target.checked,
    };
    NotificationService.updateMailSettings(latestSetting);
    setSendMailState(latestSetting);
  };
  const handleChangePassword = () => {
    setPassDialog(true);
  };
  const handleChangeMailAddress = () => {
    setMailAddressDialog(true);
  };

  useEffect(() => {
    if (loaded && user && user.notification?.mail) {
      setSendMailState(user.notification.mail);
    }
  }, [user, loaded]);
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
                onChange={handleChangeMailState}
                name="whenLiked"
                color="primary"
                checked={sendMailState.whenLiked}
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
                onChange={handleChangeMailState}
                name="whenNewPost"
                color="primary"
                checked={sendMailState.whenNewPost}
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
              onClick={handleChangeMailAddress}
            >
              変更する
            </Button>
            <ChangeMailAddressDialog
              open={mailAddressDialog}
              onClose={() => {
                setMailAddressDialog(false);
              }}
              onUpdated={() => {
                setSnackContent({
                  type: "success",
                  text: "メールアドレスを変更しました",
                });
                setSnackOpen(true);
              }}
            />
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
