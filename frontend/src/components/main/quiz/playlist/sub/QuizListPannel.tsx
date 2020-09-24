import React, { useEffect } from "react";
import {
  Box,
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
  Typography,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import { useFetchPlayListContents } from "services/playList/PlayListHooks";
import { QuizDisplay } from "types/QuizTypes";
import DeleteIcon from "@material-ui/icons/Delete";
import PlayListService from "services/playList/PlayListService";
import DummyQuizListPannel from "components/main/quiz/playlist/sub/DummyQuizListPannel";
import { EditableTextField } from "components/common/input/EditableTextField";
import { MetaTag } from "components/common/meta/MetaTag";
import { useListPannelStyles } from "components/main/quiz/playlist/sub/style/ListPannelStyle";

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

const QuizListPannel: React.FC<{
  setSelected: (quiz?: QuizDisplay) => void;
}> = ({ setSelected }) => {
  const classes = useListPannelStyles();
  const theme = useTheme();
  const isSmallerSm = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });
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
    if (loaded && playList) {
      setTitle(playList.listName);
      setPrivacy(playList.privacy);
      setQuizList(quizzes);
    }
  }, [loaded, playList, quizzes]);

  return (
    <>
      <MetaTag title={title || "再生リスト"} />
      {loaded && playList && (
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
                      if (isSmallerSm) {
                        return history.push(
                          `/play/${quiz.id}?list=LL&index=${i}`
                        );
                      }
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
                    {editable && (
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
                    )}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </Box>
      )}
      {!loaded && <DummyQuizListPannel />}
      {loaded && !playList && (
        <Box className={classes.center}>
          <Typography variant="subtitle1" color="textSecondary">
            指定された再生リストは存在しません
          </Typography>
        </Box>
      )}
    </>
  );
};

export default QuizListPannel;
