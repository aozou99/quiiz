import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import searchDisplayName from "./helper/searchDisplayName";
import { HttpsError } from "firebase-functions/lib/providers/https";
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage();

const exerciseThumbnailDir = "images/exercise/thumbnails/";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const existDisplayName = functions.https.onCall(
  async (data, _context) => {
    return {
      isExist: await searchDisplayName(data.displayName, undefined)
    };
  }
);

export const deleteExercise = functions.https.onCall(async (data, context) => {
  if (!data.ids) throw new HttpsError("invalid-argument", "Invalid Parameter");
  const rs = [];
  for (const id of data.ids) {
    const result = db
      .collection("exercise")
      .doc(id)
      .get()
      .then(doc => {
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
  return Promise.all(rs).then(vals => {
    return { isSuccess: vals.every(val => val) };
  });
});

export const autoDeleteExerciseThumbnails = functions.firestore
  .document("exercise/{doc}")
  .onDelete((snapshot, _context) => {
    const thumbnail: string = snapshot.data()?.thumbnail;
    if (!thumbnail || !thumbnail.match(exerciseThumbnailDir))
      return console.log({
        message: `${thumbnail} is not delete target!`
      });
    const splited = thumbnail.split(".");
    // imagedir/userId_timestamp.ext -> imagedir/userId_timestamp, ext
    if (splited.length !== 2)
      return console.log({
        message: `because ivalid path format, not delete file: ${splited}`
      });
    return storage.bucket().deleteFiles({
      prefix: `${splited[0]}`
    });
  });
