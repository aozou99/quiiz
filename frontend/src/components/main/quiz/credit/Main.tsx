import { Container, makeStyles, Theme, Typography } from "@material-ui/core";
import { MetaTag } from "components/common/meta/MetaTag";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3, 5),
    backgroundColor: theme.palette.background.default,
    minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
  },
}));

const Main = () => {
  const classes = useStyles();
  return (
    <Container maxWidth={"lg"} className={classes.root}>
      <MetaTag title={"クレジット"} />
      <Typography variant="h5" paragraph>
        クレジット
      </Typography>
      <Typography variant="h6">使用画像</Typography>
      <ul>
        <li>
          <a href="https://jp.freepik.com/vectors/web">
            Stories - jp.freepik.com によって作成された web ベクトル
          </a>
        </li>
        <li>
          <a href="https://jp.freepik.com/vectors/business">
            Pikisuperstar - jp.freepik.com によって作成された business ベクトル
          </a>
        </li>
      </ul>
    </Container>
  );
};

export default Main;
