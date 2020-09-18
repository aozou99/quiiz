import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Theme,
  createStyles,
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
import { grey } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import DummyQuizListPannel from "components/main/quiz/playlist/sub/DummyQuizListPannel";
import { usePagenateLikeQuizzes } from "services/quiz/QuizHooks";
import useInfiniteScroll from "react-infinite-scroll-hook";
import QuizService from "services/quiz/QuizService";
import { MetaTag } from "components/common/meta/MetaTag";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avator: {
      height: theme.spacing(9),
      width: theme.spacing(16),
    },
    listPannel: {
      backgroundColor: grey[50],
      "&>nav.MuiList-padding": {
        paddingTop: 0,
        paddingBottom: 0,
      },
      minHeight: `calc(100vh - ${theme.spacing(8)}px)`,
      marginRight: theme.spacing(1),
      width: theme.spacing(73),
    },
    listText: {
      height: theme.spacing(9),
      paddingLeft: theme.spacing(2),
    },
    playListInfo: {
      padding: theme.spacing(1, 2),
    },
    noUnderLine: {
      "& .MuiInput-underline:before": {
        borderBottom: 0,
      },
    },
    center: {
      width: "100%",
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      padding: theme.spacing(2),
    },
  })
);

type pagingParam = {
  nextLikeQuiz?: any;
  perCount?: number;
};

const LikeListPannel: React.FC<{
  setSelected: (quiz?: QuizDisplay) => void;
  setResult: (result: undefined) => void;
}> = ({ setSelected, setResult }) => {
  const classes = useStyles();
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
                    setResult(undefined);
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
