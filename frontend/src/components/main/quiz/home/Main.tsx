import React, { useState } from "react";
import { useFetchFirstDocuments } from "services/quiz/ExerciseHooks";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";
import Item from "components/main/quiz/home/sub/Item";
import AnswerPanel from "components/main/quiz/home/sub/AnswerPanel";
import { ExerciseResult } from "types/ExerciseTypes";
import DummyItem from "components/main/quiz/home/sub/DummyItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: grey[100],
      padding: theme.spacing(1),
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "start",
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
  })
);

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

const Main: React.FC = () => {
  const { firstDocuments, loaded } = useFetchFirstDocuments();
  const classes = useStyles();
  const [selected, setSelected] = useState<quiz>();
  const [result, setResult] = useState<ExerciseResult>(undefined);

  return (
    <Box className={clsx(classes.root)}>
      <Box className={classes.list}>
        {loaded
          ? firstDocuments.map((item: quiz) => (
              <Item
                key={item.id}
                thumbnail={item.thumbnail["640x360"]}
                question={item.question}
                authorName={item.authorName}
                authorImageUrl={item.authorImageUrl}
                handleClick={() => {
                  if (selected === item) {
                    setSelected(undefined);
                  } else {
                    setSelected(item);
                    setResult(undefined);
                  }
                }}
                isSelected={selected === item}
              />
            ))
          : Array.from({ length: 32 })
              .fill(null)
              .map((_, i) => <DummyItem key={i} />)}
      </Box>
      {selected && (
        <AnswerPanel
          selected={selected}
          result={result}
          setResult={setResult}
        />
      )}
    </Box>
  );
};

export default Main;
