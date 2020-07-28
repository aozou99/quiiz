import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "components/main/quiz/SideBar";
import { Route, Switch } from "react-router-dom";
import ReadyImage from "components/common/meta/Ready";
import Single from "components/main/quiz/home/Main";
import Header from "components/main/quiz/Header";
import TemporarySidebar from "components/main/quiz/TemporarySideBar";
import Library from "components/main/quiz/library/Main";
import { grey } from "@material-ui/core/colors";

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
    zIndex: 1200,
    height: "100vh",
    backgroundColor: grey[100],
  },
}));

const Main: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

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
          <Route exact path={`/`}>
            <Single />
          </Route>
          <Route path={`/trending`}>
            <ReadyImage />
          </Route>
          <Route path={`/subscriptions`}>
            <ReadyImage />
          </Route>
          <Route path={`/library`}>
            <Library />
          </Route>
        </Switch>
      </main>
    </div>
  );
};

export default Main;
