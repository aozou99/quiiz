import firebase from "firebase/app";
import "firebase/firestore";
import { convertQuizResponse } from "services/quiz/convertQuizResponse";

const db = firebase.firestore();

const genBaseQuery = async (uid: string, params: any, lastLikedQuiz?: any) => {
  let baseQuery = db
    .collection("users")
    .doc(uid)
    .collection("likedQuizzes")
    .orderBy("createdAt");

  if (lastLikedQuiz) {
    baseQuery = baseQuery.startAfter(lastLikedQuiz);
  }

  if (!lastLikedQuiz && params?.lastLikeId) {
    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("likedQuizzes")
      .doc(params.lastLikeId)
      .get();
    baseQuery = baseQuery.startAfter(snapshot);
  }

  return baseQuery.limit(params?.perCount || 4);
};

export const pagingMyLikeQuiz = async (uid: string, data: any) => {
  const snapshot = await genBaseQuery(uid, data).then((doc) => doc.get());
  if (snapshot.size < 1) {
    return {
      quizzes: [],
      hasNext: false,
    };
  }

  const hasNext = genBaseQuery(
    uid,
    data,
    snapshot.docs[snapshot.size - 1]
  ).then((query) => query.get().then((next) => next.size > 0));

  const convertBeforeLikedQuiz = snapshot.docs.map((likedQuiz) => {
    return likedQuiz.data().quizRef.get();
  });
  const after = await Promise.all(convertBeforeLikedQuiz);
  const rs = after.map(convertQuizResponse);

  return {
    quizzes: await Promise.all(rs),
    hasNext: await hasNext,
  };
};
