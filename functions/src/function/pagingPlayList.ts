import functions from "../core/functions";
import admin from "../core/admin";
import imgUrl from "../helper/imageUrl";
import { PRIVACY } from "../costant/InputConst";
import { HttpsError } from "firebase-functions/lib/providers/https";

const db = admin.firestore();
const defaultThumbnailPath = "images/default/quiiz-thumbnail.png";

module.exports = functions.https.onCall(async (data, context) => {
  const uid = data?.channelId || context.auth?.uid;
  if (!uid) {
    throw new HttpsError("invalid-argument", "Invalid Parameter");
  }
  const isMine =
    !data?.channelId ||
    (data?.channelId && data?.channelId === context.auth?.uid);
  let baseQuery = db
    .collection("users")
    .doc(uid)
    .collection("playLists")
    .orderBy("updatedAt");

  if (!isMine) {
    baseQuery = baseQuery.where("privacy", "==", PRIVACY.PUBLIC);
  }
  baseQuery = baseQuery.limit(8);

  if (data?.date) {
    baseQuery = baseQuery.startAfter(data.date);
  }

  const snapshot = await baseQuery.get();

  const rs = snapshot.docs.map(async (playList) => {
    const playListData = playList.data();
    let thumbnail = defaultThumbnailPath;
    if (playListData.quizCount > 0) {
      const playListSnapshot = await playList.ref
        .collection("playListQuiz")
        .orderBy("createdAt", "desc")
        .get();
      const quizSnapShot = await playListSnapshot.docs[0].data().quizRef.get();
      thumbnail = quizSnapShot.data().thumbnail;
    }

    return {
      id: playList.id,
      ...playListData,
      thumbnail: {
        "256x144": await imgUrl(thumbnail, "256x144"),
        "640x360": await imgUrl(thumbnail, "256x144"),
      },
    };
  });

  return Promise.all(rs);
});
