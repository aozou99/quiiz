import React, { useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import {
  Box,
  Theme,
  createStyles,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  createMuiTheme,
  Button,
} from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { useFetchPlayListContents } from "services/playList/PlayListHooks";
import { QuizDisplay } from "types/QuizTypes";
import { grey } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useForm } from "react-hook-form";
import { PlayListFormData } from "types/PlayListTypes";
import BasicConfirmDialog from "components/common/dialog/BasicConfirmDialog";
import PlayListService from "services/playList/PlayListService";
import DummyQuizListPannel from "components/main/quiz/playlist/sub/DummyQuizListPannel";

const privacies = [
  {
    label: "公開",
    value: 0,
  },
  {
    label: "非公開",
    value: 1,
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    avator: {
      height: theme.spacing(9),
      width: theme.spacing(16),
    },
    listPannel: {
      backgroundColor: grey[50],
      "&>nav.MuiList-padding": {
        paddingTop: 0,
        paddingBottom: 0,
      },
      minHeight: `calc(100vh - ${theme.spacing(8)}px)`,
      marginRight: theme.spacing(1),
      width: theme.spacing(73),
    },
    listText: {
      height: theme.spacing(9),
      paddingLeft: theme.spacing(2),
    },
    playListInfo: {
      padding: theme.spacing(1, 2),
    },
    playListTitle: {
      display: "flex",
      placeItems: "center",
    },
    inputTitle: {
      fontSize: "20px",
    },
    inputTitleButtonGroup: {
      display: "flex",
      justifyContent: "flex-end",
    },
    editIcon: {
      marginLeft: "auto",
      marginRight: theme.spacing(-1.5),
    },
    helperText: {
      textAlign: "right",
    },
    noUnderLine: {
      "& .MuiInput-underline:before": {
        borderBottom: 0,
      },
    },
    displayNone: {
      display: "none",
    },
  })
);

const QuizListPannel: React.FC<{
  setSelected: (quiz?: QuizDisplay) => void;
  setResult: (result: undefined) => void;
}> = ({ setSelected, setResult }) => {
  const theme = createMuiTheme();
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const { loaded, playList, quizzes, editable } = useFetchPlayListContents(id);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [editTitle, setEditTitle] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [title, setTitle] = React.useState<string>("");
  const [privacy, setPrivacy] = React.useState<0 | 1>(0);
  const [quizList, setQuizList] = React.useState<QuizDisplay[]>();
  const { register, watch, errors } = useForm<PlayListFormData>({
    mode: "onBlur",
  });
  const fields = watch();
  const titleInputRef = useRef<HTMLInputElement>();

  const handleSaveTitle = () => {
    if (errors["listName"] || !fields["listName"]) {
      return;
    }
    PlayListService.update(playList.id, {
      listName: fields["listName"],
    })?.then(() => {
      setTitle(fields["listName"]);
      setEditTitle(false);
    });
  };
  const handleRemoveQuiz = (quiz: QuizDisplay) => {
    PlayListService.removeFromList(playList.id, quiz.id)?.then(() => {
      setQuizList((pre) => pre?.filter((q) => q !== quiz));
    });
  };
  const titleRegister = register({
    required: `タイトルを入力してください`,
    maxLength: {
      value: 50,
      message: `タイトルが長すぎます`,
    },
  });

  useEffect(() => {
    if (loaded) {
      setTitle(playList.listName);
      setPrivacy(playList.privacy);
      setQuizList(quizzes);
    }
  }, [loaded, playList]);

  return (
    <>
      {loaded ? (
        <Box className={classes.listPannel}>
          <Box className={classes.playListInfo}>
            {!editTitle && (
              <Box className={clsx(classes.playListTitle)}>
                <Typography variant={"h6"}>{title}</Typography>
                {editable && (
                  <Box className={clsx(classes.editIcon)}>
                    <IconButton
                      aria-label="edit"
                      size="medium"
                      onClick={() => {
                        setEditTitle(true);
                        setTimeout(() => {
                          titleInputRef?.current?.focus();
                        }, 100);
                      }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                      aria-label="edit"
                      size="medium"
                      onClick={() => {
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            )}
            <Box className={clsx(!editTitle && classes.displayNone)}>
              <TextField
                required
                margin="dense"
                id={"listName"}
                name={"listName"}
                defaultValue={playList?.listName || ""}
                label={errors["listName"]?.message}
                type="text"
                inputRef={(e) => {
                  titleRegister(e);
                  titleInputRef.current = e;
                }}
                inputProps={{
                  style: {
                    fontSize: theme.typography.h6.fontSize,
                  },
                }}
                fullWidth
                variant="standard"
                helperText={`${fields["listName"]?.length ||
                  playList?.listName.length ||
                  0}/${50}`}
                error={!!errors["listName"]}
                FormHelperTextProps={{ className: classes.helperText }}
                onKeyDown={(e) => {
                  if (e.which === 13) handleSaveTitle();
                  if (e.which === 27) setEditTitle(false);
                }}
              />
              <Box className={classes.inputTitleButtonGroup}>
                <Button
                  onClick={() => {
                    setEditTitle(false);
                  }}
                >
                  キャンセル
                </Button>
                <Button color="primary" onClick={handleSaveTitle}>
                  保存
                </Button>
              </Box>
            </Box>
            {editable && (
              <TextField
                id="privacy"
                name="privacy"
                select
                required
                className={classes.noUnderLine}
                onChange={(e) => {
                  const selectPrivacy = parseInt(e.target.value);
                  if (selectPrivacy === 0 || selectPrivacy === 1) {
                    PlayListService.update(playList.id, {
                      privacy: selectPrivacy,
                    })?.then(() => {
                      setPrivacy(selectPrivacy);
                    });
                  }
                }}
                value={privacy}
              >
                {privacies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
          <List component="nav" aria-label="quiz lists">
            {loaded &&
              quizList?.map((quiz: QuizDisplay, i: number) => (
                <React.Fragment key={quiz.id}>
                  <ListItem
                    button
                    selected={selectedIndex === i}
                    onClick={() => {
                      setResult(undefined);
                      setSelectedIndex(i);
                      setSelected(quiz);
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={quiz.question}
                        src={quiz.thumbnail["256x144"]}
                        variant="square"
                        className={classes.avator}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={quiz.question}
                      secondary={quiz.authorName}
                      className={classes.listText}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => {
                          handleRemoveQuiz(quiz);
                          setSelected(undefined);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
          <BasicConfirmDialog
            open={openDeleteDialog}
            title={"再生リストの削除"}
            body={
              <>
                本当に
                <Typography
                  variant={"h6"}
                  component={"span"}
                  color={"secondary"}
                  display={"inline"}
                >
                  {playList.listName}
                </Typography>
                を削除して良いですか？
              </>
            }
            yesOnClick={() => {
              PlayListService.delete(playList.id)?.then(() =>
                history.push("/library")
              );
              setOpenDeleteDialog(false);
            }}
            setOpen={setOpenDeleteDialog}
          />
        </Box>
      ) : (
        <DummyQuizListPannel />
      )}
    </>
  );
};

export default QuizListPannel;
