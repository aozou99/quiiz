import {
  Box,
  Typography,
  Avatar,
  makeStyles,
  Theme,
  createStyles,
  Button,
  IconButton,
  Snackbar,
} from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import { useFetchChannelHeader } from "services/channel/ChannelHooks";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import { Redirect } from "react-router-dom";
import ChannelService from "services/channel/ChannelService";
import { DummyChannelHeader } from "components/main/quiz/channel/sub/header/DummyChannelHeader";
import BasicConfirmDialog from "components/common/dialog/BasicConfirmDialog";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import clsx from "clsx";
import { EditableTextField } from "components/common/input/EditableTextField";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import CropDialog from "components/common/dialog/CropDialog";
import doMatchRatios from "utils/helper/doMatchRatios";
import AuthService from "services/auth/AuthService";
import { BackDropContext } from "components/main/quiz/Main";
import { LinearWithLabel } from "components/common/feedback/LinearWithLabel";
import Alert from "@material-ui/lab/Alert";
import { GoQuizStudioButton } from "components/common/button/GoQuizStudioButton";
import { SignInGuideDialog } from "components/common/dialog/SignInGuideDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
      [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(3, 20, 1),
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(3, 8, 1),
      },
    },
    avator: {
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
    subscribeButton: {
      marginLeft: "auto",
    },
    container: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
    },
    channelLogo: {
      display: "flex",
      placeItems: "center",
      placeContent: "center",
      marginRight: theme.spacing(3),
    },
    editLogo: {
      position: "absolute",
      backgroundColor: "rgba(0, 0, 0, 0.54)",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.54)",
      },
    },
    displayNone: {
      display: "none",
    },
    inputFileBtnHide: {
      opacity: 0,
      appearance: "none",
      position: "absolute",
    },
  })
);

