import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import Service from "services/Service";
import Jimp from "jimp";
import { functions } from "utils/firebase/functions";

type AuthArgs = {
  displayName?: string;
  email: string;
  password: string;
};
const db = firebase.firestore();
firebase.auth().languageCode = "ja";

class AuthService extends Service {
  ui!: firebaseui.auth.AuthUI;

  async updateQuiizAuth(
    model: Partial<{
      description: string;
      twitterAccount: string;
      mySiteUrl: string;
    }>
  ) {
    const user = this.logInUserOrFailed();
    return db
      .collection("users")
      .doc(user.uid)
      .update({
        ...model,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  }

  async signIn({ email, password }: AuthArgs) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => user.user);
  }

  async signUp({ displayName, email, password }: AuthArgs) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        user.user?.updateProfile({
          displayName,
        });
        return user.user;
      });
  }

  async existDisplayName(displayName: string) {
    const res = await functions.httpsCallable("existDisplayName")({
      displayName,
    });
    return res.data.isExist;
  }

  createFirebaseUI() {
    if (!this.ui) {
      this.ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    this.ui.start("#firebaseui-auth-container", {
      signInOptions: [
        // List of OAuth providers supported.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      signInFlow: "popup",
      signInSuccessUrl: "/",
    });
  }

  signOut() {
    return firebase.auth().signOut();
  }

  async updatePhotoUrl(
    imageUrl: string,
    onProgress?: (snapshot: firebase.storage.UploadTaskSnapshot) => void,
    onCompleted?: () => void
  ) {
    const user = this.logInUserOrFailed();
    const imagePath = `images/user-profile/${user.uid}.jpg`;
    const userProfileStorage = firebase.app().storage("gs://quiiz-b06ee");
    const storageRef = userProfileStorage.ref(imagePath);
    const jimpImg = await Jimp.read(imageUrl);
    const resizedImgUrl = await jimpImg
      .resize(512, 512)
      .quality(100)
      .getBase64Async(Jimp.MIME_JPEG);

    // dataURLをBlobに変換する
    const response = await fetch(resizedImgUrl);
    // アップロード
    response.blob().then(blob => {
      const task = storageRef.put(blob);
      task.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        onProgress || null,
        null,
        () => {
          storageRef.getDownloadURL().then(url => {
            Promise.all([
              user.updateProfile({
                photoURL: `https://storage.googleapis.com/quiiz-b06ee/${imagePath}?${new Date().getTime()}`,
              }),
              this.userRef.doc(user.uid).update({
                photoPath: imagePath,
                photoVersion: new Date().getTime(),
              }),
            ]).then(() => {
              onCompleted && onCompleted();
            });
          });
        }
      );
    });
  }

  reAuthenticate(email: string, password: string) {
    const credential = firebase.auth.EmailAuthProvider.credential(
      email,
      password
    );

    return firebase
      ?.auth()
      ?.currentUser?.reauthenticateWithCredential(credential);
  }
}

export default new AuthService();
