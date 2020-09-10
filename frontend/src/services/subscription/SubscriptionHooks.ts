import { useState, useEffect } from "react";
import { functions } from "utils/firebase/functions";

export const useFetchSubscribeChannels = () => {
  const [loaded, setLoaded] = useState(false);
  const [channels, setChannels] = useState<any>([]);

  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    functions
      .httpsCallable("getSubscribeChannels")()
      .then((res) => {
        if (mounted) {
          console.log(res.data);
          setChannels(res.data);
        }
      })
      .finally(() => setLoaded(true));
    return () => {
      mounted = false;
    };
  }, []);

  return {
    loaded,
    channels,
  };
};
