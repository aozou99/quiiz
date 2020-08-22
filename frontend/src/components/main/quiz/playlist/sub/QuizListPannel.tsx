import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
  TextField,
  MenuItem,
} from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { useFetchPlayListContents } from "services/playList/PlayListHooks";
import { QuizDisplay } from "types/QuizTypes";
import { grey } from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";
import PlayListService from "services/playList/PlayListService";
import DummyQuizListPannel from "components/main/quiz/playlist/sub/DummyQuizListPannel";
import { EditableTextField } from "components/common/input/EditableTextField";

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
    noUnderLine: {
      "& .MuiInput-underline:before": {
        borderBottom: 0,
      },
    },
  })
);

const QuizListPannel: React.FC<{
  setSelected: (quiz?: QuizDisplay) => void;
  setResult: (result: undefined) => void;
}> = ({ setSelected, setResult }) => {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  const { loaded, playList, quizzes, editable } = useFetchPlayListContents(id);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [title, setTitle] = React.useState<string>("");
  const [privacy, setPrivacy] = React.useState<0 | 1>(0);
  const [quizList, setQuizList] = React.useState<QuizDisplay[]>();

  const handleSaveTitle = (title: string) => {
    return PlayListService.update(playList.id, {
      listName: title,
    });
  };
  const handleRemoveQuiz = (quiz: QuizDisplay) => {
    PlayListService.removeFromList(playList.id, quiz.id)?.then(() => {
      setQuizList((pre) => pre?.filter((q) => q !== quiz));
    });
  };

  useEffect(() => {
    if (loaded) {
      setTitle(playList.listName);
      setPrivacy(playList.privacy);
      setQuizList(quizzes);
    }
  }, [loaded, playList, quizzes]);

  return (
    <>
      {loaded ? (
        <Box className={classes.listPannel}>
          <Box className={classes.playListInfo}>
            <EditableTextField
              editable={editable}
              value={title}
              valueName={"再生リスト"}
              setValue={setTitle}
              onSave={handleSaveTitle}
              maxLength={50}
              onDelete={() => {
                PlayListService.delete(playList.id)?.then(() =>
                  history.push("/library")
                );
              }}
            />
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
        </Box>
      ) : (
        <DummyQuizListPannel />
      )}
    </>
  );
};

export default QuizListPannel;
