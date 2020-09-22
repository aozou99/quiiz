import { useState, useEffect } from "react";
import { getSubscribeChannels } from "services/subscription/getSubscribeChannels";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";

export const useFetchSubscribeChannels = () => {
  const [loaded, setLoaded] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);
  const [user, loading] = useAuthState(firebase.auth());
  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    if (user) {
      getSubscribeChannels(user.uid)
        .then((res) => {
          if (mounted) {
            setChannels(res);
          }
        })
        .finally(() => {
          if (mounted) {
            setLoaded(true);
          }
        });
    }
    if (!loading && mounted) {
      setLoaded(true);
    }
    return () => {
      mounted = false;
    };
  }, [loading, user]);

  return {
    loaded,
    channels,
  };
};
