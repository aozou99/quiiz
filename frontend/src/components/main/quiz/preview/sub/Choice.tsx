import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { Typography, Color } from "@material-ui/core";
import {
  outLinedButton,
  containedButton,
} from "utils/materialUi/customizeHelper";
import ClearIcon from "@material-ui/icons/Clear";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckCircleOutlineTwoToneIcon from "@material-ui/icons/CheckCircleOutlineTwoTone";
import { ExerciseResult } from "types/ExerciseTypes";

type State = {
  color: Color;
  label: string;
  text: string;
  isRight: boolean;
  result: ExerciseResult;
  setResult: (result: ExerciseResult) => void;
};
const labelCol = (theme: Theme, color: Color) => {
  return {
    padding: theme.spacing(1, 0),
    ...containedButton(theme, color),
    lineHeight: "inherit",
  };
};

const Choice: React.FC<State> = ({
  color,
  label,
  text,
  isRight,
  result,
  setResult,
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      button: {
        width: "100%",
        margin: theme.spacing(1, 0),
        padding: theme.spacing(0),
        alignItems: "stretch",
      },
      labelCol: labelCol(theme, color),
      outLinedButton: outLinedButton(theme, color),
      mainCol: {
        backgroundColor: () => (isClicked ? color[100] : undefined),
        padding: theme.spacing(1),
        display: "flex",
      },
      icon: {
        fontSize: "1.7rem",
        marginRight: theme.spacing(1),
      },
    })
  );
  const classes = useStyles();

  const handleClick = () => {
    if (result) return;
    setResult(isRight ? "right" : "wrong");
    setIsClicked(!isClicked);
  };

  useEffect(() => {
    if (!result) setIsClicked(false);
  }, [result]);

  return (
    <Grid xs={12} item>
      <Button
        variant="outlined"
        className={`${classes.button} ${classes.outLinedButton}`}
        onClick={handleClick}
      >
        <Grid xs={2} item className={classes.labelCol}>
          <Typography variant="subtitle1" style={{ lineHeight: "inherit" }}>
            {label}
          </Typography>
        </Grid>
        <Grid xs={10} item className={classes.mainCol}>
          {result === "wrong" && isClicked && (
            <ClearIcon color="disabled" className={classes.icon} />
          )}
          {result === "right" && isClicked && (
            <CheckCircleOutlineTwoToneIcon
              color="error"
              className={classes.icon}
            />
          )}
          {result === "wrong" && !isClicked && isRight && (
            <RadioButtonUncheckedIcon color="error" className={classes.icon} />
          )}
          <Typography
            variant="subtitle1"
            color="textPrimary"
            style={{ lineHeight: "inherit" }}
          >
            {text}
          </Typography>
        </Grid>
      </Button>
    </Grid>
  );
};

export default Choice;
