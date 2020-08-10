import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import { Theme, createStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import Skeleton from "@material-ui/lab/Skeleton";

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
      height: 160,
      backgroundColor: grey["A100"],
    },
  })
);

const DummyItem: React.FC = () => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <Skeleton animation="wave" variant="rect" className={classes.media} />
      </CardActionArea>
    </Card>
  );
};

export default DummyItem;
