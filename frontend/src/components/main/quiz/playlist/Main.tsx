import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";
import QuizListPannel from "components/main/quiz/playlist/sub/QuizListPannel";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import { QuizDisplay } from "types/QuizTypes";
import { useQuery } from "utils/helper/queryParameter";
import LikeListPannel from "components/main/quiz/playlist/sub/LikeListPannel";

const useStyles = makeStyles((_theme: Theme) =>
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
  const query = useQuery();

  return (
    <Box className={clsx(classes.root)}>
      {query.get("list") === "LL" ? (
        <LikeListPannel setSelected={setSelected} />
      ) : (
        <QuizListPannel setSelected={setSelected} />
      )}
      {selected && <AnswerPanel selected={selected} />}
    </Box>
  );
};

export default Main;
