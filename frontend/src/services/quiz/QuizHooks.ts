import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import { useState, useEffect } from "react";
import imageUrl from "utils/helper/imageUrl";

export const useFetchFirstDocuments = () => {
  const [firstDocuments, setFirstDocuments] = useState<any>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    firebase
      .functions()
      .httpsCallable("pagingQuiz")()
      .then((res) => {
        if (mounted) {
          setFirstDocuments(res.data);
          setLoaded(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

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

export const useFetchLike = (quizId: string, goodClick: boolean) => {
  const [isLike, setIsLike] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  useEffect(() => {
    let mounted = true;
    const uid = firebase.auth().currentUser?.uid;
    if (!uid) return;
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
        return snapshot.data()?.quizRef.get() as Promise<
          firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
        >;
      })
      .then((snapshot) => {
        if (mounted) {
          const conunt =
            snapshot && snapshot.exists ? snapshot.data()?.likeCount || 0 : 0;
          setLikeCount(conunt);
        }
      })
      .then(() => {
        if (mounted) {
          setLoaded(true);
        }
      });
    return () => {
      mounted = false;
    };
  }, [quizId, goodClick]);
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
