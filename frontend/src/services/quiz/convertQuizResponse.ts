import imageUrl from "utils/helper/imageUrl";
import AuthService from "services/auth/AuthService";

export const convertQuizResponse = async (quizDoc: any) => {
  const [user, url256, url640] = await Promise.all([
    AuthService.userRef.doc(quizDoc.data().authorId).get(),
    imageUrl(quizDoc.data().thumbnail, "256x144"),
    imageUrl(quizDoc.data().thumbnail, "640x360"),
  ]);
  return {
    ...quizDoc.data(),
    thumbnail: {
      "256x144": url256,
      "640x360": url640,
    },
    authorName: user.data()?.displayName,
    authorImageUrl: user.data()?.photoUrl,
  };
};
