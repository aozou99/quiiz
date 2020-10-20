import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import Service from "services/Service";
const db = firebase.firestore();

type Notification = {
  Mail: {
    whenLiked: boolean;
    whenNewPost: boolean;
  };
};

class NotificationService extends Service {
  async updateMailSettings(setting: Notification["Mail"]) {
    const user = this.logInUserOrFailed();
    return db
      .collection("users")
      .doc(user.uid)
      .update({
        "notification.mail": setting,
      });
  }
}

export default new NotificationService();
