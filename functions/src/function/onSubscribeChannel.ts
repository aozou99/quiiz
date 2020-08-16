import functions from "../core/functions";
import admin from "../core/admin";
import { createCounter, incrementCounter } from "../helper/counter";

module.exports = functions.firestore
  .document("users/{channelId}/subscribedUser/{userId}")
  .onCreate(async (_snapshot, context) => {
    const counterRef = admin
      .firestore()
      .collection("users")
      .doc(context.params.channelId)
      .collection("counters")
      .doc("subscribedUser");

    let counterDoc = await counterRef.get();
    if (!counterDoc.exists) {
      await createCounter(counterRef, 10);
      counterDoc = await counterRef.get();
    }
    incrementCounter(counterRef, counterDoc.data()?.numShards || 10);
  });
