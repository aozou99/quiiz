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
import { useFetchPlayListsWithThumbnail } from "services/playList/PlayListHooks";
import Item from "components/common/playList/Item";
import DummyItem from "components/common/playList/DummyItem";
import { useHistory } from "react-router-dom";

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
        margin: theme.spacing(1),
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
  const { playLists, loaded } = useFetchPlayListsWithThumbnail();
  const history = useHistory();

  return (
    <>
      <Box className={classes.subTitle}>
        <PlaylistPlayIcon />
        <Typography variant="subtitle1">再生リスト</Typography>
      </Box>
      <Box className={classes.list}>
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
    </>
  );
};

export default PlayListLine;
