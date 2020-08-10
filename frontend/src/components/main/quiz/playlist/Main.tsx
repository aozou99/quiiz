import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";
import QuizListPannel from "components/main/quiz/playlist/sub/QuizListPannel";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import { QuizDisplay, QuizResult } from "types/QuizTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "start",
      backgroundColor: "inherit",
    },
  })
);

const Main: React.FC = () => {
  const classes = useStyles();
  const [selected, setSelected] = useState<QuizDisplay>();
  const [result, setResult] = useState<QuizResult>(undefined);

  return (
    <Box className={clsx(classes.root)}>
      <QuizListPannel setSelected={setSelected} setResult={setResult} />
      {selected && (
        <AnswerPanel
          selected={selected}
          setResult={setResult}
          result={result}
        />
      )}
    </Box>
  );
};

export default Main;
