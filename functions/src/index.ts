import * as functions from "firebase-functions";
import searchDisplayName from "./helper/searchDisplayName";
import { HttpsError } from "firebase-functions/lib/providers/https";
import deleteThumbnail from "./helper/deleteThumbnail";
import admin from "./core/admin";

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const existDisplayName = functions.https.onCall(
  async (data, _context) => {
    return {
      isExist: await searchDisplayName(data.displayName, undefined),
    };
  }
);

export const updateExercise = functions.https.onCall(async (data, context) => {
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

export const deleteExercise = functions.https.onCall(async (data, context) => {
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

export const autoDeleteExerciseThumbnails = functions.firestore
  .document("exercise/{doc}")
  .onDelete((snapshot, _context) => {
    const thumbnail: string = snapshot.data()?.thumbnail;
    return deleteThumbnail(thumbnail);
  });
