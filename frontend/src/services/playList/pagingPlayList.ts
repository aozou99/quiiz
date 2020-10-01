import firebase from "firebase/app";
import "firebase/firestore";
import { PRIVACY } from "utils/costant/InputConst";
import { quizThumbImgUrl } from "utils/helper/imageUrl";

const db = firebase.firestore();
const DEFAULT_COUNT = 4;
const defaultThumbnailPath = "images/default/quiiz-thumbnail.png";

const genBaseQuery = async (uid: string, isMine: boolean, parameters: any) => {
  let baseQuery = db
    .collection("users")
    .doc(uid)
    .collection("playLists")
    .orderBy("updatedAt", "desc");

  if (!isMine) {
    baseQuery = baseQuery.where("privacy", "==", PRIVACY.PUBLIC);
  }

  if (parameters && parameters.nextPlayList) {
    baseQuery = baseQuery.startAfter(parameters.nextPlayList);
  }

  return baseQuery.limit((parameters.perCount || DEFAULT_COUNT) + 1);
};

export const pagingPlayList = async (uid: string | undefined, data: any) => {
  const isMine =
    !data?.channelId || (data?.channelId && data?.channelId === uid);
  const snapshot = await genBaseQuery(
    data.channelId || uid,
    isMine,
    data
  ).then((doc) => doc.get());
  if (snapshot.size < 1) {
    return {
      playLists: [],
      hasNext: false,
      nextPlayList: null,
    };
  }
  let hasNext = false;
  let nextPlayList = null;
  const playListDocs = snapshot.docs;
  if (snapshot.size > (data.perCount || DEFAULT_COUNT)) {
    hasNext = true;
    playListDocs.pop();
    nextPlayList = playListDocs[(data.perCount || DEFAULT_COUNT) - 1];
  }

  const rs = playListDocs.map(async (playList) => {
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
        "256x144": await quizThumbImgUrl(thumbnail, "256x144"),
        "640x360": await quizThumbImgUrl(thumbnail, "640x360"),
      },
    };
  });

  return {
    playLists: await Promise.all(rs),
    hasNext: hasNext,
    nextPlayList,
  };
};
