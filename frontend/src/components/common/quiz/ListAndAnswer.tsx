import React, { useState, useEffect, useMemo, ReactNode } from "react";
import { usePagenateQuiz } from "services/quiz/QuizHooks";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Theme,
  createStyles,
  List,
  CircularProgress,
} from "@material-ui/core";
import clsx from "clsx";
import Item from "components/common/quiz/Item";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import { QuizResult, QuizDisplay } from "types/QuizTypes";
import DummyItem from "components/common/quiz/DummyItem";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { pagingQuizApiOptions } from "types/apiOptions";

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

const ListAndAnswer: React.FC<pagingQuizApiOptions & {
  dummyOff?: boolean;
  emptyResulDescription?: ReactNode;
}> = (props) => {
  const [pagingParam, setPagingParam] = useState<pagingQuizApiOptions>(props);
  const { quizzes, loaded, hasNext, nextQuiz } = usePagenateQuiz(pagingParam);
  const classes = useStyles();
  const [selected, setSelected] = useState<QuizDisplay>();
  const [result, setResult] = useState<QuizResult>(undefined);
  const handleLoadMore = () => {
    setPagingParam((pre) => {
      return {
        ...pre,
        nextQuiz,
      };
    });
  };

  const infiniteRef: any = useInfiniteScroll({
    loading: !loaded,
    hasNextPage: hasNext,
    onLoadMore: handleLoadMore,
  });

  useEffect(() => {
    setPagingParam(props);
  }, [props, props.where]);

  const QuizList = useMemo(() => {
    return quizzes.map((item: QuizDisplay) => (
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
    ));
  }, [quizzes, selected]);

  const Dummy = useMemo(() => {
    return Array.from({ length: 32 })
      .fill(null)
      .map((_, i) => <DummyItem key={i} />);
  }, []);

  return (
    <Box className={clsx(classes.root)}>
      <List className={classes.list} ref={infiniteRef}>
        {QuizList}
        {!loaded && quizzes.length === 0 && !props.dummyOff && Dummy}
        {!loaded && quizzes.length > 0 && (
          <Box className={classes.center}>
            <CircularProgress />
          </Box>
        )}
        {loaded && quizzes.length === 0 && props.emptyResulDescription}
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

export default React.memo(ListAndAnswer);
