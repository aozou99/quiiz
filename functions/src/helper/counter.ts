import admin from "../core/admin";

export const createCounter = (
  ref: FirebaseFirestore.DocumentReference,
  numShards: number
) => {
  const batch = admin.firestore().batch();
  // Initialize the counter document
  batch.set(ref, { numShards });
  // Initialize each shard with count=0
  for (let i = 0; i < numShards; i++) {
    let shardRef = ref.collection("shards").doc(i.toString());
    batch.set(shardRef, { count: 0 });
  }
  // Commit the write batch
  return batch.commit();
};

export const incrementCounter = (
  ref: FirebaseFirestore.DocumentReference,
  numShards: number,
  count: number = 1
) => {
  // Select a shard of the counter at random
  const shardId = Math.floor(Math.random() * numShards).toString();
  const shardRef = ref.collection("shards").doc(shardId);

  // Update count
  return shardRef.update("count", admin.firestore.FieldValue.increment(count));
};

export const getCounter = (ref: FirebaseFirestore.DocumentReference) => {
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
