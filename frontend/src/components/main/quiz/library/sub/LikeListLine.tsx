import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Box,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import { useFetchLikeQuizzes } from "services/quiz/QuizHooks";
import Item from "components/common/quiz/Item";
import DummyItem from "components/common/quiz/DummyItem";
import { QuizDisplay } from "types/QuizTypes";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subTitle: {
      display: "flex",
      alignItems: "center",
      "& svg.MuiSvgIcon-root": {
        marginRight: theme.spacing(1),
        color: grey[500],
      },
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "start",
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

type Props = {
  setSelected: (arg0: any) => any;
  setResult: (arg0: any) => any;
  selected: QuizDisplay | undefined;
};

const LikeListLine: React.FC<Props> = ({
  setSelected,
  setResult,
  selected,
}) => {
  const classes = useStyles();
  const { loaded, likedQuizzes } = useFetchLikeQuizzes();

  return (
    <>
      <Box className={classes.subTitle}>
        <FavoriteBorderOutlinedIcon />
        <Typography variant="subtitle1">いいねしたクイズ</Typography>
      </Box>
      <Box className={classes.list}>
        {loaded
          ? likedQuizzes.map((item: QuizDisplay) => (
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
          : Array.from({ length: 4 })
              .fill(null)
              .map((_, i) => <DummyItem key={i} />)}
      </Box>
    </>
  );
};

export default LikeListLine;
