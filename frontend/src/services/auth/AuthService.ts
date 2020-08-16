import firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

type AuthArgs = {
  displayName?: string;
  email: string;
  password: string;
};

class AuthService {
  ui!: firebaseui.auth.AuthUI;

  async onAuthStateChanged(callback: (user: firebase.User | null) => any) {
    firebase.auth().onAuthStateChanged(callback);
  }

  async signIn({ email, password }: AuthArgs) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => user.user);
  }

  async signUp({ displayName, email, password }: AuthArgs) {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user.user?.updateProfile({
          displayName,
        });
        return user.user;
      });
  }

  async existDisplayName(displayName: string) {
    const res = await firebase.functions().httpsCallable("existDisplayName")({
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
}

export default new AuthService();
