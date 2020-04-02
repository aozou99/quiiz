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
      filepath = this.genThumbnailPath();
      // dataURLをBlobに変換する
      this.uploadThumbnail(formData.thumbnail, filepath);
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

  async update(
    docId: string,
    thumbnailUpdate: boolean,
    formData: ExerciseFormData
  ) {
    const postData = {
      ...formData,
      tags: formData.tags?.split(",") || [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // 新規サムネのパスを設定する
    if (thumbnailUpdate && formData.thumbnail) {
      postData.thumbnail = this.genThumbnailPath();
    }

    const res = await firebase.functions().httpsCallable("updateExercise")({
      docId,
      thumbnailUpdate,
      postData
    });

    // サムネのアップロード & 更新が成功した場合
    if (formData.thumbnail && postData.thumbnail && res.data.isSuccess) {
      this.uploadThumbnail(formData.thumbnail, postData.thumbnail);
    }

    return true;
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

  private async uploadThumbnail(orgUrl: string, uploadPath: string) {
    // dataURLをBlobに変換する
    const response = await fetch(orgUrl);
    // アップロード
    response.blob().then(blob => {
      this.storageRef.child(uploadPath).put(blob);
    });
  }

  private genThumbnailPath() {
    const userHash = hash({ id: firebase.auth().currentUser?.uid });
    return `${uploadThumbnailPath}${userHash}_${new Date().getTime()}.jpg`;
  }
}

export default new ExerciseService();
