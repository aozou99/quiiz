import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Header from "./sub/Header";
import Sidebar from "components/main/studio/pc/sub/SideBar";
import { useRouteMatch, Route, Switch } from "react-router-dom";
import QuizEditer from "./sub/main/QuizEditer";
import ReadyDescription from "components/common/meta/ReadyDescription";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    display: "flex",
    alignItems: "left",
    justifyContent: "start",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    paddingTop: theme.spacing(3),
  },
}));

const Main: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { path } = useRouteMatch();

  const handleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <Header handleDrawer={handleDrawer} />
      <Sidebar open={open} />
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Switch>
          <Route exact path={`${path}`}>
            <ReadyDescription />
          </Route>
          <Route path={`${path}/quiz`}>
            <QuizEditer />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default Main;
