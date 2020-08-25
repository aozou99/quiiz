import React, { createContext, ReactChild } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Sidebar from "components/main/quiz/SideBar";
import { Route, Switch } from "react-router-dom";
import ReadyImage from "components/common/meta/Ready";
import Single from "components/main/quiz/home/Main";
import Header from "components/main/quiz/Header";
import TemporarySidebar from "components/main/quiz/TemporarySideBar";
import Library from "components/main/quiz/library/Main";
import { grey } from "@material-ui/core/colors";
import PlayList from "components/main/quiz/playlist/Main";
import Channel from "components/main/quiz/channel/Main";
import { CircularProgress, Backdrop } from "@material-ui/core";

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
    minHeight: `calc(100vh - ${theme.spacing(3)}px)`,
    backgroundColor: grey[100],
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

export const BackDropContext = createContext({
  setOpenBackDrop: (_open: boolean) => {},
  setBackDropChildNode: (_child: ReactChild) => {},
});

const Main: React.FC = () => {
  const classes = useStyles();
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [openBackDrop, setOpenBackDrop] = React.useState(false);
  const [backDropChildNode, setBackDropChildNode] = React.useState<ReactChild>(
    <CircularProgress />
  );
  const handleDrawer = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <BackDropContext.Provider value={{ setOpenBackDrop, setBackDropChildNode }}>
      <div className={classes.root}>
        <Header handleDrawer={handleDrawer} />
        <TemporarySidebar open={openSidebar} setOpen={setOpenSidebar} />
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
            <Route path={`/playlist/:id`}>
              <PlayList />
            </Route>
            <Route path={`/channel/:id`}>
              <Channel />
            </Route>
          </Switch>
        </main>
      </div>
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        {backDropChildNode}
      </Backdrop>
    </BackDropContext.Provider>
  );
};

export default Main;
