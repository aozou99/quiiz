import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/auth";
import "firebase/storage";
import { ExerciseFormData } from "Types";
import hash from "object-hash";

const uploadThumbnailPath = "images/exercise/thumbnails/";
const defaultThumbnailPath = "images/default/quiiz-thumbnail.png";

class ExerciseService {
  db: firebase.firestore.CollectionReference = firebase
    .firestore()
    .collection("exercise");
  storageRef: firebase.storage.Reference = firebase.storage().ref();

  async register(formData: ExerciseFormData) {
    let filepath = defaultThumbnailPath;

    // 画像のアップロードを行う
    if (formData.thumbnail) {
      // dataURLをBlobに変換する
      const response = await fetch(formData.thumbnail);
      const userHash = hash({ id: firebase.auth().currentUser?.uid });
      filepath = `${uploadThumbnailPath}${userHash}_${new Date().getTime()}.jpg`;
      // アップロード
      response.blob().then(blob => {
        this.storageRef.child(filepath).put(blob);
      });
    }
    // FireStoreに登録
    return this.db.add({
      ...formData,
      tags: formData.tags?.split(",") || [],
      thumbnail: filepath,
      userId: firebase.auth().currentUser?.uid,
      answerCount: 0,
      correctAnswer: 0,
      limit: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  async delete(exerciseIds: string[]) {
    const res = await firebase.functions().httpsCallable("deleteExercise")({
      ids: exerciseIds
    });
    return res.data.isSuccess;
  }

  async getMyExerciseList({
    orderBy,
    orderDirection,
    format
  }: {
    orderBy?: string;
    orderDirection?: "desc" | "asc";
    format?: (data: any) => any;
  } = {}) {
    const result = await this.db
      .where("userId", "==", firebase.auth().currentUser?.uid)
      .orderBy(orderBy || "createdAt", orderDirection || "desc")
      .get();

    return result.docs.map(doc => (format ? format(doc) : doc));
  }

  onUpdate(callback: () => any) {
    this.db
      .where("userId", "==", firebase.auth().currentUser?.uid)
      .onSnapshot({ includeMetadataChanges: true }, doc => {
        // バックエンドへの書き込みが完了した場合
        if (!doc.metadata.hasPendingWrites) {
          callback();
        }
      });
  }
}

export default new ExerciseService();
