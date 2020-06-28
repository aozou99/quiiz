import * as functions from "firebase-functions";
import { HttpsError } from "firebase-functions/lib/providers/https";
import deleteThumbnail from "../helper/deleteThumbnail";
import admin from "../core/admin";
const db = admin.firestore();

module.exports = functions.https.onCall(async (data, context) => {
  if (!data.docId)
    throw new HttpsError("invalid-argument", "Invalid Parameter");
  return db
    .collection("exercise")
    .doc(data.docId)
    .get()
    .then((doc) => {
      if (doc.data()?.userId !== context.auth?.uid) {
        throw new HttpsError(
          "permission-denied",
          "Cannot Update Someone's Exercise"
        );
      }
      const oldData = doc.data();
      // サムネの更新があったら、古いサムネを削除する
      if (
        data.thumbnailUpdate &&
        oldData?.thumbnail &&
        oldData.thumbnail !== data.thumbnail
      ) {
        try {
          deleteThumbnail(oldData.thumbnail);
        } catch (error) {
          console.log(error);
          return { isSuccess: false };
        }
      }
      return doc.ref.update(data.postData, { merge: true }).then(() => {
        return { isSuccess: true };
      });
    });
});
