import functions from "../core/functions";
import { HttpsError } from "firebase-functions/lib/providers/https";
import admin from "../core/admin";
const db = admin.firestore();

module.exports = functions.https.onCall(async (data, context) => {
  if (!context.auth || !data.ids)
    throw new HttpsError("invalid-argument", "Invalid Parameter");

  const uid = context.auth.uid;
  const rs = [];
  for (const id of data.ids) {
    const result = db
      .collection("users")
      .doc(uid)
      .collection("quizzes")
      .doc(id)
      .delete()
      .then(() => true)
      .catch(() => false);
    rs.push(result);
  }
  return Promise.all(rs).then((vals) => {
    return { isSuccess: vals.every((val) => val) };
  });
});
