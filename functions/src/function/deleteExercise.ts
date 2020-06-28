import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/lib/providers/https";
import admin from "../core/admin";
const db = admin.firestore();

module.exports = functions.https.onCall(async (data, context) => {
  if (!data.ids) throw new HttpsError("invalid-argument", "Invalid Parameter");
  const rs = [];
  for (const id of data.ids) {
    const result = db
      .collection("exercise")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.data()?.userId !== context.auth?.uid) {
          throw new HttpsError(
            "permission-denied",
            "Cannot Delete Someone's Exercise"
          );
        }
        doc.ref.delete();
        return true;
      });
    rs.push(result);
  }
  return Promise.all(rs).then((vals) => {
    return { isSuccess: vals.every((val) => val) };
  });
});
