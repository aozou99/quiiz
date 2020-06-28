import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";
import { useMemo, useState, useEffect } from "react";
import imageUrl from "utils/helper/imageUrl";

export const useFetchFirstDocuments = () => {
  const [firstDocuments, setFirstDocuments] = useState<any>();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    firebase
      .functions()
      .httpsCallable("pagingExercise")()
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
  }, [uri]);

  return { imgSrc, loaded };
};
