import functions from "../core/functions";
import admin from "../core/admin";
import convertQuizResponse from "../helper/convertQuizResponse";
import { PRIVACY } from "../costant/InputConst";

const db = admin.firestore();
const genBaseQuery = async (data: {
  channelId: string;
  lastQuizId: string;
}) => {
  let baseQuery;
  if (data?.channelId) {
    baseQuery = db
      .collection("users")
      .doc(data.channelId)
      .collection("quizzes")
      .where("privacy", "==", PRIVACY.PUBLIC)
      .orderBy("createdAt", "asc");
  } else {
    baseQuery = db
      .collectionGroup("quizzes")
      .where("privacy", "==", PRIVACY.PUBLIC)
      .orderBy("createdAt", "asc");
  }

  if (data && data.lastQuizId) {
    const snapshot = await db
      .collectionGroup("quizzes")
      .where("id", "==", data.lastQuizId)
      .get();
    baseQuery = baseQuery.startAfter(snapshot.docs[0]);
  }

  return baseQuery.limit(16);
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
