import {
  Avatar,
  Box,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { useFetchQuiizUser } from "services/auth/AuthHooks";
import TwitterIcon from "@material-ui/icons/Twitter";
import LinkIcon from "@material-ui/icons/Link";
import { openAnotherTab, twitterLink } from "utils/helper/link";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      padding: theme.spacing(1.5),
    },
    avator: {
      marginRight: theme.spacing(1.5),
      width: theme.spacing(8),
      height: theme.spacing(8),
    },
    nameBox: {
      display: "flex",
      placeItems: "center",
    },
    name: {
      fontWeight: "bold",
    },
    description: {
      whiteSpace: "break-spaces",
    },
  })
);

export const AuthorProfile = ({ author }: { author: any }) => {
  const classes = useStyles();
  const history = useHistory();
  const { user, loaded } = useFetchQuiizUser(author.id);
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
        <Box className={classes.nameBox}>
          <Typography
            variant="subtitle1"
            className={classes.name}
            onClick={handleClickChannelLink}
          >
            {author.name}
          </Typography>
          {loaded && user.twitterAccount && (
            <IconButton
              edge="end"
              onClick={() => {
                openAnotherTab(twitterLink(user.twitterAccount));
              }}
            >
              <TwitterIcon color="primary" />
            </IconButton>
          )}
          {loaded && user.mySiteUrl && (
            <IconButton
              edge="end"
              onClick={() => {
                openAnotherTab(user.mySiteUrl);
              }}
            >
              <LinkIcon />
            </IconButton>
          )}
        </Box>
        <Typography
          variant="body1"
          color="textSecondary"
          className={classes.description}
        >
          {(loaded && user.description) || ""}
        </Typography>
      </Box>
    </Box>
  );
};
