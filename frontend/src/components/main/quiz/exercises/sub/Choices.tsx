import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Choice from 'components/main/quiz/exercises/sub/Choice';
import { themeColors } from "components/core/CustomeTheme";
import { useSelector } from 'react-redux';
import { RootState } from 'modules/core/rootReducer';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(2, 0),
    },
  })
);

const labelColorsMap = new Map([
  ["A", themeColors.primary],
  ["B", themeColors.secondary],
  ["C", themeColors.tertiary],
  ["D", themeColors.quaternary],
]);

const Choices: React.FC = () => {
  const classes = useStyles();
  const { quiz } = useSelector((state: RootState) => state.quizGame);

  return (
    <Grid container className={classes.root}>
      {Array.from(labelColorsMap.keys()).map((label, i) => (
        <Choice
          key={label}
          color={labelColorsMap.get(label) ?? grey}
          label={label}
          text={quiz.choices[i]}
          isRight={quiz.answer === i} />
      ))}
    </Grid>
  );
}

export default Choices;