import React, { useState } from "react";
import { usePageNateQuiz } from "services/quiz/QuizHooks";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Theme,
  createStyles,
  List,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import Item from "components/common/quiz/Item";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import { QuizResult, QuizDisplay } from "types/QuizTypes";
import DummyItem from "components/common/quiz/DummyItem";
import useInfiniteScroll from "react-infinite-scroll-hook";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "start",
      backgroundColor: "inherit",
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      "& > *": {
        margin: theme.spacing(1),
      },
      flex: "5",
      [theme.breakpoints.down("xs")]: {
        flex: "4",
      },
    },
    center: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      width: "100%",
      whiteSpace: "pre-wrap",
    },
  })
);

type pagingParam = {
  lastQuizId?: string;
  channelId?: string;
};

export const ListAndAnswer: React.FC<pagingParam> = (initPagingParam = {}) => {
  const [pagingParam, setPagingParam] = useState<pagingParam>(initPagingParam);
  const { quizzes, loaded, hasNext } = usePageNateQuiz(pagingParam);
  const classes = useStyles();
  const [selected, setSelected] = useState<QuizDisplay>();
  const [result, setResult] = useState<QuizResult>(undefined);
  const handleLoadMore = () => {
    setPagingParam({
      lastQuizId: quizzes[quizzes.length - 1].id,
    });
  };

  const infiniteRef: any = useInfiniteScroll({
    loading: !loaded,
    hasNextPage: hasNext,
    onLoadMore: handleLoadMore,
  });

  return (
    <Box className={clsx(classes.root)}>
      <List className={classes.list} ref={infiniteRef}>
        {quizzes.map((item: QuizDisplay) => (
          <Item
            key={item.id}
            thumbnail={item.thumbnail["640x360"]}
            question={item.question}
            authorId={item.authorId}
            authorName={item.authorName}
            authorImageUrl={item.authorImageUrl}
            handleClick={() => {
              if (selected === item) {
                setSelected(undefined);
              } else {
                setSelected(item);
                setResult(undefined);
              }
            }}
            isSelected={selected === item}
          />
        ))}
        {!loaded &&
          quizzes.length === 0 &&
          Array.from({ length: 32 })
            .fill(null)
            .map((_, i) => <DummyItem key={i} />)}
        {!loaded && (
          <Box className={classes.center}>
            <CircularProgress />
          </Box>
        )}
        {loaded && quizzes.length === 0 && pagingParam.channelId && (
          <Box className={classes.center}>
            <Typography variant={"subtitle2"} color="textSecondary">
              {"このチャンネルにはクイズがありません"}
            </Typography>
          </Box>
        )}
      </List>
      {selected && (
        <AnswerPanel
          selected={selected}
          result={result}
          setResult={setResult}
        />
      )}
    </Box>
  );
};
