import firebase from "firebase/app";
import "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState, useEffect } from "react";
import { getChannelHeader } from "services/channel/getChannelHeader";

export const useFetchChannelHeader = (channelId: string) => {
  const [loaded, setLoaded] = useState(false);
  const [channelHeader, setChannelHeader] = useState<any>();
  const [hasError, setHasError] = useState(false);
  const { loaded: subscLoaded, isSubscribed } = useIsSubscribed(channelId);
  const [headerLoaded, setHeaderLoaded] = useState(false);
  const [editable, setEditable] = useState(false);
  const [user, loading] = useAuthState(firebase.auth());
  useEffect(() => {
    let mounted = true;
    if (!loading) {
      getChannelHeader({ channelId })
        .then((res) => {
          if (mounted) {
            setChannelHeader(res);
            setEditable(user?.uid === channelId);
          }
        })
        .catch((_e) => {
          if (mounted) setHasError(true);
        })
        .finally(() => {
          if (mounted) setHeaderLoaded(true);
        });
    }
    return () => {
      mounted = false;
    };
  }, [channelId, loading, user]);

  useEffect(() => {
    setLoaded(headerLoaded && subscLoaded);
  }, [headerLoaded, subscLoaded]);

  return {
    loaded,
    channelHeader,
    isSubscribed,
    editable,
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
      if (mounted) {
        setLoaded(true);
      }
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
        }
      })
      .finally(() => {
        if (mounted) {
          setLoaded(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [channelId, loading, error, user]);
  return { loaded, isSubscribed };
};
