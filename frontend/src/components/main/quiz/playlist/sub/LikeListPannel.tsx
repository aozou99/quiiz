import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  IconButton,
  Typography,
} from "@material-ui/core";
import { QuizDisplay } from "types/QuizTypes";
import DeleteIcon from "@material-ui/icons/Delete";
import DummyQuizListPannel from "components/main/quiz/playlist/sub/DummyQuizListPannel";
import { usePagenateLikeQuizzes } from "services/quiz/QuizHooks";
import useInfiniteScroll from "react-infinite-scroll-hook";
import QuizService from "services/quiz/QuizService";
import { MetaTag } from "components/common/meta/MetaTag";
import { useListPannelStyles } from "components/main/quiz/playlist/sub/style/ListPannelStyle";

type pagingParam = {
  nextLikeQuiz?: any;
  perCount?: number;
};

const LikeListPannel: React.FC<{
  setSelected: (quiz?: QuizDisplay) => void;
}> = ({ setSelected }) => {
  const classes = useListPannelStyles();
  const [pagingParam, setPagingParam] = useState<pagingParam>({ perCount: 6 });
  const {
    loaded,
    likedQuizzes,
    setLikedQuizzes,
    hasNext,
    nextLikeQuiz,
  } = usePagenateLikeQuizzes(pagingParam);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [quizList, setQuizList] = useState<QuizDisplay[]>([]);
  const handleLoadMore = () => {
    if (likedQuizzes.length > 0) {
      setPagingParam((pre) => {
        return { ...pre, nextLikeQuiz };
      });
    }
  };

  const infiniteRef: any = useInfiniteScroll({
    loading: !loaded,
    hasNextPage: hasNext,
    onLoadMore: handleLoadMore,
  });

  const handleRemoveQuiz = (quiz: QuizDisplay) => {
    QuizService.likeOrCancel({
      quizId: quiz.id,
      authorId: quiz.authorId,
    });
    setLikedQuizzes(likedQuizzes.filter((q: any) => q.id !== quiz.id));
  };

  useEffect(() => {
    if (loaded) {
      setQuizList(likedQuizzes);
    }
  }, [loaded, likedQuizzes]);

  return (
    <>
      <MetaTag title="いいねしたクイズ" />
      {likedQuizzes.length > 0 && (
        <Box className={classes.listPannel}>
          <Box className={classes.playListInfo}>
            <Typography variant={"h6"}>いいねしたクイズ</Typography>{" "}
          </Box>
          <List component="nav" aria-label="quiz lists" ref={infiniteRef}>
            {quizList?.map((quiz: QuizDisplay, i: number) => (
              <React.Fragment key={quiz.id}>
                <ListItem
                  button
                  selected={selectedIndex === i}
                  onClick={() => {
                    setSelectedIndex(i);
                    setSelected(quiz);
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      alt={quiz.question}
                      src={quiz.thumbnail["256x144"]}
                      variant="square"
                      className={classes.avator}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={quiz.question}
                    secondary={quiz.authorName}
                    className={classes.listText}
                  />

                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => {
                        handleRemoveQuiz(quiz);
                        setSelected(undefined);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
      {!loaded && likedQuizzes.length === 0 && <DummyQuizListPannel />}
      {loaded && likedQuizzes.length === 0 && (
        <Box className={classes.center}>
          <Typography variant="subtitle1" color="textSecondary">
            高く評価したクイズはありません
          </Typography>
        </Box>
      )}
    </>
  );
};

export default LikeListPannel;
