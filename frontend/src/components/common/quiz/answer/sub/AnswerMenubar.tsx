import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  Tooltip,
  IconButton,
  Typography,
} from "@material-ui/core";
import { themeColors } from "components/core/CustomeTheme";
import React, { useEffect, useState } from "react";
import FolderIcon from "@material-ui/icons/Folder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { QuizDisplay } from "types/QuizTypes";
import { useFetchLike } from "services/quiz/QuizHooks";
import { useCheckList } from "services/playList/PlayListHooks";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import QuizService from "services/quiz/QuizService";
import clsx from "clsx";
import PlayListDialog from "components/common/dialog/PlayListDialog";
import { SignInGuideDialog } from "components/common/dialog/SignInGuideDialog";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    icons: {
      display: "flex",
      justifyContent: "space-evenly",
    },
    iconSelectedPink: {
      color: themeColors.secondary[500],
      animation: `$rotate 1.5s`,
    },
    iconSelectedYellow: {
      color: themeColors.quaternary[500],
    },
    likeCount: {
      marginLeft: theme.spacing(1),
    },
    "@keyframes rotate": {
      "0%": { transform: "rotateY(0deg)" },
      "100%": { transform: "rotateY(360deg)" },
    },
  })
);
export const AnswerMenubar = ({ selected }: { selected: QuizDisplay }) => {
  const classes = useStyles();
  const {
    loaded: likeLoaded,
    isLike: initialIsLike,
    likeCount,
    setLikeCount,
  } = useFetchLike(selected.id, selected.authorId);
  const [isLike, setIsLike] = useState(initialIsLike);
  const { checked, loaded: checkListLoaded, update } = useCheckList(
    selected.id
  );
  const [user, loading] = useAuthState(firebase.auth());
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [signInTitle, setSignInTitle] = useState("");
  const [signInBody, setSignInBody] = useState("");
  const [isOpenList, setIsOpenList] = useState(false);
  const validateSignInDialog = (title: string, body: string) => {
    const isNg = !loading && !user;
    if (isNg) {
      setSignInTitle(title);
      setSignInBody(body);
      setOpenSignInDialog(true);
    }
    return isNg;
  };

  const handleLike = () => {
    if (
      validateSignInDialog(
        "このクイズにいいねをする",
        "いいねするには、\nログインをしてください"
      )
    ) {
      return;
    }
    QuizService.likeOrCancel({
      quizId: selected.id,
      authorId: selected.authorId,
    }).then((isCancel) => {
      setIsLike(isCancel);
      setLikeCount((pre) => (isCancel ? pre + 1 : pre - 1));
    });
  };
  const handleAddPlayList = () => {
    if (
      validateSignInDialog(
        "再生リストに追加する",
        "再生リストに追加するには、\nログインをしてください"
      )
    ) {
      return;
    }
    setIsOpenList(!isOpenList);
  };

  useEffect(() => {
    setIsLike(initialIsLike);
  }, [initialIsLike, selected.id]);

  return (
    <>
      <Box className={classes.icons}>
        <Tooltip title="いいね">
          <IconButton aria-label="good" onClick={handleLike}>
            <FavoriteIcon
              className={clsx(likeLoaded && isLike && classes.iconSelectedPink)}
            />
            <Typography variant={"subtitle1"} className={classes.likeCount}>
              {likeLoaded ? likeCount : 0}
            </Typography>
          </IconButton>
        </Tooltip>
        <Tooltip title="リストに追加">
          <IconButton aria-label="addPlayList" onClick={handleAddPlayList}>
            <FolderIcon
              className={clsx(
                checkListLoaded &&
                  checked.length > 0 &&
                  classes.iconSelectedYellow
              )}
            />
          </IconButton>
        </Tooltip>
      </Box>
      <PlayListDialog
        open={isOpenList}
        onClose={() => setIsOpenList(false)}
        quiz={{ id: selected.id, authorId: selected.authorId }}
        afterChecked={update}
      />
      <SignInGuideDialog
        open={openSignInDialog}
        title={signInTitle}
        bodyText={signInBody}
        onClose={() => setOpenSignInDialog(false)}
      />
    </>
  );
};
