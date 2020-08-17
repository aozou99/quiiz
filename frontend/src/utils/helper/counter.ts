import firebase from "firebase/app";
import "firebase/firestore";

export const getCounter = (ref: firebase.firestore.DocumentReference) => {
  // Sum the count of each shard in the subcollection
  return ref
    .collection("shards")
    .get()
    .then((snapshot) => {
      let total_count = 0;
      snapshot.forEach((doc) => {
        total_count += doc.data().count;
      });

      return total_count;
    });
};
