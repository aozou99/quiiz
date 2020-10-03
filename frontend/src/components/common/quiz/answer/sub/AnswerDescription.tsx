import {
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Typography,
} from "@material-ui/core";
import { AnswerReference } from "components/common/quiz/answer/sub/AnswerReference";
import { themeColors } from "components/core/CustomeTheme";
import React from "react";
import { QuizDisplay } from "types/QuizTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    description: {
      whiteSpace: "pre-line",
      backgroundColor: "rgba(0, 0, 0, 0.87)",
      padding: theme.spacing(1),
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1),
      "& .MuiCardHeader-root, .MuiCardContent-root": {
        padding: theme.spacing(1),
      },
      "& .MuiCardHeader-root": {
        paddingBottom: theme.spacing(0),
      },
      color: "white",
      "& .MuiCardHeader-content": {
        color: themeColors.primary[400],
        "& .MuiTypography-root": {
          fontWeight: "bold",
        },
      },
    },
    borderBottom: {
      borderBottom: `thin solid`,
    },
  })
);
export const AnswerDescription = ({
  open,
  selected,
}: {
  open: boolean;
  selected: QuizDisplay;
}) => {
  const classes = useStyles();
  return (
    <Collapse in={open} timeout="auto">
      <Card className={classes.description} elevation={2}>
        <CardHeader
          title={
            <Typography variant={"subtitle1"} className={classes.borderBottom}>
              解説
            </Typography>
          }
        />
        <CardContent>
          <Typography variant={"body1"}>{selected.description}</Typography>
        </CardContent>
        {selected.references?.length > 0 && (
          <AnswerReference references={selected.references} />
        )}
      </Card>
    </Collapse>
  );
};
