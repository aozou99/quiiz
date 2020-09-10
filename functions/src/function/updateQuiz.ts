import functions from "../core/functions";
import { HttpsError } from "firebase-functions/lib/providers/https";
import deleteThumbnail from "../helper/deleteThumbnail";
import admin from "../core/admin";
import { firestore } from "firebase-admin";
const db = admin.firestore();

module.exports = functions.https.onCall(async (data, context) => {
  if (!context.auth || !data.docId)
    throw new HttpsError("invalid-argument", "Invalid Parameter");
  return db
    .collection("users")
    .doc(context.auth.uid)
    .collection("quizzes")
    .doc(data.docId)
    .get()
    .then(async (doc) => {
      const oldData = doc.data();
      // サムネの更新があったら、古いサムネを削除する
      if (
        data.thumbnailUpdate &&
        oldData?.thumbnail &&
        oldData.thumbnail !== data.thumbnail
      ) {
        deleteThumbnail(oldData.thumbnail)?.catch((e) => console.error(e));
      }
      await doc.ref.update(
        {
          ...data.postData,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return { isSuccess: true };
    });
});
