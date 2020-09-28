import ListContents from "components/common/playList/ListContents";
import React, { useEffect } from "react";
import { useFetchPlayListContents } from "services/playList/PlayListHooks";
import { QuizDisplay } from "types/QuizTypes";

const ListContetnts: React.FC<{ listId: string; index: number }> = ({
  listId,
  index,
}) => {
  const { loaded, playList, quizzes } = useFetchPlayListContents(listId);
  const [quizList, setQuizList] = React.useState<QuizDisplay[]>();

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
