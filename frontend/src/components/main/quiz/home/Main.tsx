import React, { useState } from "react";
import { useFetchFirstDocuments } from "services/quiz/QuizHooks";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";
import Item from "components/common/quiz/Item";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import { QuizResult, QuizDisplay } from "types/QuizTypes";
import DummyItem from "components/common/quiz/DummyItem";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "start",
      backgroundColor: "inherit",
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

const Main: React.FC = () => {
  const { firstDocuments, loaded } = useFetchFirstDocuments();
  const classes = useStyles();
  const [selected, setSelected] = useState<QuizDisplay>();
  const [result, setResult] = useState<QuizResult>(undefined);

  return (
    <Box className={clsx(classes.root)}>
      <Box className={classes.list}>
        {loaded
          ? firstDocuments.map((item: QuizDisplay) => (
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
