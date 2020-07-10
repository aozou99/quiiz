import functions from "../core/functions";
import deleteThumbnail from "../helper/deleteThumbnail";

module.exports = functions.firestore
  .document("users/{userID}/quizzes/{quizID}")
  .onDelete((snapshot, _context) => {
    const thumbnail: string = snapshot.data()?.thumbnail;
    return deleteThumbnail(thumbnail);
  });
