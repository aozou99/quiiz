import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Avatar, Grid, Theme, createStyles } from "@material-ui/core";
import clsx from "clsx";
import { themeColors } from "components/core/CustomeTheme";

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
      height: 160,
    },
    content: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.spacing(1, 2),
    },
    count: {
      backgroundColor: themeColors.primary[500],
      color: "white",
    },
    title: {
      color: "white",
    },
  })
);

type Props = {
  playListName: string;
  thumbnail: string;
  description: string;
  count: string;
  handleClick: () => any;
};

const Item: React.FC<Props> = ({
  playListName,
  thumbnail,
  description,
  count,
  handleClick,
}) => {
  const classes = useStyles();

  return (
    <Card className={clsx(classes.root)} onClick={handleClick}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image={thumbnail}
          title={playListName}
        />
        <CardContent className={classes.content}>
          <Grid container spacing={0}>
            <Grid item xs={9}>
              <Typography
                gutterBottom
                variant="subtitle1"
                component="h4"
                className={classes.title}
              >
                {playListName}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {description}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Avatar alt={"NumberOfQuizzes"} className={classes.count}>
                {count}
              </Avatar>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Item;
