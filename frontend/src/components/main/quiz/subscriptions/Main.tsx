import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import { GuestDescription } from "components/common/content/GuestDescription";
import SubscriptionsIcon from "@material-ui/icons/Subscriptions";
import { DummySubscChannels } from "components/main/quiz/subscriptions/sub/DummySubscChannel";
import { makeStyles, Theme, createStyles, Container } from "@material-ui/core";
import { useFetchSubscribeChannels } from "services/subscription/SubscriptionHooks";
import { SubscChannel } from "components/main/quiz/subscriptions/sub/SubscChannel";
import { Description } from "components/common/content/Description";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(3, 12),
    },
  })
);

const Main: React.FC = () => {
  const classes = useStyles();
  const [user, loading] = useAuthState(firebase.auth());
  const { loaded, channels } = useFetchSubscribeChannels();
  return (
    <>
      {(loading || !loaded) && <DummySubscChannels />}
      {loaded && channels.length > 0 ? (
        <Container maxWidth="lg" className={classes.root}>
          {channels.map((channel) => (
            <SubscChannel channel={channel} />
          ))}
        </Container>
      ) : (
        <Description
          icon={<SubscriptionsIcon style={{ fontSize: 120 }} color="action" />}
          title="新作クイズをお見逃しなく"
          caption="ここに登録したチャンネルが表示されます"
        />
      )}
      {!loading && !user && (
        <GuestDescription
          icon={<SubscriptionsIcon style={{ fontSize: 120 }} color="action" />}
          title="新作クイズをお見逃しなく"
          caption="ログインすると、お気に入りのチャンネルの最新情報をチェックできます"
        />
      )}
    </>
  );
};

export default Main;