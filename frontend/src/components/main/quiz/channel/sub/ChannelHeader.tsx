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
import UnsubscribeIcon from "@material-ui/icons/Unsubscribe";
import { Redirect } from "react-router-dom";
import ChannelService from "services/channel/ChannelService";
import { DummyChannelHeader } from "components/main/quiz/channel/sub/DummyChannelHeader";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "white",
      padding: theme.spacing(3, 20, 1),
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
    refresh,
    hasError,
  } = useFetchChannelHeader(channelId);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedUsers, setSubscribedUsers] = useState(0);

  useEffect(() => {
    if (loaded) {
      setIsSubscribed(initialSubscState);
      setSubscribedUsers(channelHeader.subscribedCount);
    }
  }, [initialSubscState, loaded]);

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
          variant="outlined"
          color={isSubscribed ? "secondary" : "primary"}
          endIcon={isSubscribed ? <UnsubscribeIcon /> : <SubscriptionsIcon />}
          size="large"
          className={classes.subscribeButton}
          onClick={() => {
            ChannelService.subscribeOrCancel(channelId).then(
              (latestIsSubscribed) => {
                setIsSubscribed(latestIsSubscribed);
                setSubscribedUsers((a) => (latestIsSubscribed ? ++a : --a));
                setTimeout(refresh, 1000);
              }
            );
          }}
        >
          {isSubscribed ? "チャンネル解除" : "チャンネル登録"}
        </Button>
      </Box>
    </Box>
  ) : (
    <DummyChannelHeader />
  );
};