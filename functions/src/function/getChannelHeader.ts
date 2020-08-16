import functions from "../core/functions";
import admin from "../core/admin";
import { HttpsError } from "firebase-functions/lib/providers/https";
import { getCounter } from "../helper/counter";

module.exports = functions.https.onCall(async (data, _context) => {
  if (!data.channelId) {
    throw new HttpsError("invalid-argument", "channelId is required");
  }

  const [user, subscribedCount] = await Promise.all([
    admin.auth().getUser(data.channelId),
    getCounter(
      admin
        .firestore()
        .collection("users")
        .doc(data.channelId)
        .collection("counters")
        .doc("subscribedUser")
    ),
  ]).catch(() => [undefined, undefined]);

  if (!user) {
    throw new HttpsError("invalid-argument", "Channel Not Found");
  }
  return {
    channelName: user.displayName,
    channelLogo: user.photoURL,
    subscribedCount,
  };
});
