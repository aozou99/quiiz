import React from "react";
import { Container, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "30rem",
  },
  image: {
    width: 256,
  },
}));

const ReadyImage: React.FC = () => {
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.root}>
      <img
        src={require("./ready.png")}
        alt="準備中"
        className={classes.image}
      />
      <Typography variant="h4" color="textSecondary">
        準備中
      </Typography>
    </Container>
  );
};

export default ReadyImage;
