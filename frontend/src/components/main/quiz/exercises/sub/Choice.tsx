import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography, Color } from '@material-ui/core';
import { outLinedButton, containedButton } from 'utils/materialUi/customizeHelper';
import { useDispatch, useSelector } from 'react-redux';
import { gameClear, gameOver } from 'modules/game/quizGameModule';
import { RootState } from 'modules/core/rootReducer';
import ClearIcon from '@material-ui/icons/Clear';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleOutlineTwoToneIcon from '@material-ui/icons/CheckCircleOutlineTwoTone';

type Props = {
  color: Color,
  label: string,
  text: string,
  isRight: boolean,
}
const labelCol = (theme: Theme, color: Color) => {
  return {
    padding: theme.spacing(1, 0),
    ...containedButton(theme, color),
    lineHeight: "inherit",
  }
}

const Choice: React.FC<Props> = ({ color, label, text, isRight }) => {
  const { result } = useSelector((state: RootState) => state.quizGame);
  const [isClicked, setIsClicked] = useState(false);
  const dispatch = useDispatch();

  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      button: {
        width: '100%',
        marginBottom: theme.spacing(2),
        padding: theme.spacing(0),
      },
      labelCol: labelCol(theme, color),
      outLinedButton: outLinedButton(theme, color),
      mainCol: {
        backgroundColor: () => isClicked ? color[100] : undefined,
        padding: theme.spacing(1),
        display: "flex",
      },
      icon: {
        fontSize: "2.6rem",
        marginRight: theme.spacing(1)
      }
    }),
  );

  const classes = useStyles();

  const handleClick = () => {
    if (result) return;
    dispatch(isRight ? gameClear() : gameOver());
    setIsClicked(!isClicked);
  }

  return (
    <Grid xs={12} item>
      <Button
        variant="outlined"
        className={`${classes.button} ${classes.outLinedButton}`}
        onClick={handleClick}
      >
        <Grid xs={2} item className={classes.labelCol}>
          <Typography variant="h5" style={{ lineHeight: "inherit" }}>{label}</Typography>
        </Grid>
        <Grid xs={10} item className={classes.mainCol}>
          {
            result === "wrong" &&
            isClicked &&
            (<ClearIcon color="disabled" className={classes.icon} />)
          }
          {
            result === "right" &&
            isClicked &&
            (<CheckCircleOutlineTwoToneIcon color="error" className={classes.icon} />)
          }
          {
            result === "wrong" &&
            !isClicked &&
            isRight &&
            (<RadioButtonUncheckedIcon color="error" className={classes.icon} />)
          }
          <Typography variant="h5" color="textPrimary" style={{ lineHeight: "inherit" }}>
            {text}
          </Typography>
        </Grid>
      </Button>
    </Grid>
  );
}

export default Choice;