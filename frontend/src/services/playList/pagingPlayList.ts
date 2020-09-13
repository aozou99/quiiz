import firebase from "firebase/app";
import "firebase/firestore";
import { PRIVACY } from "utils/costant/InputConst";
import imageUrl from "utils/helper/imageUrl";

const db = firebase.firestore();

const defaultThumbnailPath = "images/default/quiiz-thumbnail.png";

const genBaseQuery = async (
  uid: string,
  isMine: boolean,
  parameters: any,
  lastPlayList?: any
) => {
  let baseQuery = db
    .collection("users")
    .doc(uid)
    .collection("playLists")
    .orderBy("updatedAt");

  if (!isMine) {
    baseQuery = baseQuery.where("privacy", "==", PRIVACY.PUBLIC);
  }

  if (lastPlayList) {
    baseQuery = baseQuery.startAfter(lastPlayList);
  }
  if (!lastPlayList && parameters?.lastListId) {
    const snapshot = await db
      .collection("users")
      .doc(uid)
      .collection("playLists")
      .doc(parameters.lastListId)
      .get();
    baseQuery = baseQuery.startAfter(snapshot);
  }

  return baseQuery.limit(parameters?.perCount || 4);
};

export const pagingPlayList = async (uid: string, data: any) => {
  const isMine =
    !data?.channelId || (data?.channelId && data?.channelId === uid);
  const snapshot = await genBaseQuery(uid, isMine, data).then((doc) =>
    doc.get()
  );
  if (snapshot.size < 1) {
    return {
      playLists: [],
      hasNext: false,
    };
  }

  const hasNext = genBaseQuery(
    uid,
    isMine,
    data,
    snapshot.docs[snapshot.size - 1]
  )
    .then((doc) => doc.get())
    .then((next) => next.size > 0);

  const rs = snapshot.docs.map(async (playList) => {
    const playListData = playList.data();
    let thumbnail = defaultThumbnailPath;
    if (playListData.quizCount > 0) {
      const playListSnapshot = await playList.ref
        .collection("playListQuiz")
        .orderBy("createdAt", "desc")
        .get();
      const quizSnapShot = await playListSnapshot.docs[0].data().quizRef.get();
      thumbnail = quizSnapShot.data().thumbnail;
    }

    return {
      id: playList.id,
      ...playListData,
      thumbnail: {
        "256x144": await imageUrl(thumbnail, "256x144"),
        "640x360": await imageUrl(thumbnail, "256x144"),
      },
    };
  });

  return {
    playLists: await Promise.all(rs),
    hasNext: await hasNext,
  };
};
