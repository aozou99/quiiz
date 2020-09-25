import {
  Paper,
  Box,
  Typography,
  Divider,
  Tooltip,
  Collapse,
  Card,
  CardHeader,
  CardContent,
  makeStyles,
  createStyles,
  Theme,
  IconButton,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useState, useEffect } from "react";
import Choices from "components/main/quiz/preview/sub/Choices";
import { themeColors } from "components/core/CustomeTheme";
import FolderIcon from "@material-ui/icons/Folder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { QuizResult, QuizDisplay } from "types/QuizTypes";
import QuizService from "services/quiz/QuizService";
import { useFetchLike } from "services/quiz/QuizHooks";
import PlayListDialog from "components/common/dialog/PlayListDialog";
import { useCheckList } from "services/playList/PlayListHooks";
import { SignInGuideDialog } from "components/common/dialog/SignInGuideDialog";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import "firebase/auth";
import { useQuery } from "utils/helper/queryParameter";
import ListContetnts from "components/common/playList/ListContetnts";

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
      },
      "& > hr": {
        margin: theme.spacing(1),
      },
    },
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
    description: {
      whiteSpace: "pre-line",
      backgroundColor: "rgba(0, 0, 0, 0.87)",
      padding: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& .MuiCardHeader-root, .MuiCardContent-root": {
        padding: theme.spacing(1),
      },
      "& .MuiCardHeader-root": {
        paddingBottom: theme.spacing(0),
      },
      color: "white",
      "& .MuiCardHeader-content": {
        color: themeColors.primary[400],
        "& .MuiTypography-root": {
          fontWeight: "bold",
        },
      },
    },
    reference: {
      color: themeColors.tertiary[400],
    },
    referenceIcon: {
      minWidth: theme.spacing(4),
    },
    referenceLink: {
      padding: theme.spacing(0.5, 1),
      marginBottom: theme.spacing(0.5),
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 1.00)",
      },
    },
    borderLeftPrimary: {
      color: themeColors.primary["A200"],
      borderLeft: `medium solid ${themeColors.primary[400]}`,
    },
    borderLeftrTertiary: {
      color: themeColors.tertiary["A200"],
      borderLeft: `medium solid ${themeColors.tertiary[400]}`,
    },
    borderLeftQuaternary: {
      color: themeColors.quaternary["A200"],
      borderLeft: `medium solid ${themeColors.quaternary[400]}`,
    },
    borderBottom: {
      borderBottom: `thin solid`,
    },
    "@keyframes rotate": {
      "0%": { transform: "rotateY(0deg)" },
      "100%": { transform: "rotateY(360deg)" },
    },
  })
);

const AnswerPanel: React.FC<Props> = ({ selected, refresh, elevation }) => {
  const classes = useStyles();
  const borderLeftColors = [
    classes.borderLeftrTertiary,
    classes.borderLeftQuaternary,
    classes.borderLeftPrimary,
  ];
  const [result, setResult] = useState<QuizResult>(undefined);
  const [user, loading] = useAuthState(firebase.auth());
  const [isOpenList, setIsOpenList] = useState(false);
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
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [signInTitle, setSignInTitle] = useState("");
  const [signInBody, setSignInBody] = useState("");
  const query = useQuery();
  const listId = query.get("list");
  const index = Number.parseInt(query.get("index") || "");
  const choices = (e: QuizDisplay): [string, string, string, string] => [
    e.selectA,
    e.selectB,
    e.selectC,
    e.selectD,
  ];
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
    setResult(undefined);
  }, [initialIsLike, selected.id, refresh]);

  return (
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
      <Collapse
        in={!!result && (selected?.description?.length || 0) > 0}
        timeout="auto"
      >
        <Card className={classes.description} elevation={2}>
          <CardHeader
            title={
              <Typography
                variant={"subtitle1"}
                className={classes.borderBottom}
              >
                解説
              </Typography>
            }
          />
          <CardContent>
            <Typography variant={"body1"}>{selected.description}</Typography>
          </CardContent>
          {selected.references?.length > 0 && (
            <>
              <CardHeader
                title={
                  <Typography
                    variant={"subtitle1"}
                    className={clsx(classes.reference, classes.borderBottom)}
                  >
                    参考記事
                  </Typography>
                }
              />
              <CardContent>
                {selected.references.map((ref, i) => (
                  <ListItem
                    key={i}
                    button
                    component="a"
                    href={ref.requestUrl}
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                    className={clsx(
                      borderLeftColors[i % 3],
                      classes.referenceLink
                    )}
                  >
                    <ListItemIcon className={classes.referenceIcon}>
                      <img
                        src={`https://www.google.com/s2/favicons?domain=${
                          new URL(ref.requestUrl).hostname
                        }`}
                        loading="lazy"
                        alt={"favicon"}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={ref.ogTitle}
                      secondary={
                        ref.ogVideo && (
                          <iframe
                            title={ref.ogTitle}
                            src={ref.ogVideo.url}
                            loading="lazy"
                            width="100%"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                          />
                        )
                      }
                    />
                  </ListItem>
                ))}
              </CardContent>
            </>
          )}
        </Card>
      </Collapse>
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
      {listId && !isNaN(index) && (
        <ListContetnts listId={listId} index={index} />
      )}
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
    </Paper>
  );
};

export default React.memo(AnswerPanel);
