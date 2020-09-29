import { makeStyles, Theme, createStyles, Box, List } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Item from "components/common/playList/Item";
import DummyItem from "components/common/playList/DummyItem";
import { useFetchPlayListsWithThumbnail } from "services/playList/PlayListHooks";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { Description } from "components/common/content/Description";
import LocalHotelIcon from "@material-ui/icons/LocalHotel";

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
  channelId?: string;
  perCount?: number;
  nextPlayList?: any;
};
export const PlayListTabPannel: React.FC<{ channelId: string }> = ({
  channelId,
}) => {
  const [pagingParam, setPagingParam] = useState<pagingParam>({
    perCount: 16,
    channelId,
  });

  const {
    playLists,
    loaded,
    hasNext,
    nextPlayList,
  } = useFetchPlayListsWithThumbnail(pagingParam);
  const history = useHistory();
  const classes = useStyles();
  const handleLoadMore = () => {
    setPagingParam((pre) => {
      return {
        ...pre,
        nextPlayList,
      };
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
        <Description
          icon={<LocalHotelIcon style={{ fontSize: 120 }} color="action" />}
          title={"このチャンネルには\n再生リストがありません"}
          caption={"いつか再生リストが生まれるかも"}
          inTab={true}
        />
      )}
    </Box>
  );
};
