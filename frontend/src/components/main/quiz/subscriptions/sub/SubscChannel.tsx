import React, { useState } from "react";
import {
  makeStyles,
  createStyles,
  Theme,
  Typography,
  Box,
  Avatar,
} from "@material-ui/core";
import { SubscribeButton } from "components/common/button/SubscribeButton";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avator: {
      width: theme.spacing(17),
      height: theme.spacing(17),
      marginRight: theme.spacing(8),
    },
    channel: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      marginBottom: theme.spacing(4),
    },
  })
);

export const SubscChannel: React.FC<{
  channel: {
    id: string;
    channelName: string;
    channelLogo: string;
    subscribedCount: number;
    hasQuizCount: number;
  };
}> = ({ channel }) => {
  const classes = useStyles();
  const [subscribedCount, setSubscribedCount] = useState(
    channel.subscribedCount
  );
  const history = useHistory();
  return (
    <Box
      key={channel.id}
      className={classes.channel}
      onClick={() => history.push(`/channel/${channel.id}`)}
    >
      <Avatar src={channel.channelLogo} className={classes.avator} />
      <Box>
        <Typography variant="h6" gutterBottom>
          {channel.channelName}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
        >{`チャンネル登録者数 ${subscribedCount}人・${channel.hasQuizCount}個のクイズ`}</Typography>
      </Box>
      <SubscribeButton
        channelId={channel.id}
        channelName={channel.channelName}
        initialIsSubscribed={true}
        onCompleted={(latestIsSubscribed: boolean) =>
          setSubscribedCount((pre) => (latestIsSubscribed ? ++pre : --pre))
        }
      />
    </Box>
  );
};
