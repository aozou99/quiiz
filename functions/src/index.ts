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
  if (!data.id) throw new HttpsError("invalid-argument", "Invalid Parameter");
  const docRef = db.collection("exercise").doc(data.id);
  return docRef.get().then(async doc => {
    console.log({ postData: data, docData: doc, contextAuth: context.auth });
    if (!(doc.data()?.userId === context.auth?.uid))
      throw new HttpsError(
        "permission-denied",
        "Cannot Delete Someone's Exercise"
      );
    await docRef.delete();
    return { isSuccess: true };
  });
});

export const autoDeleteExerciseThumbnails = functions.firestore
  .document("exercise/{doc}")
  .onDelete((snapshot, _context) => {
    const thumbnail: string = snapshot.data()?.thumbnail;
    if (!thumbnail || !thumbnail.match(exerciseThumbnailDir)) return;
    const splited = thumbnail.split("_");
    // imagedir/userId_timestamp_size.ext -> imagedir/userId,timestamp,size.ext
    if (splited.length !== 3) return;
    storage.bucket().deleteFiles({
      prefix: `${splited[0]}_${splited[1]}`
    });
  });
