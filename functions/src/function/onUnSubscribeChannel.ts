import functions from "../core/functions";
import admin from "../core/admin";
import { incrementCounter } from "../helper/counter";

module.exports = functions.firestore
  .document("users/{channelId}/subscribedUser/{userId}")
  .onDelete(async (_snapshot, context) => {
    const counterRef = admin
      .firestore()
      .collection("users")
      .doc(context.params.channelId)
      .collection("counters")
      .doc("subscribedUser");

    let counterDoc = await counterRef.get();
    if (counterDoc.exists) {
      incrementCounter(counterRef, counterDoc.data()?.numShards || 10, -1);
    }
  });
