import {
  Box,
  Typography,
  Avatar,
  makeStyles,
  Theme,
  createStyles,
  Button,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useFetchChannelHeader } from "services/channel/ChannelHooks";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import SentimentVerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import { Redirect } from "react-router-dom";
import ChannelService from "services/channel/ChannelService";
import { DummyChannelHeader } from "components/main/quiz/channel/sub/header/DummyChannelHeader";
import BasicConfirmDialog from "components/common/dialog/BasicConfirmDialog";

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
      marginRight: theme.spacing(3),
    },
    subscribeButton: {
      marginLeft: "auto",
    },
    container: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
    },
  })
);

export const ChannelHeader: React.FC<{ channelId: string }> = ({
  channelId,
}) => {
  const classes = useStyles();
  const {
    loaded,
    channelHeader,
    isSubscribed: initialSubscState,
    hasError,
  } = useFetchChannelHeader(channelId);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedUsers, setSubscribedUsers] = useState(0);
  const [unsubscDialogOpen, setUnsubscDialogOpen] = useState(false);

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
    }
  }, [initialSubscState, loaded, channelHeader]);

  return loaded && hasError ? (
    <Redirect to={"/error?src=404"} />
  ) : loaded ? (
    <Box className={classes.root}>
      <Box className={classes.container}>
        <Avatar src={channelHeader.channelLogo} className={classes.avator} />
        <Box>
          <Typography variant={"h6"}>{channelHeader.channelName}</Typography>
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
