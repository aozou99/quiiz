import React, { useState } from "react";
import { useFetchFirstDocuments } from "services/quiz/QuizHooks";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: grey[100],
      padding: theme.spacing(1),
      display: "flex",
      flexWrap: "nowrap",
      alignItems: "start",
      height: "inherit",
    },
  })
);

const Main: React.FC = () => {
  const classes = useStyles();

  return <Box className={clsx(classes.root)}></Box>;
};

export default Main;
