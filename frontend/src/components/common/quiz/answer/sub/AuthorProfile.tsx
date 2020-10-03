import {
  Avatar,
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      placeItems: "center",
      padding: theme.spacing(1.5),
    },
    avator: {
      marginRight: theme.spacing(1.5),
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
  })
);

export const AuthorProfile = ({ author }: { author: any }) => {
  const classes = useStyles();
  const history = useHistory();
  const handleClickChannelLink = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    history.push(`/channel/${author.id}`);
  };
  return (
    <Box className={classes.root}>
      <Avatar
        alt={author.name}
        src={author.imgUrl}
        onClick={handleClickChannelLink}
        className={classes.avator}
      />
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          {author.name}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {author.description || ""}
        </Typography>
      </Box>
    </Box>
  );
};
