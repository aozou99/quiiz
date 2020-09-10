import functions from "../core/functions";
import { updateHasQuizCount } from "../helper/updateHasQuizCount";

module.exports = functions.firestore
  .document("users/{userId}/quizzes/{quizId}")
  .onCreate((_snapshot, context) => updateHasQuizCount(context.params.userId));
