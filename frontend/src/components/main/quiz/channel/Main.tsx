import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { ChannelHeader } from "components/main/quiz/channel/sub/header/ChannelHeader";
import { BasicTab } from "components/common/tab/BasicTab";
import { QuizTabPannel } from "components/main/quiz/channel/sub/tabPannel/QuizTabPannel";
import { PlayListTabPannel } from "components/main/quiz/channel/sub/tabPannel/PlayListTabPannel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "inherit",
      minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
    },
    paddingLeft: {
      paddingLeft: theme.spacing(3),
    },
    tabs: {
      backgroundColor: theme.palette.background.default,
    },
  })
);

const Main: React.FC = () => {
  const classes = useStyles();
  const { id } = useParams();

  return (
    <Box className={clsx(classes.root)}>
      <ChannelHeader channelId={id} />
      <BasicTab
        tabsprops={[
          {
            tabLabel: "クイズ",
            childPannel: <QuizTabPannel channelId={id} />,
          },
          {
            tabLabel: "再生リスト",
            childPannel: <PlayListTabPannel channelId={id} />,
          },
        ]}
        tabsClassName={classes.tabs}
      />
    </Box>
  );
};

export default Main;
