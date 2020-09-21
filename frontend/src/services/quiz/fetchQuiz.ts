import firebase from "firebase/app";
import "firebase/firestore";
import { convertQuizResponse } from "services/quiz/convertQuizResponse";
const db = firebase.firestore();

export const fetchQuiz = (id: string) => {
  return db
    .collectionGroup("quizzes")
    .where("id", "==", id)
    .get()
    .then((snapshot) => {
      if (snapshot.size < 1) {
        throw new Error(`Not Found Quiz: id is ${id}`);
      }
      return convertQuizResponse(snapshot.docs[0]);
    });
};
