import {
  makeStyles,
  Theme,
  createStyles,
  Box,
  Typography,
  List,
} from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Item from "components/common/playList/Item";
import DummyItem from "components/common/playList/DummyItem";
import { useFetchPlayListsWithThumbnail } from "services/playList/PlayListHooks";
import useInfiniteScroll from "react-infinite-scroll-hook";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    listRoot: {
      padding: theme.spacing(1),
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
    center: {
      display: "flex",
      width: "100%",
      placeContent: "center",
      placeItems: "center",
    },
  })
);

type pagingParam = {
  lastListId?: string;
  channelId?: string;
  perCount?: number;
};
export const PlayListTabPannel: React.FC<{ channelId: string }> = ({
  channelId,
}) => {
  const [pagingParam, setPagingParam] = useState<pagingParam>({
    perCount: 8,
    channelId,
  });

  const { playLists, loaded, hasNext } = useFetchPlayListsWithThumbnail(
    pagingParam
  );
  const history = useHistory();
  const classes = useStyles();
  const handleLoadMore = () => {
    setPagingParam({
      lastListId: playLists[playLists.length - 1].id,
    });
  };

  const infiniteRef: any = useInfiniteScroll({
    loading: !loaded,
    hasNextPage: hasNext,
    onLoadMore: handleLoadMore,
  });

  return (
    <Box>
      <List className={classes.listRoot} ref={infiniteRef}>
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
          : Array.from({ length: 8 })
              .fill(null)
              .map((_, i) => <DummyItem key={i} />)}
      </List>
      {loaded && playLists.length === 0 && (
        <Box className={classes.center}>
          <Typography variant={"subtitle2"} color="textSecondary">
            このチャンネルには再生リストがありません
          </Typography>
        </Box>
      )}
    </Box>
  );
};
