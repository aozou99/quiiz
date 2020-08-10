import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Container,
  Divider,
  makeStyles,
  Theme,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import RefreshIcon from "@material-ui/icons/Refresh";
import { QuizData, QuizResult } from "types/QuizTypes";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import { useFetchThumbnailUrl } from "services/quiz/QuizHooks";
import { grey } from "@material-ui/core/colors";

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    padding: theme.spacing(1, 3),
  },
  actionButton: {
    float: "right",
    marginLeft: theme.spacing(2),
  },
  content: {
    backgroundColor: grey[100],
    padding: theme.spacing(0, 3),
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
  }, [imgSrc, quiz]);

  return (
    <Dialog
      open={open}
      onExited={() => setResult(undefined)}
      fullScreen
      aria-labelledby="preview-dialog-title"
      aria-describedby="preview-dialog-description"
    >
      <DialogTitle id="preview-dialog-title" className={classes.header}>
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
      <DialogContent className={classes.content}>
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
