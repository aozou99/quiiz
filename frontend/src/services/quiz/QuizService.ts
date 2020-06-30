import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/auth";
import "firebase/storage";
import { QuizFormData } from "types/QuizTypes";
import hash from "object-hash";

const uploadThumbnailPath = "images/quiz/thumbnails/";
const defaultThumbnailPath = "images/default/quiiz-thumbnail.png";

class QuizService {
  userRef = firebase.firestore().collection("users");
  storageRef = firebase.storage().ref();

  async register(formData: QuizFormData) {
    if (!firebase.auth().currentUser) {
      return;
    }

    let filepath = defaultThumbnailPath;

    // 画像のアップロードを行う
    if (formData.thumbnail) {
      filepath = this.genThumbnailPath();
      // dataURLをBlobに変換する
      this.uploadThumbnail(formData.thumbnail, filepath);
    }

    // FireStoreに登録
    return this.quizzesCollection()
      .doc()
      .set({
        ...formData,
        tags: formData.tags?.split(",") || [],
        thumbnail: filepath,
        authorId: firebase.auth().currentUser?.uid,
        answerCount: 0,
        correctAnswer: 0,
        limit: [],
        likeQuizCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((user) => console.log(user));
  }

  async update(
    docId: string,
    thumbnailUpdate: boolean,
    formData: QuizFormData
  ) {
    const postData = {
      ...formData,
      tags: formData.tags?.split(",") || [],
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // 新規サムネのパスを設定する
    const isUpdate = thumbnailUpdate && formData.thumbnail;
    if (isUpdate) {
      postData.thumbnail = this.genThumbnailPath();
    } else {
      delete postData.thumbnail;
    }

    const res = await firebase.functions().httpsCallable("updateQuiz")({
      docId,
      thumbnailUpdate,
      postData,
    });

    // サムネのアップロード & 更新が成功した場合
    if (formData.thumbnail && postData.thumbnail && res.data.isSuccess) {
      this.uploadThumbnail(formData.thumbnail, postData.thumbnail);
    }

    return true;
  }

  async delete(quizId: string[]) {
    const res = await firebase.functions().httpsCallable("deleteQuiz")({
      ids: quizId,
    });
    return res.data.isSuccess;
  }

  private quizzesCollection() {
    return this.userRef
      .doc(firebase.auth().currentUser?.uid)
      .collection("quizzes");
  }

  async getMyQuizList({
    orderBy,
    orderDirection,
    format,
  }: {
    orderBy?: string;
    orderDirection?: "desc" | "asc";
    format?: (data: any) => any;
  } = {}) {
    const result = await this.quizzesCollection()
      .orderBy(orderBy || "createdAt", orderDirection || "desc")
      .get();

    return result.docs.map((doc) => (format ? format(doc) : doc));
  }

  onUpdate(callback: () => any) {
    this.quizzesCollection().onSnapshot(
      { includeMetadataChanges: true },
      (doc) => {
        // バックエンドへの書き込みが完了した場合
        if (!doc.metadata.hasPendingWrites) {
          callback();
        }
      }
    );
  }

  private async uploadThumbnail(orgUrl: string, uploadPath: string) {
    // dataURLをBlobに変換する
    const response = await fetch(orgUrl);
    // アップロード
    response.blob().then((blob) => {
      this.storageRef.child(uploadPath).put(blob);
    });
  }

  private genThumbnailPath() {
    const userHash = hash({ id: firebase.auth().currentUser?.uid });
    return `${uploadThumbnailPath}${userHash}_${new Date().getTime()}.jpg`;
  }

  public goodOrCancel(exerciseId: string, callback: () => void) {
    const uid = firebase.auth().currentUser?.uid;
    if (!uid) return;
    // const docRef = this.db.doc(exerciseId);
    // docRef.get().then((snapshot) => {
    //   const isGood = snapshot.data()?.good.includes(uid);
    //   const fv = firebase.firestore.FieldValue;
    //   docRef
    //     .update({
    //       good: isGood ? fv.arrayRemove(uid) : fv.arrayUnion(uid),
    //     })
    //     .then(() => {
    //       callback();
    //     });
    // });
  }
}

export default new QuizService();
