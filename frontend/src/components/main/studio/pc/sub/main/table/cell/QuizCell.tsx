import {
  Box,
  makeStyles,
  Theme,
  Typography,
  CircularProgress,
  IconButton
} from "@material-ui/core";
import React, { useState } from "react";
import Img from "react-image";
import ReplayIcon from "@material-ui/icons/Replay";
import imageUrl from "utils/helper/imageUrl";

type State = {
  thumbnail: string;
  question: string;
  description: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex"
  },
  thumbnail: {
    width: 120
  },
  description: {
    marginLeft: theme.spacing(2),
    "&>*": {
      width: 200,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    }
  },
  iconButtonLabel: {
    display: "flex",
    flexDirection: "column"
  }
}));

const QuizCell: React.FC<State> = ({ thumbnail, question, description }) => {
  const classes = useStyles();
  const [imgSrc, setImgSrc] = useState(thumbnail);

  return (
    <Box className={classes.root}>
      <Img
        src={imgSrc}
        className={classes.thumbnail}
        alt={question}
        loader={<CircularProgress />}
        unloader={
          <IconButton
            className={classes.thumbnail}
            classes={{ label: classes.iconButtonLabel }}
            onClick={async () =>
              setImgSrc(await imageUrl(thumbnail, "256x144"))
            }
          >
            <ReplayIcon />
            <Typography variant={"caption"}>再読み込み</Typography>
          </IconButton>
        }
      />
      <div className={classes.description}>
        <Typography variant="subtitle2" gutterBottom>
          {question}
        </Typography>
        <Typography variant="caption">{description}</Typography>
      </div>
    </Box>
  );
};

export default QuizCell;
