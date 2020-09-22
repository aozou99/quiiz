import React, { createContext, ReactChild, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  Backdrop,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { Redirect, Route, Switch } from "react-router-dom";
import Sidebar from "components/main/quiz/SideBar";
import ReadyDescription from "components/common/meta/ReadyDescription";
import Home from "components/main/quiz/home/Main";
import Search from "components/main/quiz/search/Main";
import Header from "components/main/quiz/Header";
import TemporarySidebar from "components/main/quiz/TemporarySideBar";
import Library from "components/main/quiz/library/Main";
import PlayList from "components/main/quiz/playlist/Main";
import Channel from "components/main/quiz/channel/Main";
import Subscriptions from "components/main/quiz/subscriptions/Main";
import Terms from "components/main/quiz/terms/Main";
import Privacy from "components/main/quiz/privacy/Main";
import Credit from "components/main/quiz/credit/Main";
import Play from "components/main/quiz/play/Main";
import { SignInGuideDialog } from "components/common/dialog/SignInGuideDialog";
import BasicConfirmDialog from "components/common/dialog/BasicConfirmDialog";
import { MetaTag } from "components/common/meta/MetaTag";
import { BottomBar } from "components/common/bottomBar/BottomBar";

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
    [theme.breakpoints.down("sm")]: {
      paddingBottom: theme.spacing(7),
      minHeight: `calc(100vh - ${theme.spacing(12)}px)`,
      backgroundColor: "white",
    },
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
export const SignInGuideDialogContext = createContext({
  setOpenSignInDialog: (_open: boolean) => {},
  setSignInTitle: (_title: string) => {},
  setSignInBody: (_body: string) => {},
});
export const UnSubscribedDialogContext = createContext({
  setUnsubscDialogOpen: (_open: boolean) => {},
  setChannelName: (_channelName: string) => {},
  setHandleSubscribeOrCancel: (_a: any) => {},
});

const Main: React.FC = () => {
  const classes = useStyles();
  const [openSidebar, setOpenSidebar] = useState(false);
  const [foldSidebar, setFoldSidebar] = useState(false);
  // BackDropContext
  const [openBackDrop, setOpenBackDrop] = useState(false);
  const [backDropChildNode, setBackDropChildNode] = useState<ReactChild>(
    <CircularProgress />
  );
  // SignInGuideDialogContext
  const [openSignInDialog, setOpenSignInDialog] = useState(false);
  const [signInTitle, setSignInTitle] = useState("");
  const [signInBody, setSignInBody] = useState("");
  // UnSubscribedDialogContext
  const [channelName, setChannelName] = useState("");
  const [unsubscDialogOpen, setUnsubscDialogOpen] = useState(false);
  const [handleSubscribeOrCancel, setHandleSubscribeOrCancel] = useState<
    () => void
  >(() => {});

  const theme = useTheme();
  const isLargerLg = useMediaQuery(theme.breakpoints.up(1320));
  const isSmallerSm = useMediaQuery(theme.breakpoints.down("sm"), {
    noSsr: true,
  });
  const handleDrawer = () => {
    if (isLargerLg) {
      setFoldSidebar(!foldSidebar);
    } else {
      setOpenSidebar(!openSidebar);
    }
  };
  window.scrollTo({ top: 0 });

  return (
    <BackDropContext.Provider value={{ setOpenBackDrop, setBackDropChildNode }}>
      <div className={classes.root}>
        <Header handleDrawer={handleDrawer} />
        {!isSmallerSm && (
          <>
            <TemporarySidebar open={openSidebar} setOpen={setOpenSidebar} />
            <Sidebar foldSidebar={foldSidebar} />
          </>
        )}
        <SignInGuideDialogContext.Provider
          value={{ setOpenSignInDialog, setSignInTitle, setSignInBody }}
        >
          <UnSubscribedDialogContext.Provider
            value={{
              setUnsubscDialogOpen,
              setChannelName,
              setHandleSubscribeOrCancel,
            }}
          >
            <main className={classes.content}>
              <div className={classes.toolbar} />

              <Switch>
                <Route exact path={`/`}>
                  <Home />
                </Route>
                <Route exact path={`/search`}>
                  <Search />
                </Route>
                <Route path={`/trending`}>
                  <MetaTag title={"急上昇"} />
                  <ReadyDescription />
                </Route>
                <Route path={`/subscriptions`}>
                  <Subscriptions />
                </Route>
                <Route path={`/library`}>
                  <Library />
                </Route>
                <Route path={[`/playlist/:id`, `/playlist`]}>
                  <PlayList />
                </Route>
                <Route path={`/play/:id`}>
                  <Play />
                </Route>
                <Route path={`/channel/:id`}>
                  <Channel />
                </Route>
                <Route path={`/terms`}>
                  <Terms />
                </Route>
                <Route path={`/privacy`}>
                  <Privacy />
                </Route>
                <Route path={`/credit`}>
                  <Credit />
                </Route>
                <Route path={`*`}>
                  <Redirect to={"/404"} />
                </Route>
              </Switch>
            </main>
            {isSmallerSm && <BottomBar />}
          </UnSubscribedDialogContext.Provider>
        </SignInGuideDialogContext.Provider>
      </div>
      <BasicConfirmDialog
        body={`${channelName}のチャンネル登録を解除しますか？`}
        yesOnClick={() => {
          handleSubscribeOrCancel();
          setUnsubscDialogOpen(false);
        }}
        open={unsubscDialogOpen}
        setOpen={setUnsubscDialogOpen}
      />
      <Backdrop className={classes.backdrop} open={openBackDrop}>
        {backDropChildNode}
      </Backdrop>
      <SignInGuideDialog
        open={openSignInDialog}
        title={signInTitle}
        bodyText={signInBody}
        onClose={() => setOpenSignInDialog(false)}
      />
    </BackDropContext.Provider>
  );
};

export default Main;
