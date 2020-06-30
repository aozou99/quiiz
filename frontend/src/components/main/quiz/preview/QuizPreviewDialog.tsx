import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Grid,
  Container,
  Divider,
  makeStyles,
  Theme,
} from "@material-ui/core";
import Question from "components/main/quiz/preview/sub/Question";
import Choices from "components/main/quiz/preview/sub/Choices";
import CheckIcon from "@material-ui/icons/Check";
import RefreshIcon from "@material-ui/icons/Refresh";
import { QuizData, QuizResult } from "types/QuizTypes";

const useStyles = makeStyles((theme: Theme) => ({
  actionButton: {
    float: "right",
    marginLeft: theme.spacing(2),
  },
}));

type State = {
  open: boolean;
  setOpen: (open: boolean) => void;
  quiz: QuizData;
};

const QuizPreviewDialog: React.FC<State> = ({ open, setOpen, quiz }) => {
  const classes = useStyles();
  const [result, setResult] = useState<QuizResult>(undefined);
  const answerLabel = (e: QuizData) => choices(e)[e.answer];
  const choices = (e: QuizData): [string, string, string, string] => [
    e.selectA,
    e.selectB,
    e.selectC,
    e.selectD,
  ];
  return (
    <Dialog
      open={open}
      onExited={() => setResult(undefined)}
      fullScreen
      aria-labelledby="preview-dialog-title"
      aria-describedby="preview-dialog-description"
    >
      <DialogTitle id="preview-dialog-title">
        プレビュー
        <Button
          className={classes.actionButton}
          variant="outlined"
          onClick={() => setOpen(false)}
          startIcon={<CheckIcon />}
          color="default"
        >
          OK
        </Button>
        <Button
          className={classes.actionButton}
          variant="outlined"
          onClick={() => setResult(undefined)}
          startIcon={<RefreshIcon />}
          color="primary"
        >
          リフレッシュ
        </Button>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Container maxWidth="md">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Question
                result={result}
                thumbnail={quiz.thumbnail}
                question={quiz.question}
                answerLabel={answerLabel(quiz)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Choices
                result={result}
                setResult={setResult}
                choices={choices(quiz)}
                answer={quiz.answer}
              />
            </Grid>
          </Grid>
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default QuizPreviewDialog;
