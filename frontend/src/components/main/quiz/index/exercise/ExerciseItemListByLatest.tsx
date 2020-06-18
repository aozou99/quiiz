import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles, Typography } from "@material-ui/core";
import SeriesItem from "components/main/quiz/index/sereise/SeriesItem";
import { grey } from "@material-ui/core/colors";
import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: grey[100],
      padding: theme.spacing(1),
      "& > h6": {
        margin: theme.spacing(0, 1),
      },
    },
    list: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
      "& > a": {
        margin: theme.spacing(1),
      },
    },
  })
);

type WorkBook = {
  id: number;
  imgPath: string;
  title: string;
  author: string;
  authorImgPath: string;
  size: number;
};

type Props = {
  category: string;
  itemList: WorkBook[];
};

const ItemListByCategory: React.FC<Props> = ({ category, itemList }) => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography variant="h6">{category}</Typography>
      <Box className={classes.list}>
        {itemList.map((item) => (
          <Link
            component={RouterLink}
            to={`/series/${item.id}`}
            underline="none"
          >
            <SeriesItem
              imgPath={item.imgPath}
              title={item.title}
              author={item.author}
              authorImgPath={item.authorImgPath}
              size={item.size}
            />
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default ItemListByCategory;
