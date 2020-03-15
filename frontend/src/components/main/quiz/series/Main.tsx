import React from 'react';
import Head from 'components/main/quiz/series/sub/Head';
import { makeStyles, Theme, createStyles, Container } from '@material-ui/core';
import ExerciseList from 'components/main/quiz/series/sub/ExerciseList';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2),
    },
  }),
);

const Main: React.FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="md" className={classes.root}>
      <Head/>
      <ExerciseList/>
    </Container>
  );
}

export default Main;