import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import { useState, useEffect } from "react";
import imageUrl from "utils/helper/imageUrl";
import { getCounter } from "utils/helper/counter";

type parameters = {
  channelId?: string;
};
export const useFetchFirstDocuments = (parameters?: parameters) => {
  const [apiOptions] = useState(parameters);
  const [firstDocuments, setFirstDocuments] = useState<any>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    firebase
      .functions()
      .httpsCallable("pagingQuiz")({ ...apiOptions })
      .then((res) => {
        if (mounted) {
          setFirstDocuments(res.data);
          setLoaded(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [apiOptions]);

  return { firstDocuments, loaded };
};

export const useFetchThumbnailUrl = (
  uri: string,
  size: "256x144" | "640x360"
) => {
  const [imgSrc, setImgSrc] = useState();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    imageUrl(uri, size).then((path) => {
      if (mounted) {
        setImgSrc(path);
        setLoaded(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [uri, size]);

  return { imgSrc, loaded };
};

export const useFetchLike = (quizId: string, likeClick: boolean) => {
  const [isLike, setIsLike] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    let mounted = true;
    const uid = firebase.auth().currentUser?.uid;
    if (!uid) return;
    Promise.all([
      firebase
        .firestore()
        .collection("users")
        .doc(uid)
        .collection("likedQuizzes")
        .doc(quizId)
        .get()
        .then((snapshot) => {
          // いいね状態を反映
          if (mounted) {
            setIsLike(snapshot.exists);
          }
        }),
      getCounter(
        firebase
          .firestore()
          .collection("users")
          .doc(uid)
          .collection("quizzes")
          .doc(quizId)
          .collection("counters")
          .doc("likedUsers")
      ).then((conunt) => {
        if (mounted) {
          setLikeCount(conunt);
        }
      }),
    ]).finally(() => {
      if (mounted) {
        setLoaded(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [quizId, likeClick]);
  return { isLike, loaded, likeCount };
};

export const useFetchLikeQuizzes = () => {
  const [loaded, setLoaded] = useState(false);
  const [likedQuizzes, setLikedQuizzes] = useState<any>();
  useEffect(() => {
    let mounted = true;
    firebase
      .functions()
      .httpsCallable("pagingMyLikeQuiz")()
      .then((res) => {
        if (mounted) {
          setLikedQuizzes(res.data);
          setLoaded(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);
  return { loaded, likedQuizzes };
};
