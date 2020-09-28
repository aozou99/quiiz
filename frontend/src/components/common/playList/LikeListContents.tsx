import ListContents from "components/common/playList/ListContents";
import React, { useEffect } from "react";
import { usePagenateLikeQuizzes } from "services/quiz/QuizHooks";
import { QuizDisplay } from "types/QuizTypes";

const ListContetnts: React.FC<{ index: number }> = ({ index }) => {
  const { loaded, likedQuizzes: quizzes } = usePagenateLikeQuizzes({
    perCount: 1000,
  });
  const [quizList, setQuizList] = React.useState<QuizDisplay[]>();
  const playList = { authorName: "", listName: "いいねしたクイズ", id: "LL" };
  useEffect(() => {
    if (loaded && playList) {
      setQuizList(quizzes);
    }
  }, [loaded, playList, quizzes]);

  return (
    <ListContents
      loaded={loaded}
      quizzes={quizList}
      index={index}
      playList={playList}
    />
  );
};

export default React.memo(ListContetnts);
