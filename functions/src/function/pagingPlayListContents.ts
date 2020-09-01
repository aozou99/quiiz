import functions from "../core/functions";
import admin from "../core/admin";
import convertQuizResponse from "../helper/convertQuizResponse";
import { PRIVACY } from "../costant/InputConst";

const db = admin.firestore();

module.exports = functions.https.onCall(async (data, context) => {
  const playLists = await db
    .collectionGroup("playLists")
    .where("id", "==", data.id)
    .get();

  if (playLists.size === 0) {
    return {
      error: {
        status: "NotFoundPlayList",
        message: "The playlist for the specified id did not exist",
      },
    };
  }

  if (playLists.size > 1) {
    console.log("There are multiple playlists with the same id", data.id);
  }

  const playList = playLists.docs[0];
  const isMine = playList.data().authorId === context.auth?.uid;
  if (!isMine && playList.data().privacy === PRIVACY.PRIVATE) {
    return {
      error: {
        status: "PrivatePlayList",
        message: "This playlist is closed to the public and cannot be viewed.",
      },
    };
  }
  let baseQuery = playList.ref
    .collection("playListQuiz")
    .orderBy("createdAt", "desc");

  if (data && data.date) {
    baseQuery = baseQuery.startAfter(data.date);
  }

  const snapshot = await baseQuery.get();
  const quizzes = await Promise.all(
    snapshot.docs.map(async (quizSummary) => {
      return await quizSummary.data().quizRef.get();
    })
  );

  return {
    playList: playList.data(),
    quizzes: await Promise.all(quizzes.map(convertQuizResponse)),
  };
});
