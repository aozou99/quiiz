import * as functions from "firebase-functions";
import deleteThumbnail from "../helper/deleteThumbnail";

module.exports = functions.firestore
  .document("users/{userID}/quizzes/{quizID}")
  .onDelete((snapshot, _context) => {
    const thumbnail: string = snapshot.data()?.thumbnail;
    return deleteThumbnail(thumbnail);
  });
