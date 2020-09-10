import firebase from "firebase/app";
import "firebase/functions";

export const functions =
  window.location.hostname === "localhost"
    ? firebase.functions()
    : firebase.app().functions("asia-northeast1");
