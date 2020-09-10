import admin from "../core/admin";
const db = admin.firestore();

export const updateHasQuizCount = (userId: string) => {
  return db
    .collection("users")
    .doc(userId)
    .collection("quizzes")
    .get()
    .then((snapshot) =>
      db.collection("users").doc(userId).update("hasQuizCount", snapshot.size)
    );
};
