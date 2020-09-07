import functions from "../core/functions";
import admin from "../core/admin";
import imgUrl from "../helper/imageUrl";

const db = admin.firestore();
const genBaseQuery = async (uid: string, params: any, lastLikedQuiz?: any) => {
  let baseQuery = db
    .collection("users")
    .doc(uid)
    .collection("likedQuizzes")
    .orderBy("createdAt");

  if (lastLikedQuiz) {
    baseQuery = baseQuery.startAfter(lastLikedQuiz);
  }

  if (!lastLikedQuiz && params?.lastLikeId) {
    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("likedQuizzes")
      .doc(params.lastLikeId)
      .get();
    baseQuery = baseQuery.startAfter(snapshot);
  }

  return baseQuery.limit(params?.perCount || 4);
};

module.exports = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    return;
  }

  const snapshot = await genBaseQuery(context.auth.uid, data).then((doc) =>
    doc.get()
  );
  if (snapshot.size < 1) {
    return {
      quizzes: [],
      hasNext: false,
    };
  }

  const hasNext = genBaseQuery(
    context.auth.uid,
    data,
    snapshot.docs[snapshot.size - 1]
  ).then((query) => query.get().then((next) => next.size > 0));

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

  return {
    quizzes: await Promise.all(rs),
    hasNext: await hasNext,
  };
});
