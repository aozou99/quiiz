import firebase from "firebase/app";
import "firebase/firestore";
import { getCounter } from "utils/helper/counter";
import AuthService from "services/auth/AuthService";

const db = firebase.firestore();

export const getChannelHeader = async (data: any) => {
  const [user, subscribedCount] = await Promise.all([
    AuthService.userRef.doc(data.channelId).get(),
    getCounter(
      db
        .collection("users")
        .doc(data.channelId)
        .collection("counters")
        .doc("subscribedUser")
    ),
  ]).catch(() => [undefined, undefined]);

  return {
    channelName: user?.data()?.displayName,
    channelLogo: user?.data()?.photoUrl,
    subscribedCount,
  };
};
