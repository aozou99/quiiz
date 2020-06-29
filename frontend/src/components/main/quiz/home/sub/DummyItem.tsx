import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import { Avatar, Grid, Theme, createStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

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
    },
    media: {
      height: 140,
      backgroundColor: grey["A100"],
    },
    title: {
      backgroundColor: grey["A100"],
      width: "100%",
      height: "20px",
      marginBottom: theme.spacing(1),
    },
    subTitle: {
      backgroundColor: grey["A100"],
      width: "60%",
      height: "20px",
    },
  })
);

const DummyItem: React.FC = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <div className={classes.media} />
        <CardContent>
          <Grid container spacing={0}>
            <Grid item xs={3}>
              <Avatar />
            </Grid>
            <Grid item xs={9}>
              <div className={classes.title} />
              <div className={classes.subTitle} />
            </Grid>
          </Grid>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DummyItem;
