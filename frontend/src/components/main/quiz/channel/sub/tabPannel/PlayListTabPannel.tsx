import { makeStyles, Theme, createStyles, Box } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import Item from "components/common/playList/Item";
import DummyItem from "components/common/playList/DummyItem";
import { useFetchPlayListsWithThumbnail } from "services/playList/PlayListHooks";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1),
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

export const PlayListTabPannel: React.FC<{ channelId: string }> = (
  channelId
) => {
  const { playLists, loaded } = useFetchPlayListsWithThumbnail(channelId);
  const history = useHistory();
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      {loaded
        ? playLists.map((item: any) => (
            <Item
              key={item.id}
              thumbnail={item.thumbnail["640x360"]}
              playListName={item.listName}
              count={item.quizCount}
              description={item.description}
              handleClick={() => {
                history.push(`/playlist/${item.id}`);
              }}
            />
          ))
        : Array.from({ length: 4 })
            .fill(null)
            .map((_, i) => <DummyItem key={i} />)}
    </Box>
  );
};
