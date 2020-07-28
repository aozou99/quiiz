import {
  makeStyles,
  Theme,
  createStyles,
  GridList,
  GridListTile,
  Typography,
  GridListTileBar,
  IconButton,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay";
import React from "react";
import InfoIcon from "@material-ui/icons/Info";

const tileData = [
  {
    img: "/images/mock/animal/araiguma.jpg",
    title: "アライグマ",
    author: "aozou 99",
  },
  {
    img: "/images/mock/animal/cat.jpg",
    title: "アライグマ",
    author: "aozou 99",
  },
  {
    img: "/images/mock/animal/elephant.jpg",
    title: "アライグマ",
    author: "aozou 99",
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    subTitle: {
      "&>.MuiGridListTile-tile": {
        display: "flex",
        alignItems: "center",
      },
      "& svg.MuiSvgIcon-root": {
        marginRight: theme.spacing(1),
        color: grey[500],
        fontSize: "2rem",
      },
    },
    icon: {
      color: "rgba(255, 255, 255, 0.54)",
    },
  })
);

const PlayListLine: React.FC = () => {
  const classes = useStyles();

  return (
    <GridList cellHeight={180} cols={4}>
      <GridListTile
        key="Subheader"
        cols={4}
        className={classes.subTitle}
        style={{ height: "auto" }}
      >
        <PlaylistPlayIcon />
        <Typography variant="subtitle1">再生リスト</Typography>
      </GridListTile>
      {tileData.map((tile) => (
        <GridListTile key={tile.img} cols={1}>
          <img src={tile.img} alt={tile.title} />
          <GridListTileBar
            title={tile.title}
            subtitle={<span>by: {tile.author}</span>}
            actionIcon={
              <IconButton
                aria-label={`info about ${tile.title}`}
                className={classes.icon}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </GridListTile>
      ))}
    </GridList>
  );
};

export default PlayListLine;
