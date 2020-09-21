import { Container, makeStyles, Theme } from "@material-ui/core";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import DummyAnswerPanel from "components/common/quiz/DummyAnswerPanel";
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
    backgroundColor: "white",
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
    <Container className={classes.container}>
      {hasError && <Redirect to="/404" />}
      {loaded && selected !== undefined ? (
        <AnswerPanel selected={selected} />
      ) : (
        <DummyAnswerPanel />
      )}
    </Container>
  );
};

export default Play;
