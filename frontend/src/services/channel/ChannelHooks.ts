import firebase from "firebase/app";
import "firebase/functions";
import { useAuthState } from "react-firebase-hooks/auth";

import { useState, useEffect } from "react";

export const useFetchChannelHeader = (channelId: string) => {
  const [loaded, setLoaded] = useState(false);
  const [channelHeader, setChannelHeader] = useState<any>();
  const [hasError, setHasError] = useState(false);
  const { loaded: subscLoaded, isSubscribed } = useIsSubscribed(channelId);
  const [headerLoaded, setHeaderLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    firebase
      .functions()
      .httpsCallable("getChannelHeader")({ channelId })
      .then((res) => {
        if (mounted) setChannelHeader(res.data);
      })
      .catch((_e) => {
        if (mounted) setHasError(true);
      })
      .finally(() => {
        if (mounted) setHeaderLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, [channelId]);

  useEffect(() => {
    setLoaded(headerLoaded && subscLoaded);
  }, [headerLoaded, subscLoaded]);

  return {
    loaded,
    channelHeader,
    isSubscribed,
    hasError,
  };
};

export const useIsSubscribed = (channelId: string) => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [user, loading, error] = useAuthState(firebase.auth());

  useEffect(() => {
    let mounted = true;

    if (loading || error || !user) {
      return;
    }

    firebase
      .firestore()
      .collection("users")
      .doc(channelId)
      .collection("subscribedUser")
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        if (mounted) {
          setIsSubscribed(snapshot.exists);
          setLoaded(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [channelId, loading, error, user]);
  return { loaded, isSubscribed };
};
