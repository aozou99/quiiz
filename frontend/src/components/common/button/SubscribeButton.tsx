import React, { useState, useContext, useEffect } from "react";
import { makeStyles, Theme, createStyles, Button } from "@material-ui/core";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import ChannelService from "services/channel/ChannelService";
import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  SignInGuideDialogContext,
  UnSubscribedDialogContext,
} from "components/main/quiz/Main";

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    subscribeButton: {
      marginLeft: "auto",
    },
  })
);

export const useSubscriptionAction = (
  channelId: string,
  onCompleted: (latestIsSubscribed: boolean) => {} | void
) => {
  const [user, authLoading] = useAuthState(firebase.auth());
  const { setOpenSignInDialog, setSignInTitle, setSignInBody } = useContext(
    SignInGuideDialogContext
  );

  const validateSignInDialog = (title: string, body: string) => {
    const isNg = !authLoading && !user;
    if (isNg) {
      setSignInTitle(title);
      setSignInBody(body);
      setOpenSignInDialog(true);
    }
    return isNg;
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
    return ChannelService.subscribeOrCancel(channelId).then(onCompleted);
  };

  return { handleSubscribeOrCancel };
};

export const SubscribeButton: React.FC<{
  channelId: string;
  channelName: string;
  initialIsSubscribed: boolean;
  onCompleted: (latestIsSubscribed: boolean) => {} | void;
}> = ({ initialIsSubscribed, channelId, channelName, onCompleted }) => {
  const classes = useStyles();
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const { handleSubscribeOrCancel } = useSubscriptionAction(
    channelId,
    (isSubsc: boolean) => {
      onCompleted(isSubsc);
      setIsSubscribed(!!isSubsc);
    }
  );
  const {
    setChannelName,
    setUnsubscDialogOpen,
    setHandleSubscribeOrCancel,
  } = useContext(UnSubscribedDialogContext);

  useEffect(() => {
    setIsSubscribed(initialIsSubscribed);
  }, [initialIsSubscribed]);

  return (
    <Button
      variant={isSubscribed ? "contained" : "outlined"}
      color={isSubscribed ? "default" : "primary"}
      endIcon={isSubscribed ? undefined : <SubscriptionsIcon />}
      size={isSubscribed ? "medium" : "large"}
      disableElevation
      className={classes.subscribeButton}
      onClick={
        isSubscribed
          ? (e: React.MouseEvent) => {
              e.stopPropagation();
              setChannelName(channelName);
              setHandleSubscribeOrCancel(() => handleSubscribeOrCancel);
              setUnsubscDialogOpen(true);
            }
          : handleSubscribeOrCancel
      }
    >
      {isSubscribed ? "登録済み" : "チャンネル登録"}
    </Button>
  );
};
