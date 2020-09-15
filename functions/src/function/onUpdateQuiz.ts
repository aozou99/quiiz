import functions from "../core/functions";
import { updateSearchTokenMap } from "../helper/updateSearchTokenMap";

module.exports = functions.firestore
  .document("users/{userId}/quizzes/{quizId}")
  .onUpdate((snapshot, context) => {
    const beforeData = snapshot.before.data();
    const afterData = snapshot.after.data();
    if (
      beforeData.question === afterData.question &&
      beforeData.tags.toString() === afterData.tags.toString() &&
      afterData.searchTokenMap
    )
      return true;
    return updateSearchTokenMap(
      context.params.userId,
      afterData,
      snapshot.after
    );
  });
