import React from "react";
import { Box, Typography, Theme, makeStyles } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) => ({
  listRoot: {
    margin: theme.spacing(0),
    padding: theme.spacing(0.5, 3),
    listStyle: "circle",
    "&>li>a": {
      textDecoration: "none",
    },
  },
}));
export const AboutQuiiz: React.FC<{
  className?: string;
  onLink?: () => any;
}> = ({ className, onLink }) => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Box className={className || ""}>
      <Typography variant={"subtitle2"} color={"textSecondary"}>
        Quiizについて
      </Typography>
      <ul className={classes.listRoot}>
        <li
          onClick={() => {
            history.push("/terms");
            onLink && onLink();
          }}
        >
          <Typography variant={"caption"} color={"textSecondary"}>
            利用規約
          </Typography>
        </li>
        <li>
          <Link to="/privacy">
            <Typography variant={"caption"} color={"textSecondary"}>
              プライバシーポリシー
            </Typography>
          </Link>
        </li>
      </ul>
    </Box>
  );
};
