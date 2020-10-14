import { Container, Grow, makeStyles, Theme } from "@material-ui/core";
import { MetaTag } from "components/common/meta/MetaTag";
import AnswerPanel from "components/common/quiz/answer/AnswerPanel";
import DummyAnswerPanel from "components/common/quiz/answer/DummyAnswerPanel";
import React, { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router-dom";
import { useFetchQuiz } from "services/quiz/QuizHooks";
import { QuizDisplay } from "types/QuizTypes";

const useStyles = makeStyles((_theme: Theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    padding: 0,
    margin: 0,
  },
}));

const Play: React.FC = () => {
  const { id } = useParams();
  const classes = useStyles();
  const [selected, setSelected] = useState<QuizDisplay>();
  const { quiz, hasError, loaded } = useFetchQuiz(id);
  useEffect(() => {
    setSelected(quiz);
  }, [quiz]);
  return (
    <>
      {selected && (
        <MetaTag
          title={selected.question}
          description={selected.question}
          noindex
        />
      )}
      <Grow in={true}>
        <Container className={classes.container}>
          {hasError && <Redirect to="/404" />}
          {loaded && selected !== undefined ? (
            <AnswerPanel selected={selected} elevation={0} />
          ) : (
            <DummyAnswerPanel />
          )}
        </Container>
      </Grow>
    </>
  );
};

export default Play;
