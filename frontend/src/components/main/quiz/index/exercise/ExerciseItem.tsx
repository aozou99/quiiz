import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Avatar, Grid, Theme, createStyles } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: "250px",
      maxWidth: "300px",
      flexGrow: 1,
      [theme.breakpoints.down("xs")]: {
        minWidth: "350px",
        maxWidth: "350px",
      },
    },
    media: {
      height: 140,
    },
  })
);

type Props = {
  title: string;
  imgPath: string;
  author: string;
  authorImgPath: string;
  size: Number;
};

const ExerciseItem: React.FC<Props> = ({
  title,
  imgPath,
  author,
  authorImgPath,
  size,
}) => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia className={classes.media} image={imgPath} title={title} />
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Avatar alt={author} src={authorImgPath} />
            </Grid>
            <Grid item xs={9}>
              <Typography gutterBottom variant="subtitle2" component="h4">
                {title}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {author}
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                問題数: {size}問
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ExerciseItem;
