import * as functions from "firebase-functions";
import admin from "../core/admin";
import imgUrl from "../helper/imageUrl";

const db = admin.firestore();

module.exports = functions.https.onCall(async (data, _context) => {
  const baseQuery = db.collection("exercise").orderBy("createdAt").limit(8);

  if (data && data.date) {
    baseQuery.startAfter(data.date);
  }

  const snapshot = await baseQuery.get();

  const rs = snapshot.docs.map(async (exercise) => {
    const [user, url256, url640] = await Promise.all([
      admin.auth().getUser(exercise.data().userId),
      imgUrl(exercise.data().thumbnail, "256x144"),
      imgUrl(exercise.data().thumbnail, "640x360"),
    ]);
    return {
      id: exercise.id,
      ...exercise.data(),
      thumbnail: {
        "256x144": url256,
        "640x360": url640,
      },
      authorName: user?.displayName,
      authorImageUrl: user?.photoURL,
    };
  });

  return Promise.all(rs);
});
