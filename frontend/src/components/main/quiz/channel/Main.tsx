import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import { ChannelHeader } from "components/main/quiz/channel/sub/header/ChannelHeader";
import { BasicTab } from "components/common/tab/BasicTab";
import { QuizTabPannel } from "components/main/quiz/channel/sub/tabPannel/QuizTabPannel";
import { PlayListTabPannel } from "components/main/quiz/channel/sub/tabPannel/PlayListTabPannel";
import { useQuery } from "utils/helper/queryParameter";
import { ProfileTabPannel } from "components/main/quiz/channel/sub/tabPannel/ProfileTabPannel";
import { useFetchQuiizUser } from "services/auth/AuthHooks";
import { AccountSettingTabPannel } from "components/main/quiz/channel/sub/tabPannel/AccountSettingTabPannel";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: "inherit",
      minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
      [theme.breakpoints.down("sm")]: {
        minHeight: `calc(100vh - ${theme.spacing(15)}px)`,
      },
      [theme.breakpoints.down("xs")]: {
        minHeight: `calc(100vh - ${theme.spacing(15)}px)`,
      },
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
  const query = useQuery();
  const queryTabIndex = Number.parseInt(query.get("tabIndex") || "0") || 0;
  const [selectedTab, setSelectedTab] = useState(queryTabIndex);
  const { loaded, isMe } = useFetchQuiizUser(id);
  const [tabs, setTabs] = useState([
    {
      tabLabel: "クイズ",
      childPannel: <QuizTabPannel channelId={id} />,
    },
    {
      tabLabel: "再生リスト",
      childPannel: <PlayListTabPannel channelId={id} />,
    },
    {
      tabLabel: "プロフィール",
      childPannel: <ProfileTabPannel channelId={id} />,
    },
  ]);

  useEffect(() => {
    setSelectedTab(queryTabIndex);
    if (loaded && isMe) {
      setTabs(pre => [
        ...pre,
        {
          tabLabel: "🔒 アカウント設定",
          childPannel: <AccountSettingTabPannel />,
        },
      ]);
    }
  }, [queryTabIndex, loaded, isMe, id]);

  return (
    <Box className={clsx(classes.root)}>
      <ChannelHeader channelId={id} />
      <BasicTab
        tabsprops={tabs}
        tabsClassName={classes.tabs}
        selectedTab={selectedTab}
      />
    </Box>
  );
};

export default Main;
