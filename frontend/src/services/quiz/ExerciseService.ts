import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import { ExerciseFormData } from "Types";
import hash from "object-hash";

class ExerciseService {
  db: firebase.firestore.Firestore = firebase.firestore();
  storageRef: firebase.storage.Reference = firebase.storage().ref();

  async register(formData: ExerciseFormData) {
    let filepath = "";

    // 画像のアップロードを行う
    if (formData.thumbnail) {
      // dataURLをBlobに変換する
      const response = await fetch(formData.thumbnail);
      filepath = `images/exercise/thumbnails/${hash({
        id: firebase.auth().currentUser?.uid
      })}_${new Date().getTime()}.jpg`;
      // アップロード
      response.blob().then(blob => {
        this.storageRef.child(filepath).put(blob);
      });
    }
    // FireStoreに登録
    return this.db.collection("exercise").add({
      ...formData,
      tags: formData.tags?.split(",") || [],
      thumbnail: filepath,
      userId: firebase.auth().currentUser?.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

export default new ExerciseService();
