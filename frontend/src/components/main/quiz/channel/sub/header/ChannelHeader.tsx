import {
  Box,
  Typography,
  Avatar,
  makeStyles,
  Theme,
  createStyles,
  Button,
  IconButton,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
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

  const handleSubscribeOrCancel = () => {
    ChannelService.subscribeOrCancel(channelId).then((latestIsSubscribed) => {
      setIsSubscribed(latestIsSubscribed);
      setSubscribedUsers((a) => (latestIsSubscribed ? ++a : --a));
      setUnsubscDialogOpen(false);
    });
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
              user?.updateProfile({
                displayName: newChannelName,
              })
            }
          />
          <Typography variant={"subtitle2"}>
            チャンネル登録者数 {subscribedUsers}人
          </Typography>
        </Box>
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
      </Box>
      <BasicConfirmDialog
        body={`${channelHeader.channelName}のチャンネル登録を解除しますか？`}
        yesOnClick={handleSubscribeOrCancel}
        open={unsubscDialogOpen}
        setOpen={setUnsubscDialogOpen}
      />
    </Box>
  ) : (
    <DummyChannelHeader />
  );
};
