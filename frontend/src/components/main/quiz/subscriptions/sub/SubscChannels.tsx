import React from "react";
import { useFetchSubscribeChannels } from "services/subscription/SubscriptionHooks";
import { makeStyles, Theme, createStyles, Container } from "@material-ui/core";
import { SubscChannel } from "components/main/quiz/subscriptions/sub/SubscChannel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 12),
    },
  })
);

export const SubscChannels = () => {
  const classes = useStyles();
  const { loaded, channels } = useFetchSubscribeChannels();

  return (
    <Container maxWidth="lg" className={classes.root}>
      {loaded && channels.map((channel) => <SubscChannel channel={channel} />)}
    </Container>
  );
};
