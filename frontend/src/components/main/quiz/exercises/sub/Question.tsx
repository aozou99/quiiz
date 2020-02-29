import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Zoom } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { RootState } from 'modules/core/rootReducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "100%",
      marginTop: theme.spacing(2),
    }
  }),
);

export default function Question() {
  const classes = useStyles();
  const { quiz, result } = useSelector((state: RootState) => state.quizGame)

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          image={quiz.imgPath}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" color="textSecondary" component="h2">
            {quiz.question}
          </Typography>
          <Zoom in={result !== null} style={{
            transitionDelay: result !== null ? '100ms' : '0ms',
            display: result !== null ? 'block' : 'none',
          }}>
            <Typography variant="h6" component="span">
              正解: {quiz.choices[quiz.answer]}
            </Typography>
          </Zoom>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}