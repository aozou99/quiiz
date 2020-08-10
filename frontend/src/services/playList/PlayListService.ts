import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/functions";
import "firebase/auth";
import "firebase/storage";
import { PlayListFormData } from "types/PlayListTypes";
import QuizService from "services/quiz/QuizService";

class PlayListService {
  userRef = firebase.firestore().collection("users");

  async create(formData: PlayListFormData) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }
    const newPlayListDoc = this.playListCollection(user.uid).doc();
    return newPlayListDoc
      .set({
        id: newPlayListDoc.id,
        ...formData,
        authorId: user.uid,
        quizCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => newPlayListDoc.id);
  }

  async addToList(listId: string, authorId: string, quizId: string) {
    const { playListDoc, userId } = this.getMyPlayListDoc(listId);
    if (!(playListDoc && userId)) {
      return;
    }
    const quizRef = await QuizService.quizRef(authorId, quizId);
    return playListDoc
      .collection("playListQuiz")
      .doc(quizId)
      .set({
        id: quizId,
        quizRef,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        this.playListCollection(userId)
          .doc(listId)
          .update({
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            quizCount: firebase.firestore.FieldValue.increment(1),
          });
      });
  }

  update(listId: string, formData: Partial<PlayListFormData>) {
    const { playListDoc } = this.getMyPlayListDoc(listId);
    if (!playListDoc) {
      return;
    }
    return playListDoc.update({
      ...formData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  delete(playListId: string) {
    const { playListDoc } = this.getMyPlayListDoc(playListId);
    if (!playListDoc) {
      return;
    }
    return playListDoc.delete();
  }

  removeFromList(listId: string, quizId: string) {
    const { playListDoc } = this.getMyPlayListDoc(listId);
    if (!playListDoc) {
      return;
    }
    return playListDoc
      .collection("playListQuiz")
      .doc(quizId)
      .delete()
      .then(() => {
        playListDoc.update({
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          quizCount: firebase.firestore.FieldValue.increment(-1),
        });
      });
  }

  private playListCollection(userId: string) {
    return this.userRef.doc(userId).collection("playLists");
  }
  private getMyPlayListDoc(listId: string) {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) {
      return {
        playListDoc: undefined,
        userId,
      };
    }
    return {
      playListDoc: this.playListCollection(userId).doc(listId),
      userId,
    };
  }
}

export default new PlayListService();
