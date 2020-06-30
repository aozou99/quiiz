import * as functions from "firebase-functions";
import admin from "../core/admin";

module.exports = functions.auth.user().onCreate((user) => {
  const userRef = admin.firestore().collection("users").doc(user.uid);
  userRef.set({
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    likeQuizCount: 0,
  });
});
