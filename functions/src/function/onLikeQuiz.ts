import functions from "../core/functions";
import admin from "../core/admin";
import { createCounter, incrementCounter } from "../helper/counter";

module.exports = functions.firestore
  .document("users/{authorId}/quizzes/{quizId}/likedUsers/{userId}")
  .onCreate(async (_snapshot, context) => {
    const counterRef = admin
      .firestore()
      .collection("users")
      .doc(context.params.authorId)
      .collection("quizzes")
      .doc(context.params.quizId)
      .collection("counters")
      .doc("likedUsers");

    let counterDoc = await counterRef.get();
    if (!counterDoc.exists) {
      await createCounter(counterRef, 10);
      counterDoc = await counterRef.get();
    }
    incrementCounter(
      counterRef,
      counterDoc.data()?.numShards || 10
    ).catch((e) => console.error(e));
  });
