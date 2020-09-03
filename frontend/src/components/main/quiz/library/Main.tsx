import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles, Divider } from "@material-ui/core";
import clsx from "clsx";
import PlayListLine from "components/main/quiz/library/sub/PlayListLine";
import LikeListLine from "components/main/quiz/library/sub/LikeListLine";
import { QuizDisplay, QuizResult } from "types/QuizTypes";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import { GuestDescription } from "components/common/content/GuestDescription";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "start",
      backgroundColor: "inherit",
      minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
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
  const [user, loading] = useAuthState(firebase.auth());

  return (
    <>
      {!loading && user && (
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
      )}
      {!loading && !user && (
        <GuestDescription
          icon={<LocalLibraryIcon style={{ fontSize: 120 }} color="action" />}
          title="お気に入りのクイズをお楽しみいただけます"
          caption="ログインすると、いいねやお気に入り登録したクイズにアクセスできます"
        />
      )}
    </>
  );
};

export default Main;
