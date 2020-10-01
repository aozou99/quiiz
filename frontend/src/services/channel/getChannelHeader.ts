import firebase from "firebase/app";
import "firebase/firestore";
import { getCounter } from "utils/helper/counter";
import AuthService from "services/auth/AuthService";
import { userProfileImgUrl } from "utils/helper/imageUrl";

const db = firebase.firestore();

export const getChannelHeader = async (data: any) => {
  return await Promise.all([
    AuthService.userRef.doc(data.channelId).get(),
    getCounter(
      db
        .collection("users")
        .doc(data.channelId)
        .collection("counters")
        .doc("subscribedUser")
    ),
  ]).then(([user, subscribedCount]) => {
    if (!user.exists) {
      throw new Error("User Not Found");
    }
    return {
      channelName: user?.data()?.displayName,
      channelLogo: userProfileImgUrl(
        user?.data()?.photoPath,
        user?.data()?.photoVersion,
        "512x512"
      ),
      subscribedCount,
    };
  });
};
