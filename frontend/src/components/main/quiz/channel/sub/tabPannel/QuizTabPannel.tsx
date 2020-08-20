import { makeStyles, Theme, createStyles, Box } from "@material-ui/core";
import React, { useState } from "react";
import { useFetchFirstDocuments } from "services/quiz/QuizHooks";
import { QuizDisplay, QuizResult } from "types/QuizTypes";
import Item from "components/common/quiz/Item";
import DummyItem from "components/common/quiz/DummyItem";
import AnswerPanel from "components/common/quiz/AnswerPanel";
import clsx from "clsx";

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

export const QuizTabPannel: React.FC<{ channelId: string }> = ({
  channelId,
}) => {
  const { firstDocuments, loaded } = useFetchFirstDocuments({
    channelId,
  });
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
                authorId={item.authorId}
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
