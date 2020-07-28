import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { useState, useEffect } from "react";

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
  if (!userId) {
    userId = firebase.auth().currentUser?.uid;
  }
  useEffect(() => {
    if (!userId) {
      setPlayLists([]);
      setLoaded(true);
      return;
    }
    playListRef(userId)
      .get()
      .then((snapshot) => {
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
      });
  }, [userId]);

  return { playLists, loaded };
};

export const useCheckList = (quizId: string) => {
  const [checked, setChecked] = useState<number[]>([]);
  const { playLists, loaded } = useFetchPlayLists();
  const [click, setClick] = useState(false);
  useEffect(() => {
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
        setChecked(newChecked);
      });
    }
  }, [loaded, playLists, quizId, click]);
  return { checked, playLists, loaded, update: () => setClick(!click) };
};
