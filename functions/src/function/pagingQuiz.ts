import functions from "../core/functions";
import admin from "../core/admin";
import convertQuizResponse from "../helper/convertQuizResponse";

const db = admin.firestore();

module.exports = functions.https.onCall(async (data, _context) => {
  let baseQuery;
  if (data?.channelId) {
    baseQuery = db
      .collection("users")
      .doc(data.channelId)
      .collection("quizzes")
      .orderBy("createdAt")
      .limit(8);
  } else {
    baseQuery = db.collectionGroup("quizzes").orderBy("createdAt").limit(8);
  }

  if (data && data.date) {
    baseQuery.startAfter(data.date);
  }

  const snapshot = await baseQuery.get();
  const rs = snapshot.docs.map(convertQuizResponse);

  return Promise.all(rs);
});
