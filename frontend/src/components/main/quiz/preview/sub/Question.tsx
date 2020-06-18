import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { Zoom, useTheme, useMediaQuery } from "@material-ui/core";
import imageUrl from "utils/helper/imageUrl";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: "100%",
      marginTop: theme.spacing(2)
    }
  })
);

type State = {
  result: "right" | "wrong" | undefined;
  thumbnail: string;
  question: string;
  answerLabel: string;
};

const Question: React.FC<State> = ({
  result,
  thumbnail,
  question,
  answerLabel
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));
  const [img, setImg] = useState(undefined);
  useEffect(() => {
    const size = matches ? "256x144" : "640x360";
    imageUrl(thumbnail, size).then(url => setImg(url));
  }, [matches, thumbnail]);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        {img && <CardMedia component="img" image={img} />}
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            color="textSecondary"
            component="h2"
          >
            {question}
          </Typography>
          <Zoom
            in={!!result}
            style={{
              transitionDelay: result ? "100ms" : "0ms",
              display: result ? "block" : "none"
            }}
          >
            <Typography variant="h6" component="span">
              正解: {answerLabel}
            </Typography>
          </Zoom>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Question;
