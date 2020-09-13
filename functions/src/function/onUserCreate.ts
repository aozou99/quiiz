import functions from "../core/functions";
import admin from "../core/admin";

module.exports = functions.auth.user().onCreate((user) => {
  const userRef = admin.firestore().collection("users").doc(user.uid);
  userRef
    .set({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      likeQuizCount: 0,
      photoUrl: user.photoURL,
      displayName: user.displayName,
    })
    .then(() => console.log("success update"))
    .catch((e) => console.error(e));
});
