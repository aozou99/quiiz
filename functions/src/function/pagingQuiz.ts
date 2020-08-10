import functions from "../core/functions";
import admin from "../core/admin";
import convertQuizResponse from "../helper/convertQuizResponse";

const db = admin.firestore();

module.exports = functions.https.onCall(async (data, _context) => {
  const baseQuery = db.collectionGroup("quizzes").orderBy("createdAt").limit(8);
  if (data && data.date) {
    baseQuery.startAfter(data.date);
  }

  const snapshot = await baseQuery.get();
  const rs = snapshot.docs.map(convertQuizResponse);

  return Promise.all(rs);
});
