import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import BookIcon from "@material-ui/icons/Book";
import CollectionsBookmarkIcon from "@material-ui/icons/CollectionsBookmark";
import QuizTable from "components/main/studio/pc/sub/main/table/QuizTable";
import ReadyImage from "components/common/meta/Ready";
import { BasicTab } from "components/common/tab/BasicTab";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  paddingLeft: {
    paddingLeft: theme.spacing(3),
  },
}));

const QuizEditer: React.FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5" className={classes.paddingLeft} paragraph>
        あなたが作成したクイズ
      </Typography>
      <BasicTab
        tabsprops={[
          {
            tabLabel: "クイズ",
            tabIcon: <BookIcon />,
            childPannel: <QuizTable />,
          },
          {
            tabLabel: "シリーズ",
            tabIcon: <CollectionsBookmarkIcon />,
            childPannel: <ReadyImage />,
          },
        ]}
      />
    </div>
  );
};

export default QuizEditer;
