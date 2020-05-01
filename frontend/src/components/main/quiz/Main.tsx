import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "components/main/quiz/SideBar";
import { useRouteMatch, Route, Switch } from "react-router-dom";
import ReadyImage from "components/common/meta/Ready";
import Index from "components/main/quiz/index/Main";
import Header from "components/main/quiz/Header";
import TemporarySidebar from "components/main/quiz/TemporarySideBar";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    display: "flex",
    alignItems: "left",
    justifyContent: "start",
    padding: theme.spacing(0, 1),
    minHeight: theme.spacing(5),
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
      <TemporarySidebar open={open} setOpen={setOpen} />
      <Sidebar />
      <main className={classes.content}>
        <div className={classes.toolbar} />

        <Switch>
          <Route exact path={`${path}`}>
            <Index />
          </Route>
          <Route path={`/trending`}>
            <ReadyImage />
          </Route>
          <Route path={`/subscriptions`}>
            <ReadyImage />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default Main;
