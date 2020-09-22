import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Theme,
  createStyles,
  Divider,
  Container,
} from "@material-ui/core";
import clsx from "clsx";
import PlayListLine from "components/main/quiz/library/sub/PlayListLine";
import LikeListLine from "components/main/quiz/library/sub/LikeListLine";
import { QuizDisplay } from "types/QuizTypes";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import { GuestDescription } from "components/common/content/GuestDescription";
import { MetaTag } from "components/common/meta/MetaTag";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2, 0),
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "start",
      backgroundColor: "inherit",
      minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
    },
    list: {
      flex: 4,
      paddingRight: theme.spacing(3),
    },
    divider: {
      margin: theme.spacing(2, 0),
      maxWidth: theme.breakpoints.width("lg"),
    },
  })
);

const Main: React.FC = () => {
  const classes = useStyles();
  const [selected, setSelected] = useState<QuizDisplay>();
  const [user, loading] = useAuthState(firebase.auth());

  return (
    <Container maxWidth="xl">
      <MetaTag title="ライブラリ" />
      {!loading && user && (
        <Box className={clsx(classes.root)}>
          <Container maxWidth="lg" className={clsx(classes.list)}>
            <PlayListLine />
            <Divider className={classes.divider} />

            <LikeListLine selected={selected} setSelected={setSelected} />
          </Container>
          {selected && <AnswerPanel selected={selected} />}
        </Box>
      )}
      {!loading && !user && (
        <GuestDescription
          icon={<LocalLibraryIcon style={{ fontSize: 120 }} color="action" />}
          title={"お気に入りのクイズを\nお楽しみいただけます"}
          caption={
            "ログインすると「いいね」や\n「お気に入り登録」したクイズにアクセスできます"
          }
        />
      )}
    </Container>
  );
};

export default Main;
