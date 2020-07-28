import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles, Divider } from "@material-ui/core";
import clsx from "clsx";
import PlayListLine from "components/main/quiz/library/sub/PlayListLine";
import LikeListLine from "components/main/quiz/library/sub/LikeListLine";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1, 3),
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
  })
);

const Main: React.FC = () => {
  const classes = useStyles();

  return (
    <Box className={clsx(classes.root)}>
      <PlayListLine />
      <Divider className={classes.divider} />
      <LikeListLine />
    </Box>
  );
};

export default Main;
