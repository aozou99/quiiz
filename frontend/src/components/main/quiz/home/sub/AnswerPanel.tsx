import {
  Paper,
  Box,
  Typography,
  Divider,
  Tooltip,
  Collapse,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  makeStyles,
  createStyles,
  Theme,
  IconButton,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useState } from "react";
import Choices from "components/main/quiz/preview/sub/Choices";
import { themeColors } from "components/core/CustomeTheme";
import FolderIcon from "@material-ui/icons/Folder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { QuizResult } from "types/QuizTypes";
import QuizService from "services/quiz/QuizService";
import { useFetchGood } from "services/quiz/QuizHooks";

type quiz = {
  id: string;
  thumbnail: { "256x144": string; "640x360": string };
  question: string;
  authorName: string;
  authorImageUrl: string;
  selectA: string;
  selectB: string;
  selectC: string;
  selectD: string;
  answer: 0 | 1 | 2 | 3;
  description: string;
};

type Props = {
  selected: quiz;
  result: QuizResult;
  setResult: React.Dispatch<React.SetStateAction<QuizResult>>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    detail: {
      flex: "3",
      [theme.breakpoints.down("xs")]: {
        flex: "5",
      },
      backgroundColor: "white",
      margin: theme.spacing(1),
      maxWidth: theme.spacing(70),
      minWidth: theme.spacing(56),
      padding: theme.spacing(2),
      position: "sticky",
      top: theme.spacing(10),
      overflowY: "auto",
      height: "85vh",
      "& > img": {
        display: "block",
        margin: "auto",
        marginBottom: theme.spacing(1),
        borderRadius: theme.spacing(1),
      },
      "& > hr": {
        margin: theme.spacing(1),
      },
    },
    icons: {
      display: "flex",
      justifyContent: "space-evenly",
    },
    iconSelectedPink: {
      color: themeColors.secondary[500],
    },
    iconSelectedYellow: {
      color: themeColors.quaternary[500],
    },
    goodCount: {
      marginLeft: theme.spacing(1),
    },
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
    avatorSizeSmall: {
      width: theme.spacing(3),
      height: theme.spacing(3),
      backgroundColor: themeColors.primary[400],
    },
  })
);

const AnswerPanel: React.FC<Props> = ({ selected, result, setResult }) => {
  const classes = useStyles();
  const [goodClick, setGoodClick] = useState(false);
  const { loaded, isGood, goodCount } = useFetchGood(selected.id, goodClick);
  const choices = (e: quiz): [string, string, string, string] => [
    e.selectA,
    e.selectB,
    e.selectC,
    e.selectD,
  ];
  const handleGood = () => {
    QuizService.goodOrCancel(selected.id, () => {
      setGoodClick(!goodClick);
    });
  };

  return (
    <Paper elevation={1} className={classes.detail}>
      <img src={selected.thumbnail["256x144"]} alt={selected.question} />
      <Typography align="center" variant="subtitle1">
        {selected.question}
      </Typography>
      <Divider />
      <Choices
        result={result}
        setResult={setResult}
        choices={choices(selected)}
        answer={selected.answer}
      />
      <Collapse
        in={!!result && (selected?.description?.length || 0) > 0}
        timeout="auto"
      >
        <Card className={classes.description} elevation={2}>
          <CardHeader
            title={<Typography variant={"subtitle1"}>Tips</Typography>}
            avatar={
              <Avatar
                aria-label="description"
                className={classes.avatorSizeSmall}
              >
                ?
              </Avatar>
            }
          />
          <CardContent>
            <Typography variant={"body1"}>{selected.description}</Typography>
          </CardContent>
        </Card>
      </Collapse>
      <Box className={classes.icons}>
        <Tooltip title="いいね">
          <IconButton aria-label="good" onClick={handleGood}>
            <FavoriteIcon
              className={clsx(loaded && isGood && classes.iconSelectedPink)}
            />
            {loaded && (
              <Typography variant={"subtitle1"} className={classes.goodCount}>
                {goodCount}
              </Typography>
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="リストに追加">
          <IconButton aria-label="good">
            <FolderIcon className={clsx(classes.iconSelectedYellow)} />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default AnswerPanel;
