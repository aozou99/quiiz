import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Avatar, Grid, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexBasis: "250px",
      maxWidth: "300px",
      minWidth: "220px",
      flexGrow: 1,
      [theme.breakpoints.down("xs")]: {
        flexBasis: "250px",
        maxWidth: "350px",
      },
      "& .MuiCardActionArea-focusHighlight": {
        height: "130%",
      },
      "& .MuiTouchRipple-root": {
        height: "130%",
      },
    },
    media: {
      height: 140,
    },
    selected: {
      border: "1px solid",
      boxSizing: "border-box",
      borderColor: "#4285f4",
      borderRadius: theme.spacing(1),
      backgroundColor: "#e8f0fe",
    },
    hoverBackGround: {
      padding: theme.spacing(0.5, 1),
      marginLeft: theme.spacing(-1),
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: theme.spacing(1),
      },
    },
  })
);

type Props = {
  question: string;
  thumbnail: string;
  authorId: string;
  authorName: string;
  authorImageUrl: string;
  handleClick: () => any;
  isSelected: boolean;
};

const Item: React.FC<Props> = ({
  question,
  thumbnail,
  authorId,
  authorName,
  authorImageUrl,
  handleClick,
  isSelected,
}) => {
  const classes = useStyles();
  const history = useHistory();
  const handleClickChannelLink = () => {
    history.push(`/channel/${authorId}`);
  };
  return (
    <Card
      className={clsx(classes.root, isSelected && classes.selected)}
      onClick={handleClick}
    >
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={thumbnail}
          title={question}
        />
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Avatar
                alt={authorName}
                src={authorImageUrl}
                onClick={handleClickChannelLink}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography gutterBottom variant="subtitle2" component="h4">
                {question}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
                onClick={handleClickChannelLink}
                className={classes.hoverBackGround}
              >
                {authorName}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Item;
