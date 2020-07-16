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
        ...formData,
        authorId: user.uid,
        quizCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => newPlayListDoc.id);
  }

  async addToList(listId: string, authorId: string, quizId: string) {
    const user = firebase.auth().currentUser;
    if (!user) {
      return;
    }
    const quizRef = await QuizService.quizRef(authorId, quizId);
    const playListDoc = this.playListCollection(user.uid).doc(listId);
    return playListDoc
      .collection("playListQuiz")
      .doc(quizId)
      .set({
        id: quizId,
        quizRef,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        this.playListCollection(user.uid)
          .doc(listId)
          .update({
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            quizCount: firebase.firestore.FieldValue.increment(1),
          });
      });
  }

  removeFromList(listId: string, quizId: string) {
    const userId = firebase.auth().currentUser?.uid;
    if (!userId) {
      return;
    }
    const targetListRef = this.playListCollection(userId).doc(listId);
    return targetListRef
      .collection("playListQuiz")
      .doc(quizId)
      .delete()
      .then(() => {
        targetListRef.update({
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          quizCount: firebase.firestore.FieldValue.increment(-1),
        });
      });
  }

  private playListCollection(userId: string) {
    return this.userRef.doc(userId).collection("playLists");
  }
}

export default new PlayListService();
