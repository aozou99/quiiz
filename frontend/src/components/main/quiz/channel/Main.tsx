import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { ChannelHeader } from "components/main/quiz/channel/sub/ChannelHeader";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "inherit",
      minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
    },
  })
);

const Main: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams();

  return (
    <Box className={clsx(classes.root)}>
      <ChannelHeader channelId={id} />
    </Box>
  );
};

export default Main;
