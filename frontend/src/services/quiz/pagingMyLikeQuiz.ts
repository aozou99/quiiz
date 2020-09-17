import firebase from "firebase/app";
import "firebase/firestore";
import { convertQuizResponse } from "services/quiz/convertQuizResponse";

const db = firebase.firestore();
const EMPTY_RESPONSE = {
  quizzes: [],
  hasNext: false,
  nextLikeQuiz: null,
};
const DEFAULT_COUNT = 4;

const genBaseQuery = async (uid: string, params: any) => {
  let baseQuery = db
    .collection("users")
    .doc(uid)
    .collection("likedQuizzes")
    .orderBy("createdAt", "desc");

  if (params.nextLikeQuiz) {
    baseQuery = baseQuery.startAfter(params.nextLikeQuiz);
  }

  return baseQuery.limit((params.perCount || DEFAULT_COUNT) + 1);
};

export const pagingMyLikeQuiz = async (uid: string, data: any) => {
  const snapshot = await genBaseQuery(uid, data).then((doc) => doc.get());
  if (snapshot.size < 1) {
    return EMPTY_RESPONSE;
  }

  let hasNext = false;
  let nextLikeQuiz = null;
  const likeQuizDocs = snapshot.docs;
  if (snapshot.size > (data.perCount || DEFAULT_COUNT)) {
    hasNext = true;
    likeQuizDocs.pop();
    nextLikeQuiz = likeQuizDocs[(data.perCount || DEFAULT_COUNT) - 1];
  }

  const convertBeforeLikedQuiz = likeQuizDocs.map((likedQuiz) => {
    return likedQuiz.data().quizRef.get();
  });
  const after = await Promise.all(convertBeforeLikedQuiz);
  const rs = after.map(convertQuizResponse);

  return {
    quizzes: await Promise.all(rs),
    hasNext: hasNext,
    nextLikeQuiz,
  };
};
