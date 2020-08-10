import admin from "../core/admin";
import imgUrl from "./imageUrl";

const convertQuizResponse = async (quizDoc: any) => {
  const [user, url256, url640] = await Promise.all([
    admin.auth().getUser(quizDoc.data().authorId),
    imgUrl(quizDoc.data().thumbnail, "256x144"),
    imgUrl(quizDoc.data().thumbnail, "640x360"),
  ]);
  return {
    ...quizDoc.data(),
    thumbnail: {
      "256x144": url256,
      "640x360": url640,
    },
    authorName: user?.displayName,
    authorImageUrl: user?.photoURL,
  };
};

export default convertQuizResponse;
