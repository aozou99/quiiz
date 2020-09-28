import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Box,
  Button,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import React from "react";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import { usePagenateLikeQuizzes } from "services/quiz/QuizHooks";
import Item from "components/common/quiz/Item";
import DummyItem from "components/common/quiz/DummyItem";
import { QuizDisplay } from "types/QuizTypes";
import { useHistory } from "react-router-dom";

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
    showAll: {
      marginLeft: "auto",
    },
    noItemsCaption: {
      marginRight: "auto",
    },
  })
);

type Props = {
  setSelected: (arg0: any) => any;
  selected: QuizDisplay | undefined;
};

const LikeListLine: React.FC<Props> = ({ setSelected, selected }) => {
  const classes = useStyles();
  const { loaded, likedQuizzes, hasNext } = usePagenateLikeQuizzes({
    perCount: 4,
  });
  const history = useHistory();
  const theme = useTheme();
  const isSmallerSm = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });

  return (
    <>
      <Box className={classes.subTitle}>
        <FavoriteBorderOutlinedIcon />
        <Typography variant="subtitle1">いいねしたクイズ</Typography>
        {hasNext && (
          <Button
            color="primary"
            variant="text"
            className={classes.showAll}
            onClick={() => history.push("/playlist?list=LL")}
          >
            すべてを表示する
          </Button>
        )}
      </Box>
      <Box className={classes.list}>
        {loaded && likedQuizzes
          ? likedQuizzes.map((item: QuizDisplay, i: number) => (
              <Item
                key={item.id}
                thumbnail={item.thumbnail["640x360"]}
                question={item.question}
                authorId={item.authorId}
                authorName={item.authorName}
                authorImageUrl={item.authorImageUrl}
                handleClick={() => {
                  if (isSmallerSm) {
                    return history.push(`/play/${item.id}?list=LL&index=${i}`);
                  }
                  if (selected === item) {
                    setSelected(undefined);
                  } else {
                    setSelected(item);
                  }
                }}
                isSelected={selected === item}
              />
            ))
          : Array.from({ length: 4 })
              .fill(null)
              .map((_, i) => <DummyItem key={i} />)}
        {loaded && likedQuizzes.length === 0 && (
          <Typography
            variant={"subtitle2"}
            color="textSecondary"
            className={classes.noItemsCaption}
          >
            いいねをしたクイズがここに表示されます
          </Typography>
        )}
      </Box>
    </>
  );
};

export default LikeListLine;
