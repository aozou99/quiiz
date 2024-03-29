import React from "react";
import { Box, Typography, Theme, makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { contactUsLink, openAnotherTab } from "utils/helper/link";

const useStyles = makeStyles((theme: Theme) => ({
  listRoot: {
    margin: theme.spacing(0),
    padding: theme.spacing(0.5, 3),
    listStyle: "circle",
    "&>li": {
      cursor: "pointer",
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
        <li
          onClick={() => {
            history.push("/privacy");
            onLink && onLink();
          }}
        >
          <Typography variant={"caption"} color={"textSecondary"}>
            プライバシーポリシー
          </Typography>
        </li>
        <li
          onClick={() => {
            history.push("/credit");
            onLink && onLink();
          }}
        >
          <Typography variant={"caption"} color={"textSecondary"}>
            クレジット表記
          </Typography>
        </li>
        <li
          onClick={() => {
            openAnotherTab(contactUsLink());
            onLink && onLink();
          }}
        >
          <Typography variant={"caption"} color={"textSecondary"}>
            お問い合わせ
          </Typography>
        </li>
      </ul>
    </Box>
  );
};
