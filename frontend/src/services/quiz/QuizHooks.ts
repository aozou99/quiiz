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
    firebase
      .functions()
      .httpsCallable("pagingQuiz")()
      .then((res) => {
        setFirstDocuments(res.data);
        setLoaded(true);
      });
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
      }
      setLoaded(true);
    });
    return () => {
      mounted = false;
    };
  }, [uri, size]);

  return { imgSrc, loaded };
};

export const useFetchGood = (exerciseId: string, goodClick: boolean) => {
  const [isGood, setIsGood] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [goodCount, setGoodCount] = useState(0);
  useEffect(() => {
    firebase
      .firestore()
      .collection("exercise")
      .doc(exerciseId)
      .get()
      .then((snapshot) => {
        setIsGood(
          snapshot.data()?.good.includes(firebase.auth().currentUser?.uid)
        );
        setGoodCount(snapshot.data()?.good.length);
        setLoaded(true);
      });
  }, [exerciseId, goodClick]);
  return { isGood, loaded, goodCount };
};
