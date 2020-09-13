import firebase from "firebase/app";
import "firebase/firestore";
import { getCounter } from "utils/helper/counter";
import AuthService from "services/auth/AuthService";

const db = firebase.firestore();

export const getSubscribeChannels = async (uid: string) => {
  const snapshot = await db
    .collection("users")
    .doc(uid)
    .collection("subscribedChannel")
    .get();
  return await Promise.all(
    snapshot.docs.map((doc) =>
      Promise.all([
        AuthService.userRef.doc(doc.id).get(),
        db
          .collection("users")
          .doc(doc.id)
          .get(),
        getCounter(
          db
            .collection("users")
            .doc(doc.id)
            .collection("counters")
            .doc("subscribedUser")
        ),
      ]).then(([user, userDoc, subscribedCount]) => {
        return {
          id: doc.id,
          channelName: user?.data()?.displayName,
          channelLogo: user?.data()?.photoUrl,
          hasQuizCount: userDoc?.data()?.hasQuizCount || 0,
          subscribedCount,
        };
      })
    )
  );
};
