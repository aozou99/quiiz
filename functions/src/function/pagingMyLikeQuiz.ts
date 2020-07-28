import functions from "../core/functions";
import admin from "../core/admin";
import imgUrl from "../helper/imageUrl";

const db = admin.firestore();

module.exports = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return;
  }
  const uid = context.auth.uid;
  const baseQuery = db
    .collection("users")
    .doc(uid)
    .collection("likedQuizzes")
    .orderBy("createdAt")
    .limit(8);

  if (data && data.date) {
    baseQuery.startAfter(data.date);
  }

  const snapshot = await baseQuery.get();

  const convertBeforeLikedQuiz = snapshot.docs.map((likedQuiz) => {
    return likedQuiz.data().quizRef.get();
  });
  const after = await Promise.all(convertBeforeLikedQuiz);
  const rs = after.map(async (quiz) => {
    const quizData = quiz.data();
    if (!quizData) {
      return;
    }
    const [user, url256, url640] = await Promise.all([
      admin.auth().getUser(quizData.authorId),
      imgUrl(quizData.thumbnail, "256x144"),
      imgUrl(quizData.thumbnail, "640x360"),
    ]);
    return {
      ...quizData,
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
