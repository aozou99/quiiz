import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Box,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import React from "react";
import { useFetchMyPlayList } from "services/playList/PlayListHooks";
import Item from "components/common/playList/Item";
import DummyItem from "components/common/playList/DummyItem";

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
        margin: theme.spacing(2),
      },
      flex: "5",
      [theme.breakpoints.down("xs")]: {
        flex: "4",
      },
    },
  })
);

const PlayListLine: React.FC = () => {
  const classes = useStyles();
  const { myPlayLists, loaded } = useFetchMyPlayList();

  return (
    <>
      <Box className={classes.subTitle}>
        <PlaylistPlayIcon />
        <Typography variant="subtitle1">再生リスト</Typography>
      </Box>
      <Box className={classes.list}>
        {loaded
          ? myPlayLists.map((item: any) => (
              <Item
                key={item.id}
                thumbnail={item.thumbnail["640x360"]}
                playListName={item.listName}
                count={item.quizCount}
                description={item.description}
                handleClick={() => {
                  // if (selected === item) {
                  //   setSelected(undefined);
                  // } else {
                  //   setSelected(item);
                  //   setResult(undefined);
                  // }
                }}
              />
            ))
          : Array.from({ length: 4 })
              .fill(null)
              .map((_, i) => <DummyItem key={i} />)}
      </Box>
    </>
  );
};

export default PlayListLine;
