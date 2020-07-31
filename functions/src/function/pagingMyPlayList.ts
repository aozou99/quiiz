import functions from "../core/functions";
import admin from "../core/admin";
import imgUrl from "../helper/imageUrl";

const db = admin.firestore();
const defaultThumbnailPath = "images/default/quiiz-thumbnail.png";

module.exports = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return;
  }
  const uid = context.auth.uid;
  const baseQuery = db
    .collection("users")
    .doc(uid)
    .collection("playLists")
    .orderBy("updatedAt")
    .limit(8);

  if (data && data.date) {
    baseQuery.startAfter(data.date);
  }

  const snapshot = await baseQuery.get();

  const rs = snapshot.docs.map(async (playList) => {
    const playListData = playList.data();
    let thumbnail = defaultThumbnailPath;
    if (playListData.quizCount > 0) {
      const snapshot = await playList.ref.collection("playListQuiz").get();
      const quizSnapShot = await snapshot.docs[0].data().quizRef.get();
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
