import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Grow,
  Container,
  CircularProgress,
} from "@material-ui/core";
import { useListPannelStyles } from "components/main/quiz/playlist/sub/style/ListPannelStyle";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useFetchPlayListContents } from "services/playList/PlayListHooks";
import { QuizDisplay } from "types/QuizTypes";

const ListContetnts: React.FC<{ listId: string; index: number }> = ({
  listId,
  index,
}) => {
  const classes = useListPannelStyles();
  const history = useHistory();
  const { loaded, playList, quizzes } = useFetchPlayListContents(listId);
  const [, setTitle] = React.useState<string>("");
  const [quizList, setQuizList] = React.useState<QuizDisplay[]>();

  useEffect(() => {
    if (loaded && playList) {
      setTitle(playList.listName);
      setQuizList(quizzes);
    }
  }, [loaded, playList, quizzes]);

  return (
    <>
      {loaded ? (
        <List component="nav" aria-label="quiz lists">
          {quizList?.map((quiz: QuizDisplay, i: number) => (
            <React.Fragment key={quiz.id}>
              <Grow in={true}>
                <ListItem
                  button
                  selected={index === i}
                  onClick={() => {
                    return history.push(
                      `/play/${quiz.id}?list=${playList.id}&index=${i}`
                    );
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
                </ListItem>
              </Grow>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Container className={classes.center}>
          <CircularProgress />
        </Container>
      )}
    </>
  );
};

export default React.memo(ListContetnts);
