import { pagingQuizApiOptions } from "types/apiOptions";
import firebase from "firebase/app";
import "firebase/firestore";
import { PRIVACY } from "utils/costant/InputConst";
import { convertQuizResponse } from "services/quiz/convertQuizResponse";

const EMPTY_RESPONSE = {
  quizzes: [],
  hasNext: false,
  nextQuiz: null,
};
const DEFAULT_COUNT = 16;

const db = firebase.firestore();

const genBaseQuery = async (data: Partial<pagingQuizApiOptions>) => {
  let baseQuery: firebase.firestore.Query<firebase.firestore.DocumentData>;
  // collection
  if (data.channelId) {
    baseQuery = db
      .collection("users")
      .doc(data.channelId)
      .collection("quizzes");
  } else {
    baseQuery = db.collectionGroup("quizzes");
  }

  // where
  // baseQuery = baseQuery.where("privacy", "==", PRIVACY.PUBLIC);
  if (data.where) {
    Object.entries(data.where).forEach(([field, condition]) => {
      baseQuery = baseQuery.where(field, condition.operator, condition.value);
    });
  }

  // orderBy
  if (data.order) {
    Object.entries(data.order).forEach(([field, direction]) => {
      baseQuery = baseQuery.orderBy(field, direction);
    });
  } else {
    baseQuery = baseQuery.orderBy("createdAt", "desc");
  }

  if (data && data.nextQuiz) {
    baseQuery = baseQuery.startAfter(data.nextQuiz);
  }

  return baseQuery.limit((data.perCount || DEFAULT_COUNT) + 1);
};

export const pagingQuiz = async (data: pagingQuizApiOptions) => {
  if (data.noExecute) return EMPTY_RESPONSE;

  const snapshot = await genBaseQuery(data).then((doc) => doc.get());

  if (snapshot.size < 1) return EMPTY_RESPONSE;
  let hasNext = false;
  let nextQuiz = null;
  const quizDocs = snapshot.docs;
  if (snapshot.size > (data.perCount || DEFAULT_COUNT)) {
    hasNext = true;
    quizDocs.pop();
    nextQuiz = quizDocs[(data.perCount || DEFAULT_COUNT) - 1];
  }

  const rs = quizDocs.map(convertQuizResponse);

  return {
    quizzes: await Promise.all(rs),
    hasNext: hasNext,
    nextQuiz,
  };
};
