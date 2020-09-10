import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/auth";
import "firebase/storage";
import { QuizFormData } from "types/QuizTypes";
import hash from "object-hash";
import Service from "services/Service";
import { functions } from "utils/firebase/functions";

const uploadThumbnailPath = "images/quiz/thumbnails/";
const defaultThumbnailPath = "images/default/quiiz-thumbnail.png";

class QuizService extends Service {
  async register(formData: QuizFormData, ogps: any) {
    if (!this.currentUser()) {
      return;
    }

    let filepath = defaultThumbnailPath;

    // 画像のアップロードを行う
    if (formData.thumbnail) {
      filepath = this.genThumbnailPath();
      // dataURLをBlobに変換する
      this.uploadThumbnail(formData.thumbnail, filepath);
    }
    const newDoc = this.quizzesCollection().doc();
    // FireStoreに登録
    return newDoc
      .set({
        ...formData,
        id: newDoc.id,
        tags: formData.tags?.split(",") || [],
        references: ogps || [],
        thumbnail: filepath,
        authorId: firebase.auth().currentUser?.uid,
        answerCount: 0,
        correctAnswer: 0,
        limit: [],
        likeCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((user) => console.log(user));
  }

  async update(
    docId: string,
    thumbnailUpdate: boolean,
    formData: QuizFormData,
    ogps: any
  ) {
    const postData = {
      ...formData,
      tags: formData.tags?.split(",") || [],
      references: ogps || [],
    };
    // 新規サムネのパスを設定する
    const isUpdate = !!(thumbnailUpdate && formData.thumbnail);
    if (isUpdate) {
      postData.thumbnail = this.genThumbnailPath();
    } else {
      delete postData.thumbnail;
    }

    const res = await functions.httpsCallable("updateQuiz")({
      docId,
      isUpdate,
      postData,
    });

    // サムネのアップロード & 更新が成功した場合
    if (formData.thumbnail && postData.thumbnail && res.data.isSuccess) {
      this.uploadThumbnail(formData.thumbnail, postData.thumbnail);
    }

    return true;
  }

  async delete(quizId: string[]) {
    const res = await functions.httpsCallable("deleteQuiz")({
      ids: quizId,
    });
    return res.data.isSuccess;
  }

  private quizzesCollection(userId?: string) {
    return this.userRef
      .doc(userId || firebase.auth().currentUser?.uid)
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

  public async quizRef(authorId: string, quizId: string) {
    const doc = await this.quizzesCollection(authorId)
      .doc(quizId)
      .get();
    return doc.ref;
  }
  public async likeOrCancel({
    quizId,
    authorId,
  }: {
    quizId: string;
    authorId: string;
  }) {
    const me = this.logInUserOrFailed();
    const batch = firebase.firestore().batch();
    const likedQuizRef = this.quizzesCollection(authorId).doc(quizId);
    const likedUserRef = likedQuizRef.collection("likedUsers").doc(me.uid);
    const myLikedQuizRef = this.userRef
      .doc(me.uid)
      .collection("likedQuizzes")
      .doc(quizId);

    const [likedQuiz, likedUser, myLikedQuiz] = await Promise.all([
      likedQuizRef.get(),
      likedUserRef.get(),
      myLikedQuizRef.get(),
    ]);
    if (!likedQuiz.exists) {
      throw new Error("QuizNotExists");
    }
    if (likedUser.exists && myLikedQuiz.exists) {
      // 削除
      batch.delete(likedUser.ref);
      batch.delete(myLikedQuiz.ref);
      // カウントダウン
      batch.update(this.userRef.doc(me.uid), {
        likeQuizCount: firebase.firestore.FieldValue.increment(-1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else if (!likedUser.exists && !myLikedQuiz.exists) {
      // 登録
      batch.set(likedUser.ref, {
        id: me.uid,
        quizRef: this.userRef.doc(me.uid),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      batch.set(myLikedQuiz.ref, {
        id: quizId,
        quizRef: likedQuizRef,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      // カウントアップ
      batch.update(this.userRef.doc(me.uid), {
        likeQuizCount: firebase.firestore.FieldValue.increment(1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    return batch.commit().then(() => !(likedUser.exists && myLikedQuiz.exists));
  }
}

export default new QuizService();
