import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Theme,
  createStyles,
  Divider,
  Typography,
  Paper,
} from "@material-ui/core";
import Item from "components/main/quiz/single/sub/Item";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import Choices from "components/main/quiz/preview/sub/Choices";
import { ExerciseResult, ExerciseData } from "types/ExerciseTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: grey[100],
      padding: theme.spacing(1),
      display: "flex",
      flexWrap: "nowrap",
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      "& > *": {
        margin: theme.spacing(1),
      },
      flex: "5",
      [theme.breakpoints.down("xs")]: {
        flex: "4",
      },
    },
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
      borderRadius: theme.spacing(1),
      position: "sticky",
      top: theme.spacing(10),
      overflowY: "auto",
      height: "100vh",
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
  })
);

type quiz = {
  id: number;
  imgPath: string;
  title: string;
  author: string;
  authorImgPath: string;
};

type Props = {
  itemList: quiz[];
};

const ItemList: React.FC<Props> = ({ itemList }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState<quiz>();
  const [result, setResult] = useState<ExerciseResult>(undefined);
  const choices = (e: ExerciseData): [string, string, string, string] => [
    e.selectA,
    e.selectB,
    e.selectC,
    e.selectD,
  ];

  return (
    <Box className={clsx(classes.root)}>
      <Box className={classes.list}>
        {itemList.map((item) => (
          <Item
            imgPath={item.imgPath}
            title={item.title}
            author={item.author}
            authorImgPath={item.authorImgPath}
            handleClick={() => {
              if (selected === item) {
                setSelected(undefined);
              } else {
                setSelected(item);
              }
            }}
            isSelected={selected === item}
          />
        ))}
      </Box>
      {selected && (
        <Paper elevation={1} className={classes.detail}>
          <img src={selected.imgPath} />
          <Typography align="center" variant="subtitle1">
            {selected.title}
          </Typography>
          <Divider />
          <Choices
            result={result}
            setResult={setResult}
            choices={[
              "仁王立ちをする",
              "死んだふりをする",
              "しっぽを切る",
              "うんちする",
            ]}
            answer={2}
          />
        </Paper>
      )}
    </Box>
  );
};

export default ItemList;
