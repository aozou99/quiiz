import {
  Paper,
  Typography,
  Divider,
  makeStyles,
  createStyles,
  Theme,
  Grow,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import Choices from "components/main/quiz/preview/sub/Choices";
import { QuizResult, QuizDisplay } from "types/QuizTypes";
import "firebase/auth";
import { useQuery } from "utils/helper/queryParameter";
import PlayListContents from "components/common/playList/PlayListContents";
import LikeListContents from "components/common/playList/LikeListContents";
import { AnswerMenubar } from "components/common/quiz/answer/sub/AnswerMenubar";
import { AnswerDescription } from "components/common/quiz/answer/sub/AnswerDescription";

type Props = {
  selected: QuizDisplay;
  refresh?: boolean;
  elevation?: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detail: {
      flex: "3",
      [theme.breakpoints.down("sm")]: {
        flex: "5",
        minWidth: theme.spacing(0),
        margin: theme.spacing(0),
        height: `calc(100vh - ${theme.spacing(21)}px)`,
      },
      backgroundColor: "white",
      margin: theme.spacing(1),
      maxWidth: theme.spacing(70),
      minWidth: theme.spacing(56),
      padding: theme.spacing(2),
      position: "sticky",
      top: theme.spacing(10),
      overflowY: "auto",
      height: `calc(100vh - ${theme.spacing(16)}px)`,
      "& > img": {
        display: "block",
        margin: "auto",
        marginBottom: theme.spacing(1),
        borderRadius: theme.spacing(1),
        height: 144,
        width: 256,
        backgroundImage: `url("/images/loading/loading.gif")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      },
      "& > hr": {
        margin: theme.spacing(1),
      },
    },
  })
);

const AnswerPanel: React.FC<Props> = ({ selected, refresh, elevation }) => {
  const classes = useStyles();
  const [result, setResult] = useState<QuizResult>(undefined);
  const query = useQuery();
  const listId = query.get("list");
  const index = Number.parseInt(query.get("index") || "");
  const choices = (e: QuizDisplay): [string, string, string, string] => [
    e.selectA,
    e.selectB,
    e.selectC,
    e.selectD,
  ];

  useEffect(() => {
    setResult(undefined);
  }, [selected.id, refresh]);

  return (
    <Grow in={true}>
      <Paper
        elevation={elevation !== undefined ? elevation : 1}
        className={classes.detail}
      >
        <img src={selected.thumbnail["256x144"]} alt={selected.question} />
        <Typography align="center" variant="subtitle1">
          {selected.question}
        </Typography>
        <Divider />
        <Choices
          result={result}
          setResult={setResult}
          choices={choices(selected)}
          answer={selected.answer}
        />
        <AnswerDescription
          open={!!result && (selected?.description?.length || 0) > 0}
          selected={selected}
        />
        <AnswerMenubar selected={selected} />
        {listId && !isNaN(index) && listId !== "LL" && (
          <PlayListContents listId={listId} index={index} />
        )}
        {listId && !isNaN(index) && listId === "LL" && (
          <LikeListContents index={index} />
        )}
      </Paper>
    </Grow>
  );
};

export default React.memo(AnswerPanel);
