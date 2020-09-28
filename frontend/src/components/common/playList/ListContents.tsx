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
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useListPannelStyles } from "components/main/quiz/playlist/sub/style/ListPannelStyle";
import React from "react";
import { useHistory } from "react-router-dom";
import { QuizDisplay } from "types/QuizTypes";

const ListContetnts: React.FC<{
  loaded: boolean;
  playList: any;
  quizzes: any;
  index: number;
}> = ({ loaded, playList, quizzes, index }) => {
  const classes = useListPannelStyles();
  const history = useHistory();

  return (
    <Box>
      {loaded ? (
        <Accordion classes={{ root: classes.accordionRoot }} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            classes={{
              root: classes.accordionSummaryRoot,
              content: classes.accordionSummaryContent,
            }}
          >
            <Typography variant="subtitle2">{playList.listName}</Typography>
            <Typography variant="caption" component="p" gutterBottom>{`${index +
              1} / ${quizzes?.length} ${playList.authorName}`}</Typography>
            <Divider />
          </AccordionSummary>
          <AccordionDetails classes={{ root: classes.accordionDetailsRoot }}>
            <List
              component="nav"
              aria-label="quiz lists"
              className={classes.list}
            >
              {quizzes?.map((quiz: QuizDisplay, i: number) => (
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
          </AccordionDetails>
        </Accordion>
      ) : (
        <Container className={classes.center}>
          <CircularProgress />
        </Container>
      )}
    </Box>
  );
};

export default React.memo(ListContetnts);
