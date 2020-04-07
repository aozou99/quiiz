import React from "react";
import Timer from "components/main/quiz/exercises/sub/Timer";
import Question from "components/main/quiz/exercises/sub/Question";
import Choices from "components/main/quiz/exercises/sub/Choices";
import { Container } from "@material-ui/core";

const Main: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Timer />
      {/* <Question /> */}
      {/* <Choices /> */}
    </Container>
  );
};

export default Main;
