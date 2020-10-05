import {
  makeStyles,
  Theme,
  createStyles,
  Paper,
  Chip,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      listStyle: "none",
      padding: theme.spacing(0.5),
      margin: 0,
    },
    chip: {
      margin: theme.spacing(0.5),
    },
  })
);

export const TagList = ({ tags }: { tags: string[] }) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Paper component="ul" className={classes.root} elevation={0}>
      {tags.map((label, i) => (
        <li
          key={i}
          onClick={() => {
            history.push(`/search?keyword=${label}`);
          }}
        >
          <Chip label={label} className={classes.chip} />
        </li>
      ))}
    </Paper>
  );
};
