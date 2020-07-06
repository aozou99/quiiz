import {
  Box,
  makeStyles,
  Theme,
  Typography,
  CircularProgress,
  IconButton,
  Grid,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Img } from "react-image";
import ReplayIcon from "@material-ui/icons/Replay";
import imageUrl from "utils/helper/imageUrl";
import clsx from "clsx";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { QuizTableRowData } from "types/QuizTypes";

type State = {
  rowData: QuizTableRowData;
  handleEdit: () => any;
  handleDelete: () => any;
  handleAnalyze: () => any;
  handlePreview: () => any;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
  },
  thumbnail: {
    width: 120,
  },
  description: {
    marginLeft: theme.spacing(2),
    "&>*": {
      width: 200,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      display: "block",
    },
  },
  iconButtonLabel: {
    display: "flex",
    flexDirection: "column",
  },
  hoverAppear: {
    alignItems: "center",
    width: 200,
    paddingLeft: theme.spacing(1),
  },
}));

const QuizCell: React.FC<State> = ({
  rowData,
  handleEdit,
  handleAnalyze,
  handleDelete,
  handlePreview,
}) => {
  const classes = useStyles();
  const [imgSrc, setImgSrc] = useState();
  useEffect(() => {
    let unmounted = false;
    const loadUrl = async () => {
      const path = await imageUrl(rowData.thumbnail, "256x144");
      if (!unmounted) {
        setImgSrc(path);
      }
    };
    loadUrl().catch(() => {
      setTimeout(loadUrl, 1000);
    });
    return () => {
      unmounted = true;
    };
  }, [rowData.thumbnail]);

  return (
    <Box className={classes.root}>
      {imgSrc ? (
        <Img
          src={imgSrc || ""}
          className={classes.thumbnail}
          alt={rowData.question}
          loader={<CircularProgress />}
          unloader={
            <IconButton
              className={classes.thumbnail}
              classes={{ label: classes.iconButtonLabel }}
              onClick={() => {
                imageUrl(rowData.thumbnail, "256x144")
                  .then((path) => {
                    setImgSrc(path);
                  })
                  .catch((e) => console.error(e));
              }}
            >
              <ReplayIcon />
              <Typography variant={"caption"}>再読み込み</Typography>
            </IconButton>
          }
        />
      ) : (
        <CircularProgress />
      )}
      <div className={clsx(classes.description, "hoverHidden")}>
        <Typography variant="subtitle2" gutterBottom>
          {rowData.question}
        </Typography>
        <Typography variant="caption">{rowData.description}</Typography>
      </div>
      <Grid container className={clsx(classes.hoverAppear, "hoverAppear")}>
        <Grid item xs={3}>
          <IconButton aria-label="edit" onClick={handleEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
        <Grid item xs={3}>
          <IconButton aria-label="preview" onClick={handlePreview}>
            <PlayCircleFilledIcon />
          </IconButton>
        </Grid>
        <Grid item xs={3}>
          <IconButton aria-label="analyze" onClick={handleAnalyze}>
            <AssessmentIcon />
          </IconButton>
        </Grid>
        <Grid item xs={3}>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuizCell;
