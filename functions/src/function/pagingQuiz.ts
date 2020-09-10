import functions from "../core/functions";
import admin from "../core/admin";
import convertQuizResponse from "../helper/convertQuizResponse";
import { PRIVACY } from "../costant/InputConst";
import { pagingQuizApiOptions } from "../types/apiOptions";

const db = admin.firestore();
const genBaseQuery = async (data: Partial<pagingQuizApiOptions>) => {
  let baseQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
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
  baseQuery = baseQuery.where("privacy", "==", PRIVACY.PUBLIC);
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

  if (data && data.lastQuizId) {
    const snapshot = await db
      .collectionGroup("quizzes")
      .where("id", "==", data.lastQuizId)
      .get();
    baseQuery = baseQuery.startAfter(snapshot.docs[0]);
  }

  return baseQuery.limit(data.perCount || 16);
};

module.exports = functions.https.onCall(async (data, _context) => {
  const baseQuery = await genBaseQuery(data);
  const snapshot = await baseQuery.get();
  if (snapshot.size < 1) {
    return {
      quizzes: [],
      hasNext: false,
    };
  }
  const rs = snapshot.docs.map(convertQuizResponse);
  const nextQuery = await genBaseQuery({
    ...data,
    lastQuizId: snapshot.docs[snapshot.size - 1].data().id,
  });
  const hasNext = nextQuery.get().then((next) => {
    return next.size > 0;
  });

  return {
    quizzes: await Promise.all(rs),
    hasNext: await hasNext,
  };
});
