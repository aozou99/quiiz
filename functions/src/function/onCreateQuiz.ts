import functions from "../core/functions";
import { updateHasQuizCount } from "../helper/updateHasQuizCount";
import { updateSearchTokenMap } from "../helper/updateSearchTokenMap";

module.exports = functions.firestore
  .document("users/{userId}/quizzes/{quizId}")
  .onCreate((snapshot, context) => {
    return Promise.all([
      updateHasQuizCount(context.params.userId),
      updateSearchTokenMap(context.params.userId, snapshot.data(), snapshot),
    ]).catch((e) => console.error(e));
  });
