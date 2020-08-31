import functions from "../core/functions";
import admin from "../core/admin";

module.exports = functions.firestore
  .document("users/{userId}/playLists/{playListId}")
  .onDelete(async (playListSnapshot) => {
    let batch = admin.firestore().batch();
    let count = 0;
    const quizzesSnapshot = await playListSnapshot.ref
      .collection("playListQuiz")
      .get();

    quizzesSnapshot.docs.forEach((quizSnapshot) => {
      batch.delete(quizSnapshot.ref);
      count++;
      if (count === 500) {
        batch.commit().catch((e) => {
          console.error(e);
        });
        batch = admin.firestore().batch();
      }
    });
    batch.commit().catch((e) => {
      console.error(e);
    });
  });
