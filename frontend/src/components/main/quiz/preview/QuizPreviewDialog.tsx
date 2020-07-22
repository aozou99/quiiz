import React, { useState, useEffect } from "react";
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
import AnswerPanel from "components/main/quiz/home/sub/AnswerPanel";
import { useFetchThumbnailUrl } from "services/quiz/QuizHooks";

const useStyles = makeStyles((theme: Theme) => ({
  actionButton: {
    float: "right",
    marginLeft: theme.spacing(2),
  },
  container: {
    display: "flex",
    justifyContent: "center",
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
  const [selectedQuiz, setSelectedQuiz] = useState<any>(undefined);
  const { imgSrc, loaded } = useFetchThumbnailUrl(quiz.thumbnail, "256x144");

  useEffect(() => {
    setSelectedQuiz({
      ...quiz,
      authorId: "",
      authorName: "",
      authorImageUrl: "",
      thumbnail: {
        "256x144": imgSrc,
        "640x360": imgSrc,
      },
    });
  }, [loaded]);

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
        <Container maxWidth="md" className={classes.container}>
          {loaded && (
            <AnswerPanel
              selected={selectedQuiz}
              result={result}
              setResult={setResult}
            />
          )}
        </Container>
      </DialogContent>
    </Dialog>
  );
};

export default QuizPreviewDialog;
