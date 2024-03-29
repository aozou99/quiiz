import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  Tooltip,
  IconButton,
  Typography,
  Snackbar,
  Popover,
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
import TwitterIcon from "@material-ui/icons/Twitter";
import {
  contactUsLink,
  openAnotherTab,
  shareQuizLink,
  twitterShare,
} from "utils/helper/link";
import LinkIcon from "@material-ui/icons/Link";
import { Alert } from "@material-ui/lab";
import { useQuery } from "utils/helper/queryParameter";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ReportProblemIcon from "@material-ui/icons/ReportProblem";

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
    snackbar: {
      zIndex: 10000,
      [theme.breakpoints.down("sm")]: {
        bottom: "50%",
      },
    },
    popoverBox: {
      display: "flex",
      placeContent: "center",
      placeItems: "center",
      padding: theme.spacing(2),
      "&>svg": {
        marginRight: theme.spacing(1),
      },
    },
  })
);
export const Menubar = ({ selected }: { selected: QuizDisplay }) => {
  const classes = useStyles();
  const query = useQuery();
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
  const [snakOpen, setSnakOpen] = useState(false);
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
    }).then(isCancel => {
      setIsLike(isCancel);
      setLikeCount(pre => (isCancel ? pre + 1 : pre - 1));
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

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        <Tooltip title="Twitterでシェア">
          <IconButton
            aria-label="shareTwitter"
            onClick={() => {
              openAnotherTab(twitterShare(selected, query));
            }}
          >
            <TwitterIcon color="primary" />
          </IconButton>
        </Tooltip>
        <Tooltip title="リンクをコピー">
          <IconButton
            aria-label="copyLink"
            onClick={() => {
              navigator.clipboard.writeText(shareQuizLink(selected.id, query));
              setSnakOpen(true);
            }}
          >
            <LinkIcon color="action" />
          </IconButton>
        </Tooltip>
        <Tooltip title="その他">
          <IconButton aria-label="copyLink" onClick={handleClick}>
            <MoreHorizIcon color="action" />
          </IconButton>
        </Tooltip>
        <Popover
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Box
            className={classes.popoverBox}
            onClick={() => {
              openAnotherTab(contactUsLink());
              handleClose();
            }}
          >
            <ReportProblemIcon color="error" />
            <Typography>違反の報告</Typography>
          </Box>
        </Popover>
      </Box>
      <img
        src={shareQuizLink(selected.id, query)}
        style={{ display: "none" }}
        alt={"pre-request"}
      />
      <PlayListDialog
        open={isOpenList}
        onClose={() => setIsOpenList(false)}
        quiz={{
          id: selected.id,
          authorId: selected.authorId,
        }}
        afterChecked={update}
      />
      <SignInGuideDialog
        open={openSignInDialog}
        title={signInTitle}
        bodyText={signInBody}
        onClose={() => setOpenSignInDialog(false)}
      />
      <Snackbar
        open={snakOpen}
        autoHideDuration={1500}
        onClose={() => setSnakOpen(false)}
        className={classes.snackbar}
      >
        <Alert severity="info">このクイズのURLをコピーしました</Alert>
      </Snackbar>
    </>
  );
};
