import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/auth";
import "firebase/storage";

class Service {
  userRef = firebase.firestore().collection("users");
  storageRef = firebase.storage().ref();

  public currentUser() {
    return firebase.auth().currentUser;
  }

  public logInUserOrFailed() {
    const user = this.currentUser();
    if (!user) {
      throw new Error("Please Log in your account");
    }
    return user;
  }
}

export default Service;
