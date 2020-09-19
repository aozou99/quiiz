import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { pagingPlayList } from "services/playList/pagingPlayList";
import { pagingPlayListContents } from "services/playList/pagingPlayListContents";

const playListRef = (userId: string) =>
  firebase
    .firestore()
    .collection("users")
    .doc(userId)
    .collection("playLists");

export const useFetchPlayLists = (userId?: string) => {
  const [playLists, setPlayLists] = useState<
    { id: string; name: string; public: boolean }[]
  >([]);
  const [loaded, setLoaded] = useState(false);
  const [user, loading] = useAuthState(firebase.auth());
  const [reload, setReload] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (loading) return;
    if (!user) {
      if (mounted) {
        setPlayLists([]);
        setLoaded(true);
      }
    } else {
      playListRef(userId || user.uid)
        .get()
        .then((snapshot) => {
          if (mounted) {
            setPlayLists(
              snapshot.docs.map((doc) => {
                return {
                  id: doc.id,
                  name: doc.data().listName,
                  public: doc.data().privacy === 0,
                  count: doc.data().quizCount,
                };
              })
            );
            setLoaded(true);
          }
        });
    }
    return () => {
      mounted = false;
    };
  }, [userId, loading, user, reload]);

  return { playLists, loaded, reload: () => setReload(!reload) };
};

export const useCheckList = (quizId: string) => {
  const [checked, setChecked] = useState<number[]>([]);
  const { playLists, loaded, reload } = useFetchPlayLists();
  const [click, setClick] = useState(false);
  useEffect(() => {
    let mounted = true;
    if (loaded) {
      const newChecked: number[] = [];
      const userId = firebase.auth().currentUser?.uid;
      const promises = [];
      if (!userId) return;
      for (let index = 0; index < playLists.length; index++) {
        const list = playLists[index];
        promises.push(
          playListRef(userId)
            .doc(list.id)
            .collection("playListQuiz")
            .doc(quizId)
            .get()
            .then((snapshot) => {
              if (snapshot.exists) {
                newChecked.push(index);
              }
            })
        );
      }
      Promise.all(promises).then(() => {
        if (mounted) {
          setChecked(newChecked);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [loaded, playLists, quizId, click]);
  return {
    checked,
    playLists,
    loaded,
    update: () => {
      reload();
      setClick(!click);
    },
  };
};

export const useFetchPlayListsWithThumbnail = (parameters?: {
  channelId?: string;
  perCount?: number;
  lastListId?: string;
  nextPlayList?: any;
}) => {
  const [loaded, setLoaded] = useState(false);
  const [playLists, setPlayLists] = useState<any>([]);
  const [apiOptions, setApiOptions] = useState(parameters);
  const [user, loading] = useAuthState(firebase.auth());
  const [hasNext, setHasNext] = useState(false);
  const [nextPlayList, setNextPlayList] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    setLoaded(false);
    if (!loading) {
      pagingPlayList(user?.uid, apiOptions).then((res) => {
        if (mounted) {
          setPlayLists((pre: any[]) => [...pre, ...(res.playLists || [])]);
          setHasNext(res.hasNext);
          setNextPlayList(res.nextPlayList);
          setLoaded(true);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [apiOptions, loading, user]);

  useEffect(() => {
    if (parameters?.nextPlayList !== apiOptions?.nextPlayList) {
      setApiOptions(parameters);
    }
  }, [parameters, apiOptions]);

  return { loaded, playLists, hasNext, nextPlayList };
};

export const useFetchPlayListContents = (playListId: string) => {
  const [loaded, setLoaded] = useState(false);
  const [playList, setPlayList] = useState<any>();
  const [quizzes, setQuizzes] = useState<any>();
  const [refresh, setRefresh] = useState(false);
  const [editable, setEditable] = useState(false);
  const [user, loading] = useAuthState(firebase.auth());

  useEffect(() => {
    let mounted = true;
    if (!loading && user) {
      pagingPlayListContents(user.uid, { id: playListId }).then((res) => {
        if (mounted) {
          setEditable(user.uid === res.playList?.authorId);
          setPlayList(res.playList);
          setQuizzes(res.quizzes);
          setLoaded(true);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [playListId, refresh, user, loading]);
  return {
    loaded,
    playList,
    quizzes,
    editable,
    refresh: () => {
      setRefresh(!refresh);
    },
  };
};

export const useFetchPlayList = (playListId: string) => {
  const [loaded, setLoaded] = useState(false);
  const [playList, setPlayList] = useState<any>();

  useEffect(() => {
    let mounted = true;
    firebase
      .firestore()
      .collectionGroup("playLists")
      .where("id", "==", playListId)
      .get()
      .then((snapshot) => {
        if (mounted && snapshot.size > 0) {
          setPlayList(snapshot.docs[0].data());
          setLoaded(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [playListId]);
  return { loaded, playList };
};