export const ChannelHeader: React.FC<{ channelId: string }> = ({
  channelId,
}) => {
  const classes = useStyles();
  const [user, authLoading] = useAuthState(firebase.auth());
  const {
    loaded,
    channelHeader,
    isSubscribed: initialSubscState,
    editable,
    hasError,
  } = useFetchChannelHeader(channelId);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedUsers, setSubscribedUsers] = useState(0);
  const [unsubscDialogOpen, setUnsubscDialogOpen] = useState(false);
  const [onHoverLogo, setOnHoverLogo] = useState(false);
  const [channelName, setChannelName] = useState("");
  const [openCropDialog, setOpenCronpDialog] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  const [originImage, setOriginImage] = useState<string | undefined>(undefined);
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [signInTitle, setSignInTitle] = useState("");
  const [signInBody, setSignInBody] = useState("");
  const { setBackDropChildNode, setOpenBackDrop } = useContext(BackDropContext);

  const validateSignInDialog = (title: string, body: string) => {
    const isNg = !authLoading && !user;
    if (isNg) {
      setSignInTitle(title);
      setSignInBody(body);
      setOpenSignInDialog(true);
    }
    return isNg;
  };
  const setSnackBar = (text: string) => {
    setSnackBarText(text);
    setOpenSnackBar(true);
  };

  const handleSubscribeOrCancel = () => {
    if (
      validateSignInDialog(
        "チャンネル登録をする",
        "チャンネル登録をするには、ログインをしてください"
      )
    ) {
      return;
    }

    ChannelService.subscribeOrCancel(channelId).then((latestIsSubscribed) => {
      setIsSubscribed(latestIsSubscribed);
      setSubscribedUsers((a) => (latestIsSubscribed ? ++a : --a));
      setUnsubscDialogOpen(false);
    });
  };

  const handleProfileImageChanged = (imageUrl: string) => {
    setBackDropChildNode(
      <LinearWithLabel progress={0} label={`リサイズ中...`} />
    );
    setOpenBackDrop(true);
    AuthService.updatePhotoUrl(
      imageUrl,
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setBackDropChildNode(
          <LinearWithLabel
            progress={progress}
            label={`アップロード中...(${Math.floor(progress)}%)`}
          />
        );
      },
      () => {
        setOpenBackDrop(false);
        setSnackBar("画像の変更が完了しました！");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    );
  };

  useEffect(() => {
    if (loaded) {
      setIsSubscribed(initialSubscState);
      setSubscribedUsers(channelHeader.subscribedCount);
      setChannelName(channelHeader.channelName);
    }
  }, [initialSubscState, loaded, channelHeader]);

  return loaded && hasError ? (
    <Redirect to={"/error?src=404"} />
  ) : loaded && !authLoading ? (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Box
          className={classes.channelLogo}
          onMouseEnter={() => {
            setOnHoverLogo(true);
          }}
          onMouseLeave={() => {
            setOnHoverLogo(false);
          }}
        >
          <Avatar src={channelHeader.channelLogo} className={classes.avator} />
          <IconButton
            aria-label="edit"
            size="medium"
            className={clsx(
              classes.editLogo,
              (!editable || !onHoverLogo) && classes.displayNone
            )}
            disableRipple
            disableFocusRipple
          >
            <PhotoCameraIcon fontSize="large" style={{ color: "white" }} />
            <input
              type="file"
              className={classes.inputFileBtnHide}
              accept="image/*"
              onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                if (
                  e.target.files !== null &&
                  (e.target.files?.length || 0) > 0
                ) {
                  const url = URL.createObjectURL(e.target.files[0]);
                  setOriginImage(url);
                  if (!(await doMatchRatios(url, 1, 1))) {
                    setOpenCronpDialog(true);
                  } else {
                    handleProfileImageChanged(url);
                  }
                }
              }}
            />
          </IconButton>
        </Box>
        <Box>
          <EditableTextField
            editable={editable}
            value={channelName}
            valueName={"チャンネル名"}
            setValue={setChannelName}
            maxLength={50}
            onSave={(newChannelName) =>
              user
                ?.updateProfile({
                  displayName: newChannelName,
                })
                .then(() => {
                  setSnackBar("チャンネル名を変更しました！");
                })
            }
          />
          <Typography variant={"subtitle2"}>
            チャンネル登録者数 {subscribedUsers}人
          </Typography>
        </Box>
        {editable ? (
          <GoQuizStudioButton />
        ) : (
          <Button
            variant={isSubscribed ? "contained" : "outlined"}
            color={isSubscribed ? "default" : "primary"}
            endIcon={
              isSubscribed ? (
                <SentimentVerySatisfiedIcon />
              ) : (
                <SubscriptionsIcon />
              )
            }
            size="large"
            disableElevation
            className={classes.subscribeButton}
            onClick={
              isSubscribed
                ? () => setUnsubscDialogOpen(true)
                : handleSubscribeOrCancel
            }
          >
            {isSubscribed ? "登録済み" : "チャンネル登録"}
          </Button>
        )}
      </Box>
      <BasicConfirmDialog
        body={`${channelHeader.channelName}のチャンネル登録を解除しますか？`}
        yesOnClick={handleSubscribeOrCancel}
        open={unsubscDialogOpen}
        setOpen={setUnsubscDialogOpen}
      />
      <CropDialog
        open={openCropDialog}
        setOpen={setOpenCronpDialog}
        imgUrl={originImage || ""}
        onCompleted={handleProfileImageChanged}
        onClose={() => {}}
        aspect={1 / 1}
      />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackBar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert severity="success" onClose={() => setOpenSnackBar(false)}>
          {snackBarText}
        </Alert>
      </Snackbar>
      <SignInGuideDialog
        open={openSignInDialog}
        title={signInTitle}
        bodyText={signInBody}
        onClose={() => setOpenSignInDialog(false)}
      />
    </Box>
  ) : (
    <DummyChannelHeader />
  );
};
