import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles, Divider } from "@material-ui/core";
import clsx from "clsx";
import PlayListLine from "components/main/quiz/library/sub/PlayListLine";
import LikeListLine from "components/main/quiz/library/sub/LikeListLine";
import { QuizDisplay, QuizResult } from "types/QuizTypes";
import AnswerPanel from "components/main/quiz/home/sub/AnswerPanel";

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
      flex: 1,
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
  })
);

const Main: React.FC = () => {
  const classes = useStyles();
  const [selected, setSelected] = useState<QuizDisplay>();
  const [result, setResult] = useState<QuizResult>(undefined);

  return (
    <Box className={clsx(classes.root)}>
      <Box className={clsx(classes.list)}>
        <PlayListLine />
        <Divider className={classes.divider} />
        <LikeListLine
          selected={selected}
          setSelected={setSelected}
          setResult={setResult}
        />
      </Box>
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

export default Main;
