import admin from "../core/admin";
import { QueryDocumentSnapshot } from "firebase-functions/lib/providers/firestore";

const db = admin.firestore();
const nGram = require("n-gram");

export const updateSearchTokenMap = (
  userId: string,
  quiz: any,
  quizDoc: QueryDocumentSnapshot
) => {
  const searchTokenMap: { [key: string]: boolean } = {};
  return db
    .collection("users")
    .doc(userId)
    .get()
    .then((userSnapshot) => {
      [quiz.question, userSnapshot.data()?.displayName, ...quiz.tags].forEach(
        (word) => {
          if (!word) return;
          nGram.bigram(word).forEach((part: string) => {
            searchTokenMap[part] = true;
          });
        }
      );
      return quizDoc.ref.update({
        searchTokenMap,
      });
    })
    .catch((e) => console.error(e));
};
