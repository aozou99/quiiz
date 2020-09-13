import functions from "../core/functions";
import admin from "../core/admin";
import { HttpsError } from "firebase-functions/lib/providers/https";
import { getCounter } from "../helper/counter";

module.exports = functions.https.onCall(async (_data, context) => {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "login required");
  }

  return admin
    .firestore()
    .collection("users")
    .doc(context.auth.uid)
    .collection("subscribedChannel")
    .get()
    .then((snapshot) =>
      Promise.all(
        snapshot.docs.map((doc) =>
          Promise.all([
            admin.auth().getUser(doc.id),
            admin.firestore().collection("users").doc(doc.id).get(),
            getCounter(
              admin
                .firestore()
                .collection("users")
                .doc(doc.id)
                .collection("counters")
                .doc("subscribedUser")
            ),
          ]).then(([user, userDoc, subscribedCount]) => {
            return {
              id: user.uid,
              channelName: user.displayName,
              channelLogo: user.photoURL,
              hasQuizCount: userDoc?.data()?.hasQuizCount || 0,
              subscribedCount,
            };
          })
        )
      )
    );
});
